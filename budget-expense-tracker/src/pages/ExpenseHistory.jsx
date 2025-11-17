import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function ExpenseHistory() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [catId, setCatId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch categories for the filter dropdown
    axios.get("/categories").then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    // Fetch all expenses for the user, filter by month/category in frontend
    axios.get("/expenses").then(res => setExpenses(res.data));
  }, []);

  const filteredExpenses = expenses.filter(exp => {
    const expMonth = exp.date?.slice(0, 7);
    const matchesMonth = expMonth === month;
    const matchesCat = !catId || exp.categoryId === catId || exp.categoryId?._id === catId;
    return matchesMonth && matchesCat;
  });

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  }

  async function deleteExpense(id) {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axios.delete(`/expenses/${id}`);
      setExpenses(arr => arr.filter(e => e._id !== id));
      setMessage("Expense deleted.");
    } catch {
      setMessage("Delete failed.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Expense History</h1>
      <div className="mb-4 flex gap-4 justify-center">
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={catId}
          onChange={e => setCatId(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      {message && <div className="mb-4 text-center text-green-600 text-sm">{message}</div>}
      <table className="w-full border text-left mb-6">
        <thead>
          <tr>
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Category</th>
            <th className="border px-3 py-2">Description</th>
            <th className="border px-3 py-2">Amount (₹)</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-500">
                No expenses found.
              </td>
            </tr>
          )}
          {filteredExpenses.map(exp => {
            const cat = categories.find(c => c._id === exp.categoryId || (exp.categoryId?._id === c._id));
            return (
              <tr key={exp._id}>
                <td className="border px-3 py-2">{formatDate(exp.date)}</td>
                <td className="border px-3 py-2">{cat?.name || "Uncategorized"}</td>
                <td className="border px-3 py-2">{exp.description}</td>
                <td className="border px-3 py-2">{exp.amount.toFixed(2)}</td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => deleteExpense(exp._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                  {/* Optional: Add an Edit button for updating expenses */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
