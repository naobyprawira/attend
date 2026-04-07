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

## App Container Release (API + Web in Single Image)

If you want to deploy the website stack from this repository in production as a single container image with dual-mode services, use:

- Workflow: `.github/workflows/publish-app-image.yml`
- Stack file: `docker-compose.prod.yml`
- Entrypoint: `entrypoint.sh`

Both API and Web services run from one image, controlled by `MODE=api` or `MODE=web` environment variables.

### 1) Configure GitHub Variable

Set this repository variable in GitHub:

- `NEXT_PUBLIC_API_URL` = your public API base URL (example: `https://api.example.com`)

Why: `NEXT_PUBLIC_API_URL` is compiled into the Next.js frontend at image build time.

### 2) Publish Image to GHCR

Trigger one of the following:

- Push to `main` (when `server/**`, `web/**`, `Dockerfile`, or `entrypoint.sh` changes)
- Push a version tag like `v1.0.0`
- Manual run: Actions -> **Publish App Image** -> Run workflow

Image target:

- `ghcr.io/<github-owner>/attend:prod`

After first publish, open the package page in GitHub and set visibility to **Public**. Latest images publish to `latest` tag; promote to `prod` when tested and ready.

### 3) Deploy in Portainer CE with Prod Images

Option A (preferred): connect Portainer directly to this repository.

1. In Portainer, go to **Stacks** -> **Add stack**.
2. Choose **Repository**.
3. Set:
	- Repository URL = this repository URL
	- Compose path = `docker-compose.prod.yml`
	- Reference = your branch (for example `main`)
4. Set environment variables in the stack UI:
	- `GHCR_OWNER` = your GitHub owner/org (optional, default: `maulairfani`)
	- `IMAGE_TAG` = `prod` (or a specific tag/sha for testing)
	- `DATABASE_URL` = `postgresql+asyncpg://attend:attend@postgres:5432/attend`
	- `AI_WS_UPSTREAM_URL` = `ws://ai-backend:5679`
	- `SECRET_KEY` = strong random string
	- `CORS_ORIGINS` = your web origins
	- `API_PORT` = `5678`
	- `WEB_PORT` = `3000` (or your desired external port)
	- `NEXT_PUBLIC_API_URL` = your public API URL (baked into web at image build)
5. Click **Deploy the stack** — both services will start from the single image.

Option B (fallback for older CE setups): use **Web editor** and paste `docker-compose.prod.yml` manually.

This stack intentionally excludes AI and camera containers. It still requires external dependencies on `attend_network`:

- PostgreSQL at `postgres:5432`
- AI backend at `ai-backend:5679`

Open `http://<your-server-ip>:<WEB_PORT>`.

### Prod Tag Strategy

Images are published with multiple tags:

- `latest`: unstable, latest build from main
- `prod`: stable, manually promoted from latest when tested
- `v1.0.0`, `v1.1.0`, etc.: release versions
- `sha-abc123def`: commit-specific immutable tag

For Portainer production, always use `prod` tag (default in `docker-compose.prod.yml` as `IMAGE_TAG=prod`). Manually retag images from `latest` to `prod` in GHCR when ready.

Single image (`attend`) serves both API and Web services via `MODE` environment variable (set by compose automatically).

### 4) Updating the Running Stack in Portainer CE

Portainer CE does not provide a full native GitOps image update loop. Typical update flow:

1. Push code to `main` (or a tag) so GitHub Actions publishes new images.
2. Manually promote tested images from `latest` → `prod` tag in GHCR.
3. In Portainer, open the stack and use **Pull and redeploy** (or redeploy the stack) to fetch the latest `prod` images.

If API URL changes, update `NEXT_PUBLIC_API_URL` in GitHub variables and republish the web image.

