# Attend.AI

Smart attendance system using real-time face recognition. Detects and identifies people through camera feeds, logs attendance events, and provides a dashboard for monitoring.

## Stack

- **Backend** — Python, FastAPI, PostgreSQL (SQLAlchemy async + Alembic)
- **Frontend** — Next.js 16, Tailwind CSS
- **ML** — DeepFace (face recognition), Ultralytics YOLO (segmentation)

## Setup

### Database URL Convention

Use one explicit rule: pick the URL by execution context.

| Context | DATABASE_URL | Use When |
| --- | --- | --- |
| Local host runtime | `postgresql+asyncpg://postgres:postgres@localhost:5432/attend` | Running `python -m server.main` directly on your machine |
| Docker Compose runtime | `postgresql+asyncpg://attend:attend@postgres:5432/attend` | Running API container from `docker-compose.yml` |

### Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Set DB + auth config
export DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/attend"
export SECRET_KEY="replace-with-long-random-string"

# Run server (auto-migrates DB and seeds a super_admin user on first run)
python -m server.main
```

Server runs on `http://localhost:5678`.
Default super admin credentials: **username** `admin` / **password** `admin`

If you are on Windows PowerShell, use:

```powershell
$env:DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/attend"
$env:SECRET_KEY="replace-with-long-random-string"
```

### Frontend

```bash
cd web
npm install
npm run dev
```

App runs on `http://localhost:3000`.
Requires Node.js `>=20.9.0` for Next.js 16.

### Camera Client

```bash
# Stream from default camera (index 0)
python camera/camera.py

# Options
python camera/camera.py --server 127.0.0.1 --port 5678 --camera 0 --no-preview
```

Requires `opencv-python` and `websockets`. Press `q` in the preview window to quit.

### Docker Compose

```bash
cp .env.example .env
docker compose up -d --build
```

Default `docker-compose.yml` starts the app stack (`web` + `api`) only.
AI/ML backend is hosted in the separate `attend-mlops` repository: [attend-mlops](https://github.com/maulairfani/attend-mlops).

Compose DB credentials follow the table above and are defined in `.env.example`.

This app stack expects the following services to already exist on `attend_network`:

- PostgreSQL at `postgres:5432`
- AI backend at `ai-backend:5679`

## Two-Repo Deployment Topology

- Repo 1 (`attend`): app stack (`web` + `api`)
- Repo 2 (`attend-mlops`): AI backend stack (`ai-backend`)
- Optional separate infra repo/folder: PostgreSQL stack (`postgres`)

All stacks must join the same external Docker network: `attend_network`.

