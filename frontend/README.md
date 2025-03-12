# Catholic GPT Frontend

Welcome to the **Catholic GPT Frontend** — a React-based single-page application (SPA) designed to serve as the frontend for **Catholic GPT**, an AI-powered Catholic apologist tool.

This project is part of an open source initiative to create an AI assistant that helps lay Catholics learn more about their faith through trustworthy and Catholic-sourced responses.

## Tech Stack

- **Framework**: React (SPA)
- **Bundler**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with Shadcn components)
- **Linting & Formatting**: ESLint & Prettier
- **Testing**: ViteTest

## Getting Started

### Prerequisites

- **Node.js** (Recommended version: see `.nvmrc` at the root of the repository)

### Installation

1. Clone the repository (or your fork):

    ```bash
    git clone https://github.com/your-username/catholic-gpt.git
    cd catholic-gpt
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up your `.env` file:

    Copy `.env.example` to `.env`:

    ```bash
    cp .env.example .env
    ```

    Update `VITE_API_URL` to point to your backend, e.g.:

    ```
    VITE_API_URL=http://localhost:3000
    ```

### Available Scripts

| Script   | Description |
|----------|-------------|
| `npm run dev` | Starts the development server at [http://localhost:5173](http://localhost:5173) (default Vite port) |
| `npm run lint` | Runs ESLint to check for code issues |
| `npm run format` | Runs Prettier to format code |
| `npm run test` | Runs unit tests with ViteTest |

## Project Structure

```
frontend/
├── src/
│   ├── components/        // Reusable components
│   ├── lib/               // Utility functions
│   ├── pages/              // Top-level pages
│   ├── App.tsx              // Root app component
│   ├── main.tsx             // Vite entry point
│   └── index.css            // Global styles
├── public/                  // Static assets
├── .env.example              // Environment variables example
├── package.json              // Project config
└── vite.config.ts            // Vite configuration
```

## Development Process

- New anonymous users are created automatically on first page load (via local storage user ID).
- Conversations persist within a single session (tab) and are tied to this anonymous user.
- Closing the tab ends the session, and returning to the app starts fresh.

## Contributing

Please read the [CONTRIBUTING.md](./CONTRIBUTING.md).

### Important Note on Issues

For now, **only project maintainers may create new GitHub issues** to keep contributions aligned with the roadmap. If you have a feature suggestion, bug report, or question, please comment on existing issues or join on [Discord](https://discord.gg/bAmCr5gu) once open.

## Environment Variables

The app requires a `.env` file in the project root. Example:

```
VITE_API_URL=http://localhost:3000
```

This points to the backend API.

## License

This project is licensed under the **GNU AGPL v3**. See the [LICENSE](../LICENSE) file for details.

## Questions?

Feel free to reach out on [Discord](https://discord.gg/bAmCr5gu).
