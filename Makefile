.PHONY: start help install

help:
	@echo "Available targets:"
	@echo "  help             - Show this help message"
	@echo "  start            - Start both backend and frontend in separate terminals"
	@echo "  install          - Install all dependencies (backend and frontend)"

fix-permissions:
	@echo "Fixing virtual environment permissions..."
	@if [ -d "backend/venv" ]; then \
		sudo chown -R $(USER):$(USER) backend/venv; \
		echo "✅ Virtual environment permissions fixed"; \
	else \
		echo "ℹ️  Virtual environment doesn't exist yet"; \
	fi

install: install-backend install-frontend

install-backend:
	@echo "Installing backend dependencies..."
	@if [ -d "backend/venv" ] && [ "$$(stat -c %U backend/venv)" != "$(USER)" ]; then \
		echo "🔧 Fixing virtual environment permissions first..."; \
		make fix-permissions; \
	fi
	cd backend && \
	rm -rf venv && \
	python3 -m venv venv && \
	source venv/bin/activate && \
	pip install --upgrade pip && \
	pip install -r requirements.txt
	@echo "✅ Backend dependencies installed successfully"

install-frontend:
	@echo "Installing frontend dependencies..."
	@command -v npm >/dev/null 2>&1 || { echo "❌ npm not found. Install Node.js and npm first."; exit 1; }
	cd frontend && npm install
	@echo "✅ Frontend dependencies installed successfully"

start:
	@echo "Starting backend and frontend servers..."
	@echo "Checking if dependencies are installed..."
	@if [ ! -d "backend/venv" ]; then \
		echo "❌ Backend virtual environment not found. Run 'make install-backend' first."; \
		exit 1; \
	fi
	@if [ ! -d "frontend/node_modules" ]; then \
		echo "❌ Frontend dependencies not found. Run 'make install-frontend' first."; \
		exit 1; \
	fi
	@echo "✅ Dependencies check passed. Starting servers..."
	@echo "Backend will start first, then frontend..."
	gnome-terminal --tab --title="Backend" -- bash -c "cd $(PWD)/backend && source venv/bin/activate && echo 'Starting backend server...' && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000; exec bash" & \
	sleep 3 && \
	gnome-terminal --tab --title="Frontend" -- bash -c "cd $(PWD)/frontend && echo 'Starting frontend server...' && npm run dev; exec bash"