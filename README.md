# Tixo - Next Generation Social Platform

**Tixo** is a modern, production-ready social media web application designed with a unique aesthetic and feature set focusing on text-first feeds, immersive short-form video, and AI-enhanced messaging.

> **Legal Notice**: Tixo is an original user interface design. This repository intentionally avoids reproducing existing social network UI/branding (Instagram/Twitter/Telegram). All assets are generic placeholders. The name "Tixo" is fictional.

## ✨ Key Features

*   **Text-First Feed**: A clean, typography-focused stream for thoughts and updates, supporting rich media and nested Reposts (Quotes).
*   **Tixo Clips**: A vertical video experience with a unique bottom-bar interaction model and floating glass-morphism metadata cards.
*   **Telegram-Style Chat**: Dense, efficient messaging supporting 1:1, Groups, and Channels.
*   **AI Agent Integration**: Toggleable Gemini-powered AI assistant that participates in chats using distinct system-styled message cards.
*   **Ephemeral Stories**: 24-hour content with progress tracking.

## 🎨 Design Rationale

See [DESIGN_RATIONALE.md](./DESIGN_RATIONALE.md) for a detailed breakdown of how Tixo differs from Instagram, Twitter, and Telegram to ensure uniqueness.

## 🛠 Tech Stack

*   **Framework**: React 19, React Router v7
*   **Styling**: Tailwind CSS (Custom "Neon Mint" Theme)
*   **Icons**: Lucide React
*   **AI**: Google Gemini API
*   **Container**: Docker & Docker Compose

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/your-org/tixo.git
cd tixo
npm install
```

### 2. Environment
Create a `.env` file (see `.env.sample`):
```bash
API_KEY=your_gemini_api_key
```

### 3. Run Locally
```bash
npm start
# App runs at http://localhost:3000
```

### 4. Docker Deployment
```bash
docker-compose up --build
# App runs at http://localhost:3000
```

## 🧪 Testing
Run the test suite:
```bash
npm test
```

## 📂 Project Structure

*   `src/components` - Atomic UI components (PostCard, Sidebar).
*   `src/pages` - Route views (Feed, Reels, Messages).
*   `src/services` - Mock Database and API integrations.
*   `src/types.ts` - TypeScript definitions for Tixo data models.

## License
MIT