import { NavLink } from "react-router-dom";

export default function SidebarNav() {
  const linkClass = ({ isActive }) =>
    "block px-4 py-2 my-2 rounded " +
    (isActive ? "bg-blue-700 text-white" : "hover:bg-blue-50 text-gray-700");

  return (
    <nav className="hidden md:flex flex-col w-56 min-h-screen bg-gray-100 py-6">
      <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
      <NavLink to="/add-expense" className={linkClass}>Add Expense</NavLink>
      <NavLink to="/settings" className={linkClass}>Settings</NavLink>
      <NavLink to="/report" className={linkClass}>Report</NavLink>
    </nav>
  );
}
