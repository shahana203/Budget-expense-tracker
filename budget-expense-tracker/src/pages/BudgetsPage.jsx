import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function BudgetsPage() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [budgetRows, setBudgetRows] = useState([]);
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7); // YYYY-MM
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchAll() {
      try {
        const [catRes, budgetRes] = await Promise.all([
          axios.get("/categories"),
          axios.get("/budgets", { params: { month } }),
        ]);
        setCategories(catRes.data);
        // Map budgets by categoryId for fast lookup and store _id too
        const map = {};
        budgetRes.data.forEach((b) => {
          map[b.categoryId] = { limit: b.limit, _id: b._id };
        });
        setBudgets(map);
        setBudgetRows(budgetRes.data);
      } catch (error) {
        setMessage("Failed to load budgets or categories.");
      }
    }
    fetchAll();
  }, [month]);

  // Remove leading zeros here!
  function handleInputChange(catId, value) {
    const cleanedValue = value.replace(/^0+(?=\d)/, "");
    setBudgets((prev) => ({
      ...prev,
      [catId]: { ...prev[catId], limit: isNaN(cleanedValue) || cleanedValue === "" ? 0 : Number(cleanedValue) }
    }));
  }

  async function handleSave() {
    try {
      const budgetArray = categories.map((cat) => ({
        categoryId: cat._id,
        limit: budgets[cat._id]?.limit || 0,
        month,
      }));
      await axios.post("/budgets", budgetArray);
      setMessage("Budgets saved successfully!");
    } catch (error) {
      setMessage("Error saving budgets.");
    }
  }

  async function handleDelete(catId) {
    // Find budget row for this catId & month
    const row = budgetRows.find(b => b.categoryId === catId);
    if (row?._id) {
      try {
        await axios.delete(`/budgets/${row._id}`);
        setBudgets(prev => ({ ...prev, [catId]: { limit: 0 } }));
        setMessage("Budget deleted!");
      } catch (error) {
        setMessage("Error deleting budget.");
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Settings - Budgets</h1>
      <div className="mb-4 flex justify-center">
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>
      {message && (
        <div className="mb-6 text-center text-sm text-green-600">{message}</div>
      )}
      <table className="w-full border border-gray-300 text-left">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Monthly Limit (₹)</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td className="border border-gray-300 px-4 py-2">{cat.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  min="0"
                  value={budgets[cat._id]?.limit ?? 0}
                  onChange={e => handleInputChange(cat._id, e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-600 hover:underline"
                  disabled={!(budgets[cat._id]?.limit > 0)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded"
        >
          Save Budgets
        </button>
      </div>
    </div>
  );
}
