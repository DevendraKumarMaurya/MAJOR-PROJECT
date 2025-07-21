# 💰 Budget Planner with Data Visualization

A modern, responsive web application for personal budget management with interactive data visualization features. Built with Vue.js 3 and Firebase, this application helps users track income, expenses, and financial goals with beautiful charts and analytics.

## 🌟 Features

### 📊 Dashboard & Visualization

- Interactive dashboard with real-time financial overview
- Beautiful charts and graphs using Chart.js
- Pie charts for expense category breakdown
- Bar charts for income vs expense trends
- Visual progress tracking for financial goals

### 💼 Financial Management

- **Income Tracking**: Add and manage multiple income sources
- **Expense Management**: Categorize and track all expenses
- **Goal Setting**: Set and monitor financial goals with progress indicators
- Real-time budget calculations and balance updates

### 🔐 User Authentication

- Secure user registration and login
- Firebase Authentication integration
- Protected routes and user-specific data

### 📱 Responsive Design

- Mobile-first responsive design
- Sidebar navigation with mobile overlay
- Optimized for all screen sizes
- Modern and intuitive user interface

## 🛠️ Technology Stack

- **Frontend Framework**: Vue.js 3 (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Charts**: Chart.js with Vue-ChartJS
- **Backend**: Firebase (Authentication & Database)
- **Build Tool**: Vite
- **Styling**: CSS3 with custom styles

## 📁 Project Structure

```text
budget-planner/
├── public/
│   └── money-bag-icon.png
├── src/
│   ├── components/
│   │   ├── charts/          # Chart components
│   │   │   ├── ChartBar.vue
│   │   │   └── ChartPie.vue
│   │   ├── forms/           # Form components
│   │   │   ├── ExpenseForm.vue
│   │   │   ├── GoalForm.vue
│   │   │   └── IncomeForm.vue
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.vue
│   │   │   └── Sidebar.vue
│   │   ├── lists/           # List components
│   │   │   ├── ExpenseList.vue
│   │   │   ├── GoalList.vue
│   │   │   └── IncomeList.vue
│   │   └── ui/              # UI components
│   │       └── Dashboard.vue
│   ├── firebase/            # Firebase configuration
│   │   └── config.js
│   ├── router/              # Vue Router configuration
│   │   └── index.js
│   ├── stores/              # Pinia stores
│   │   ├── auth.js
│   │   └── budget.js
│   ├── views/               # Page components
│   │   ├── ExpenseManagement.vue
│   │   ├── GoalManagement.vue
│   │   ├── Home.vue
│   │   ├── IncomeManagement.vue
│   │   └── auth/
│   │       ├── Login.vue
│   │       └── Register.vue
│   ├── assets/
│   │   └── main.css
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/budget-planner.git
   cd budget-planner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Firebase Setup**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore Database
   - Copy your Firebase configuration
   - Update `src/firebase/config.js` with your Firebase credentials

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎯 Usage

1. **Register/Login**: Create an account or login to access your personal budget dashboard
2. **Add Income**: Navigate to Income Management to add your income sources
3. **Track Expenses**: Use Expense Management to categorize and track your spending
4. **Set Goals**: Create financial goals and monitor your progress
5. **View Analytics**: Check the dashboard for visual insights into your financial health

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🎨 Features Overview

### Dashboard

- Real-time financial overview
- Interactive charts showing expense categories
- Income vs expense comparisons
- Goal progress indicators

### Income Management

- Add multiple income sources
- Edit and delete income entries
- Categorize income types

### Expense Management

- Track expenses by category
- Monthly expense summaries
- Expense trend analysis

### Goal Management

- Set financial goals
- Track progress with visual indicators
- Goal achievement notifications

## 📝 License

This repository is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Chart.js for beautiful data visualization
- Firebase for backend services
- Icons and assets from various open-source contributors

---

Made with ❤️ for better financial management
