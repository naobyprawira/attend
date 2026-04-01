# Attend.AI

Smart attendance system using real-time face recognition. Detects and identifies people through camera feeds, logs attendance events, and provides a dashboard for monitoring.

## Stack

- **Backend** — Python, FastAPI, SQLite (SQLAlchemy async + Alembic)
- **Frontend** — Next.js 15, Tailwind CSS
- **ML** — DeepFace (face recognition), Ultralytics YOLO (segmentation)

## Setup

### Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run server (auto-migrates DB and seeds admin user on first run)
python -m server.main
```

Server runs on `http://localhost:5678`.
Default credentials: **username** `admin` / **password** `admin`

### Frontend

```bash
cd web
npm install
npm run dev
```

App runs on `http://localhost:3000`.

### Camera Client

```bash
# Stream from default camera (index 0)
python camera/camera.py

# Options
python camera/camera.py --server 127.0.0.1 --port 5678 --camera 0 --no-preview
```

Requires `opencv-python` and `websockets`. Press `q` in the preview window to quit.
