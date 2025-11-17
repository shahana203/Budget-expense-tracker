import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(`/categories?month=${month}`);
        setCategories(res.data);
      } catch (error) {
        // Handle error (show toast/message if needed)
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchCategories();
  }, [month]);

  const formattedMonth = new Date(month + "-01").toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  if (loading) return <div className="text-center mt-24">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-2">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-center sm:text-left">
            Dashboard
          </h1>
          <div className="text-gray-700 text-lg font-medium mb-1 text-center sm:text-left">
            {formattedMonth}
          </div>
        </div>
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border px-3 py-2 rounded text-lg"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(({ _id, name, limit, spent }) => {
          const remaining = limit - spent;
          const isOverBudget = spent > limit && limit !== 0;
          const progress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          return (
            <div key={_id} className="bg-white rounded shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-xl">{name}</h2>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    isOverBudget ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {isOverBudget ? "Over Budget" : "Within Budget"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-5 mb-4">
                <div
                  className={`h-5 rounded-full transition-all duration-500 ${
                    isOverBudget ? "bg-red-500" : "bg-blue-600"
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Spent: ₹{spent?.toFixed(2) ?? "0.00"}</span>
                <span>Limit: ₹{limit?.toFixed(2) ?? "0.00"}</span>
                <span>Remaining: ₹{remaining?.toFixed(2) ?? "0.00"}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate("/add-expense")}
          className="rounded-full bg-blue-700 text-white px-8 py-3 text-lg hover:bg-blue-800 transition-colors duration-300"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}
