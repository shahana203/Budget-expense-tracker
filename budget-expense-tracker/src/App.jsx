// App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ExpenseForm from './pages/ExpenseForm';
import Categories from './pages/Categories';
import BudgetsPage from './pages/BudgetsPage';
import ExpenseHistory from './pages/ExpenseHistory';
import MonthlyReport from './pages/MonthlyReport';
import BottomNav from './components/BottomNav';
import Settings from './components/settings';
import SidebarNav from './components/SideNav';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex">
        <SidebarNav />
        <main className="flex-1 pb-16 md:pb-0 px-2">
          <Routes>
            <Route path="/" element={<Navigate to="/auth" />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-expense" element={<ExpenseForm />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/category" element={<Categories />} />
            <Route path="/expenses" element={<ExpenseHistory />} />
            <Route path="/report" element={<MonthlyReport />} />
            <Route index element={<BudgetsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
