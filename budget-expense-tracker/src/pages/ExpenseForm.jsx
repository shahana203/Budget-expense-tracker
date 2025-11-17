import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ExpenseForm() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    categoryId: "",
    date: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch categories for dropdown
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("/categories");
        setCategories(res.data);
      } catch (err) {
        setMessage("Could not load categories.");
      }
    }
    fetchCategories();
    // date defaults to today
    setForm(prev => ({ ...prev, date: new Date().toISOString().substr(0, 10) }));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post("/expenses", {
        ...form,
        amount: Number(form.amount),
      });
      setMessage("Expense added successfully!");
      setTimeout(() => navigate("/dashboard"), 1000); // Redirect after success
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding expense.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white rounded p-6 shadow">
        <h2 className="text-xl font-bold mb-5 text-center">Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="description"
            placeholder="Expense Description"
            value={form.description}
            onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border rounded"
            required
            min="0"
          />
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-2 border rounded"
            required
          />
          <button className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800">
            Add Expense
          </button>
        </form>
        {message && <div className="mt-4 text-center text-sm text-green-600">{message}</div>}
      </div>
    </div>
  );
}
