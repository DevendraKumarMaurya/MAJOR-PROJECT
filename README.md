# ELEVATE LADS INTERNSHIP - MAJOR PROJECTS

This repository contains two major projects developed during the Elevate Lads Internship program:

## 📊 Budget Planner with Data Visualization

A comprehensive budget management application built with Vue.js that helps users track expenses and visualize financial data.

**Tech Stack:**

- Vue.js 3
- Vite
- Firebase
- Chart.js (Data Visualization)

**Features:**

- Expense tracking and categorization
- Interactive data visualizations
- Real-time budget monitoring
- Firebase integration for data persistence

**Quick Start:**

```bash
cd BUDGET-PLANNER-WITH-DATA-VISUALIZATION
pnpm install
pnpm dev
```

## 💬 Realtime Chat Application

A modern, full-stack real-time chat application with both client and server components.

**Tech Stack:**

- **Frontend:** React 18, TypeScript, Tailwind CSS, Socket.IO Client
- **Backend:** Node.js, Express, MongoDB, Socket.IO

**Features:**

- Real-time messaging with Socket.IO
- User authentication (JWT)
- File sharing and uploads
- Channel/group chat support
- Profile management with avatars
- Responsive design

**Quick Start:**

Backend:

```bash
cd REALTIME-CHAT-APP/server
pnpm install
pnpm dev
```

Frontend:

```bash
cd REALTIME-CHAT-APP/client
pnpm install
pnpm dev
```

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ELEVATE-LADS-INTERNSHIP/MAJOR-PROJECT
   ```

2. **Choose your project and follow the Quick Start guide above**

3. **Environment Setup**
   - Each project has its own `.env` file requirements
   - Check individual project directories for specific configuration

## 📁 Project Structure

```folder-tree
MAJOR-PROJECT/
├── BUDGET-PLANNER-WITH-DATA-VISUALIZATION/    # Vue.js budget app
│   ├── src/
│   ├── public/
│   └── package.json
├── REALTIME-CHAT-APP/                         # Full-stack chat app
│   ├── client/                                # React frontend
│   └── server/                                # Node.js backend
└── README.md                                  # This file
```

## 📖 Documentation

Detailed documentation for each project is available in their respective directories:

- [Budget Planner README](BUDGET-PLANNER-WITH-DATA-VISUALIZATION/README.md)
- [Chat App Client README](REALTIME-CHAT-APP/client/README.md)
- [Chat App Server README](REALTIME-CHAT-APP/server/README.md)

## 🛠️ Development

Both projects use `pnpm` as the package manager. Make sure you have it installed:

```bash
npm install -g pnpm
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (for chat app)
- Modern web browser

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This repository is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

**Note:** Make sure to set up the required environment variables and dependencies for each project before running them. Check the individual README files for detailed setup instructions.
