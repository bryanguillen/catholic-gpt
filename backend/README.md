# Catholic GPT - Backend (NestJS)

This is the backend service for **Catholic GPT**, a Catholic AI apologist web app. The backend is built using **NestJS** and serves as the API layer and persistence layer for the frontend client.

## 🛠️ Tech Stack

- **Node.js** (Recommended version: see `.nvmrc` at the root of the repository)
- **NestJS** (Modular backend framework)
- **PostgreSQL** (Database)
- **TypeORM** (ORM for database interactions)
- **Jest** (Testing)
- **ESLint & Prettier** (Linting & formatting)
- **Docker** (Containerization for local development)

## 🚀 Scripts

Here are the main scripts to run and manage the backend:

| Command              | Description |
|---------------------|-------------|
| `npm run start:dev`  | Start the backend in development mode (with hot reload) |
| `npm run test`       | Run unit tests using Jest |
| `npm run migrate:generate` | Generate TypeORM migrations based on entity changes |
| `npm run lint`       | Run ESLint for code quality |
| `npm run format`     | Run Prettier for consistent formatting |

## 🧰 Setup Instructions

### Option 1: Bare Metal Setup (Traditional)

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Ensure correct Node version** (recommended):
    ```bash
    nvm use
    ```

3. **Configure environment variables**:
    - Copy `.env.example` to `.env`.
    - Update with your Postgres and OpenAI credentials.

4. **Run the app locally**:
    ```bash
    npm run start:dev
    ```

### Option 2: Docker Setup

1. **Ensure Docker is installed** on your machine. You can download it from the [Docker website](https://www.docker.com/products/docker-desktop).

2. **Build and run the Docker containers**:
    ```bash
    docker-compose up --build -d
    ```

   This command will build the Docker image and start the backend and database containers in detached mode.

3. **Access the backend**: The backend service will be available at `http://localhost:3000`.

4. **View logs**: To view the logs of the running containers, use:
    ```bash
    docker-compose logs -f
    ```

5. **Stop the containers**: To stop the running containers, use:
    ```bash
    docker-compose down
    ```

## 📂 Environment Variables

__Note: Only required when running the app via the traditional approach.__

Create a `.env` file in the backend directory based on the following example:

```ini
# Database Connection (replace with your local Postgres settings)
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=

# TypeORM settings - Use these for dev only
DB_SYNCHRONIZE=true
DB_AUTO_LOAD_ENTITIES=true

# OpenAI Integration (leave blank if using mock responses)
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

> ⚠️ In production, set `DB_SYNCHRONIZE=false` and rely on migrations.

## 🛠️ Running Migrations

To **generate** migrations after updating entities:
```bash
npm run migrate:generate -- MigrationName
```

To **apply** migrations (if needed):
```bash
npm run typeorm migration:run
```

## ✅ Testing

To run all backend tests:
```bash
npm run test
```

## 🔗 Connecting to the Frontend

The frontend (running on `http://localhost:5173`) will automatically communicate with this backend, as long as `CORS_ORIGIN` is set correctly in your `.env`.

## 📝 Contribution

The `backend` is not open for contribution yet.

## 📄 License

This project is licensed under the **GNU AGPL v3**. See the [LICENSE](../LICENSE) file for details.

## Questions?

Feel free to reach out on [Discord](https://discord.gg/bAmCr5gu).