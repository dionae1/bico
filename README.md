# <center>BiCO - Freelancer Management System</center>

### <center>[Available at bicoapp.me](https://bicoapp.me)</center>

##
Welcome to the **BiCO** repository. This is a Full Stack project designed to help freelancers manage their business by centralizing control over clients, services, contracts.

The focus of this project lies in acquiring experience in modern web development, focused on backend, software architecture, and containerization.

## 🚀 Technologies Used

The project was built separating client and server responsibilities to ensure scalability and maintainability.

### Backend (RESTful API)
*   **Language:** Python 3.12
*   **Framework:** FastAPI
*   **ORM:** SQLAlchemy
*   **Migrations:** Alembic
*   **Database:** PostgreSQL
*   **Testing:** Pytest

### Frontend (SPA)
*   **Language:** TypeScript
*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Charts:** Recharts
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios

### Infrastructure & DevOps
*   **Containerization:** Docker & Docker Compose
*   **Web Server:** Caddy
*   **Automation:** Makefile

---

## ✨ Key Features

*   **Demo Mode:** Generates a temporary account with dummy data for immediate testing without registration.
*   **Analytics Dashboard:** Overview of revenue, profit, top-selling services, and expiring contracts.
*   **Contract Management:** Complete contract lifecycle with expiration alerts.
*   **Secure Authentication:** Login/Signup system with JWT tokens.

---

## 📂 Project Structure

The repository is organized as a monorepo:

```bash
.
├── backend/            # Python/FastAPI API
│   ├── app/            # Business logic, routes, and models
│   ├── alembic/        # Database migrations
│   └── tests/          # Automated tests
├── frontend/           # React/TypeScript Application
│   ├── src/
│   │   ├── components/ # Reusable components (Cards, Charts, Forms)
│   │   ├── pages/      # Application pages
│   │   └── types/      # TypeScript type definitions
├── caddy_config/       # Caddy server configuration
├── docker-compose.yml  # Container orchestration
└── Makefile            # Automation commands
```

---

## 🛠️ How to Run the Project

The project includes a `Makefile` to simplify the development environment setup.

### Prerequisites
*   Docker & Docker Compose (Production/demo)
*   Node.js & Python 3.12 (Local development)

### Installation

```bash
git clone https://github.com/dionae1/bico.git bico-repo
cd bico-repo
```

### Run Via Docker

To start the entire environment:

```bash
cp example.env .env
docker-compose up --build
```

Access at: `http://localhost`

---
