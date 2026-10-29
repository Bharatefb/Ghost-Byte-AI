
const $ = (selector) => document.querySelector(selector);

const memoryForm = $("#memoryForm");
const memoryList = $("#memoryList");
const memorySearch = $("#memorySearch");
let memories = [];

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function button(text, className, action) {
  const node = el("button", className, text);
  node.type = "button";
  node.addEventListener("click", action);
  return node;
}

function setMessage(selector, message) {
  $(selector).textContent = message;
}

function showView(name) {
  document.querySelectorAll(".view").forEach(view => {
    view.classList.toggle("hidden", view.id !== `${name}View`);
  });

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.view === name);
  });
}

document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => showView(item.dataset.view));
});

function resetMemoryForm() {
  memoryForm.reset();
  $("#memoryId").value = "";
  setMessage("#memoryFormMessage", "");
}

$("#newMemory").addEventListener("click", () => {
  resetMemoryForm();
  memoryForm.classList.remove("hidden");
  memoryForm.scrollIntoView({ behavior: "smooth", block: "start" });
  $("#memoryTitle").focus();
});

$("#cancelMemory").addEventListener("click", () => {
  memoryForm.classList.add("hidden");
  resetMemoryForm();
});

function fillMemoryForm(memory) {
  $("#memoryId").value = memory.Id;
  $("#memoryTitle").value = memory.Title || "";
  $("#memoryDate").value = memory.MemoryDate
    ? String(memory.MemoryDate).slice(0, 10) : "";
  $("#memoryPeople").value = memory.People || "";
  $("#memoryLocation").value = memory.Location || "";
  $("#memoryTags").value = memory.Tags || "";
  $("#memoryContent").value = memory.Content || "";

  memoryForm.classList.remove("hidden");
  memoryForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

memoryForm.addEventListener("submit", async event => {
  event.preventDefault();
  const id = $("#memoryId").value;

  const payload = {
    title: $("#memoryTitle").value,
    memoryDate: $("#memoryDate").value || null,
    people: $("#memoryPeople").value,
    location: $("#memoryLocation").value,
    tags: $("#memoryTags").value,
    content: $("#memoryContent").value
  };

  try {
    await api(id ? `/api/memories/${id}` : "/api/memories", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });

    memoryForm.classList.add("hidden");
    resetMemoryForm();
    await loadMemories();
    setMessage("#memoryFormMessage", "Memory preserved.");
  } catch (error) {
    setMessage("#memoryFormMessage", error.message);
  }
});

function renderMemories() {
  const query = memorySearch.value.trim().toLowerCase();

  const filtered = memories.filter(memory =>
    [
      memory.Title, memory.Content, memory.People,
      memory.Location, memory.Tags
    ].some(value => String(value || "").toLowerCase().includes(query))
  );

  memoryList.replaceChildren();
  $("#memoryCount").textContent = `${memories.length} MEMORIES`;

  if (!filtered.length) {
    memoryList.append(
      el("p", "muted", memories.length
        ? "No memories match your search."
        : "The vault is quiet. Preserve your first memory.")
    );
  }

  for (const memory of filtered) {
    const card = el("article", "memory-card");
    card.append(
      el("span", "memory-date",
        memory.MemoryDate
          ? String(memory.MemoryDate).slice(0, 10)
          : "DATE UNKNOWN"),
      el("h3", "", memory.Title),
      el("p", "", memory.Content.length > 180
        ? memory.Content.slice(0, 180) + "…" : memory.Content)
    );

    if (memory.People) card.append(el("p", "muted", `People: ${memory.People}`));
    if (memory.Location) card.append(el("p", "muted", `Place: ${memory.Location}`));

    const tags = el("div");
    String(memory.Tags || "").split(",").map(tag => tag.trim())
      .filter(Boolean).forEach(tag => tags.append(el("span", "tag", tag)));
    card.append(tags);

    const actions = el("div", "card-actions");
    actions.append(
      button("Edit", "text-button", () => fillMemoryForm(memory)),
      button("Make a ghost story", "text-button", () => {
        $("#storyMemory").value = memory.Id;
        showView("stories");
        $("#storyForm").scrollIntoView({ behavior: "smooth" });
      }),
      button("Delete", "text-button danger", async () => {
        if (!confirm(`Permanently delete "${memory.Title}"?`)) return;
        try {
          await api(`/api/memories/${memory.Id}`, { method: "DELETE" });
          await loadMemories();
        } catch (error) {
          alert(error.message);
        }
      })
    );

    card.append(actions);
    memoryList.append(card);
  }

  const select = $("#storyMemory");
  const previous = select.value;
  select.replaceChildren(
    new Option("Select a memory from the vault", "")
  );

  memories.forEach(memory => {
    select.add(new Option(memory.Title, memory.Id));
  });

  if (memories.some(memory => memory.Id === previous)) {
    select.value = previous;
  }
}

async function loadMemories() {
  memories = await api("/api/memories");
  renderMemories();
}

memorySearch.addEventListener("input", renderMemories);

$("#askForm").addEventListener("submit", async event => {
  event.preventDefault();
  const answer = $("#answer");
  answer.textContent = "The archive is searching its fragments…";

  try {
    const result = await api("/api/ask", {
      method: "POST",
      body: JSON.stringify({ question: $("#question").value })
    });
    answer.textContent = result.answer;
  } catch (error) {
    answer.textContent = error.message;
  }
});

$("#storyForm").addEventListener("submit", async event => {
  event.preventDefault();
  const output = $("#storyResult");
  output.textContent = "The machine is listening to the past…";

  try {
    const story = await api("/api/stories", {
      method: "POST",
      body: JSON.stringify({
        memoryId: $("#storyMemory").value,
        tone: $("#storyTone").value
      })
    });

    output.replaceChildren(
      el("span", "eyebrow", "FICTION · INSPIRED BY A MEMORY"),
      el("h2", "", story.title),
      el("p", "", story.content)
    );

    await loadStories();
  } catch (error) {
    output.textContent = error.message;
  }
});

async function loadStories() {
  const list = $("#storyList");
  const stories = await api("/api/stories");
  list.replaceChildren();

  if (!stories.length) {
    list.append(el("p", "muted", "No stories have been summoned yet."));
    return;
  }

  for (const story of stories) {
    const card = el("article", "story-card");
    card.append(
      el("span", "eyebrow", `FICTION · ${story.Tone}`),
      el("h3", "", story.Title),
      el("p", "", story.Content)
    );
    list.append(card);
  }
}

async function checkStatus() {
  const dot = $("#statusDot");
  const label = $("#statusText");

  try {
    const status = await api("/api/status");
    const ready = status.ready;
    dot.classList.toggle("ready", ready);

    label.textContent = ready
      ? "SQL Server connected · Local AI ready"
      : `Database: ${status.databaseReady ? "online" : "offline"} · ` +
        `AI: ${status.modelReady ? "ready" : "offline"}`;
  } catch {
    dot.classList.remove("ready");
    label.textContent = "Unable to check system status";
  }
}

async function initialize() {
  try {
    await loadMemories();
    await loadStories();
  } catch (error) {
    memoryList.replaceChildren(
      el("p", "muted", `Could not load the archive: ${error.message}`)
    );
  }

  await checkStatus();
}

initialize();
