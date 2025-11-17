import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const linkClass = ({ isActive }) =>
    "flex-1 text-center py-3 " + (isActive ? "text-blue-700 font-bold" : "text-gray-700");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex md:hidden z-30">
      <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
      <NavLink to="/add-expense" className={linkClass}>Add Expense</NavLink>
      <NavLink to="/settings" className={linkClass}>Settings</NavLink>
      <NavLink to="/report" className={linkClass}>Report</NavLink>
    </nav>
  );
}
