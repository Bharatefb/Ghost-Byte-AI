GHOSTBYTE 👻
A little memory. An endless afterlife.

GHOSTBYTE is a local-first, AI-powered memory archive that preserves personal stories, explores forgotten memories, and transforms moments from the past into fictional supernatural stories.

Powered by Qwen2.5 1.5B through Ollama, GHOSTBYTE brings open-weight AI to a private digital archive running on your own computer.

👻 The Idea

Memories are fragile. Devices fail, services disappear, and personal stories can be lost.

GHOSTBYTE gives those stories a place to live.

Save a memory. Ask the archive about the past. Or let a local AI transform a familiar moment into an eerie fictional tale.

The goal is not to replace human memory, but to preserve it and explore it in new ways.

✨ Features
Memory Vault: Create, search, edit, and delete personal memories.
Ask the Archive: Ask questions about saved memories using locally running AI.
Ghost Story Studio: Generate supernatural fiction inspired by selected memories.
Persistent Storage: Store memories and generated stories in Microsoft SQL Server.
Local AI: Run Qwen2.5 1.5B using Ollama without a hosted AI API.
Privacy by Design: Keep personal stories on your own machine.
Offline-capable: Use core features without internet after installing dependencies and downloading the model.
🧠 Technology Stack
HTML, CSS, and vanilla JavaScript
Node.js and Express
Qwen2.5 1.5B through Ollama
Microsoft SQL Server
Node.js mssql package
🔓 Why Open Innovation?

GHOSTBYTE is built around the idea that personal memories should not need to be uploaded to a third-party AI service to become useful.

Running an open-weight model locally gives users greater control over their data, model selection, and inference environment. SQL Server provides persistent storage, while Node.js connects the archive to local AI.

There is no required hosted AI API and no per-request fee from a hosted AI provider.

Open innovation also makes the project adaptable: developers can experiment with other compatible Ollama models, change prompts, improve retrieval, and extend the archive without rebuilding the application around a proprietary AI service.

🏗️ Architecture
The browser provides the Memory Vault, Archive Chat, and Story Studio.
Express validates requests and handles application logic.
Microsoft SQL Server stores memories and generated stories.
Ollama runs Qwen locally to answer archive questions and generate fiction.
AI responses return to the browser for display.
⚙️ Requirements
Node.js 18 or newer
Microsoft SQL Server
SQL Server Management Studio (recommended)
Ollama installed and running
Sufficient RAM and disk space for Qwen2.5 1.5B
🚀 Setup
Clone or download the project.
Install dependencies:
bash
npm install

Download the model:
bash
ollama pull Qwen2.5 1.5B

Open database/schema.sql in SQL Server Management Studio and execute it.
Copy .env.example to .env and configure your SQL Server connection credentials.
Start Ollama and ensure the model is available.
Start GHOSTBYTE:
bash
npm start

Open http://127.0.0.1:3000 in your browser.
🔒 Privacy and Limitations

GHOSTBYTE is designed for local use. Its application server listens on the loopback interface, and AI requests go to the configured Ollama endpoint.

The initial setup requires downloading dependencies and the model. Offline use assumes SQL Server, Ollama, and the application are running locally.

The AI may misunderstand or invent details. Archive answers should be checked against the original memories, and generated ghost stories are fiction rather than evidence of supernatural events.

Before using real sensitive family information, configure database permissions, backups, and appropriate access controls.

🌒 The Vision

A digital archive that remembers what we might forget.

A storyteller that gives the past another voice.

A machine that preserves fragments of the people and moments that made us who we are.

Some memories fade. Others become part of the machine.