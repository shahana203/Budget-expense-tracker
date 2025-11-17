import { NavLink, Outlet } from "react-router-dom";

export default function Settings() {
  // Menu style
  const menuItem = ({ isActive }) =>
    "block px-4 py-2 rounded mb-2 " +
    (isActive ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-800");

  return (
    <div className="flex flex-col md:flex-row max-w-4xl mx-auto px-2 py-6 md:py-12">
      <aside className="md:w-64 md:mr-8 mb-6 md:mb-0">
        <nav>
          <NavLink to="/budgets" className={menuItem}>
            Budgets
          </NavLink>
          <NavLink to="/category" className={menuItem}>
            Categories
          </NavLink>
          <NavLink to="/expenses" className={menuItem}>
            Expense History
          </NavLink>
        </nav>
      </aside>
      <section className="flex-1 min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
