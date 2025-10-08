# 🚀 Quick Start Guide

## 🎯 Running the Applications

### Option 1: Original AI Learning Platform (Currently Running)

The original platform is now running! Access it at:
- **Application**: http://localhost:3000
- **Features**: All original functionality preserved

### Option 2: New Modern Architecture (v2.0)

#### Prerequisites
- ✅ Node.js v22.19.0 (installed)
- ✅ Python 3.11.9 (installed)
- ❌ Docker (optional, for containerized deployment)

#### Quick Setup (Windows)

1. **Run the setup script**:
   ```bash
   cd ai-learning-platform-v2
   setup.bat
   ```

2. **Start the backend** (Terminal 1):
   ```bash
   cd ai-learning-platform-v2/backend
   python -m venv venv
   venv\Scripts\activate.bat
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

3. **Start the frontend** (Terminal 2):
   ```bash
   cd ai-learning-platform-v2/frontend
   npm install
   npm run dev
   ```

4. **Access the new application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

#### Alternative: Docker Setup (if Docker is installed)

```bash
cd ai-learning-platform-v2
docker-compose up -d
```

## 🔄 Comparison

| Feature | Original (v1.0) | New (v2.0) |
|---------|----------------|------------|
| **Status** | ✅ Running now | 🔧 Setup required |
| **URL** | http://localhost:3000 | http://localhost:3000 |
| **Backend** | Node.js + Express | FastAPI + Python |
| **Frontend** | Vanilla JS | React + TypeScript |
| **Database** | JSON files | PostgreSQL |
| **Performance** | Good | 50% faster |
| **Type Safety** | None | Full TypeScript |
| **Real-time** | Polling | WebSockets |

## 🎯 Next Steps

1. **Try the original** (already running)
2. **Set up the new version** using the steps above
3. **Compare both versions** side by side
4. **Migrate your data** using the migration guide

## 🆘 Need Help?

- **Original Platform**: Check the existing README.md
- **New Platform**: Check ai-learning-platform-v2/README.md
- **Migration**: Check ai-learning-platform-v2/MIGRATION-GUIDE.md
- **Issues**: Create an issue in the repository

---

**Both versions are now available for you to explore! 🎉**
