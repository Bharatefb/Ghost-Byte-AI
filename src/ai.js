
import "dotenv/config";

const ollamaUrl = (
  process.env.OLLAMA_URL || "http://127.0.0.1:11434"
).replace(/\/$/, "");

const model = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";

export async function askLocalAI(system, prompt, temperature = 0.7) {
  let response;

  try {
    response = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(120000),
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ],
        options: { temperature }
      })
    });
  } catch (error) {
    throw Object.assign(
      new Error(
        error.name === "TimeoutError"
          ? "The local AI took too long to respond."
          : "Cannot connect to Ollama. Start Ollama and check the model."
      ),
      { status: 503 }
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw Object.assign(
        new Error(`Model not found. Run: ollama pull ${model}`),
        { status: 503 }
      );
    }

    throw Object.assign(
      new Error(`Ollama returned HTTP ${response.status}.`),
      { status: 502 }
    );
  }

  const result = await response.json();
  const content = result?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw Object.assign(
      new Error("The local AI returned an empty response."),
      { status: 502 }
    );
  }

  return content.trim();
}

export { model, ollamaUrl };
