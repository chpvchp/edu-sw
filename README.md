# EduSW (Education Software Web App)

EduSW is a fullstack education software built on the fullstack web modern.

- **Frontend:** React + TypeScript + Vite
- **Backend:** Python 3.13 (FastAPI)
- **Infrastructure:** Nginx / Cloudflare configuration / Docker
- **Development OS:** Ubuntu Desktop 26.04

## Project Architecture
```text
edu-sw/
├── .cloudflare/            # Cloudflare configuration
├── .data/                  # Data storage
├── .docs/                  # Documentation
├── .nginx/                 # Nginx configuratioon
├── backend/                # Backend Python
├── frontend/               # Frontend React + Vite
├── docker-compose.yml      # Docker setup services
```

## Architecture Diagram
```text
[User]
   ↓
[Cloudflare Tunnel]
   ↓
[Nginx Reverse Proxy]
   ↓
[Frontend (React)]
   ↓
[Backend (FastAPI)]
   ↓
[Database / Storage]
```

## Getting Started
### Clone Repository
```bash
git clone https://github.com/chpvchp/edu-sw.git
cd edu-sw
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
Recommended `requirements_freeze.txt`.

If you update new version, you should use `requirements.txt`

```bash
python3 -m venv .venv
source .venv/bin/activate
```

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

### Docker
```bash
docker compose up -d
```

### Author
*Cao Hoàng Phúc*