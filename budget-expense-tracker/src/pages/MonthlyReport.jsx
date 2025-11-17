import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function MonthlyReport() {
  const [categories, setCategories] = useState([]);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`/categories?month=${month}`);
      setCategories(res.data);
    }
    fetchData();
  }, [month]);

  const totalLimit = categories.reduce((sum, cat) => sum + (cat.limit || 0), 0);
  const totalSpent = categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Monthly Report</h1>
      <div className="mb-4 flex justify-center">
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>
      <table className="w-full border border-gray-300 text-left mb-6">
        <thead>
          <tr>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Spent</th>
            <th className="border px-2 py-1">Limit</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => {
            const isOver = cat.spent > cat.limit && cat.limit !== 0;
            return (
              <tr key={cat._id}>
                <td className="border px-2 py-1">{cat.name}</td>
                <td className="border px-2 py-1">₹{cat.spent?.toFixed(2) ?? "0.00"}</td>
                <td className="border px-2 py-1">₹{cat.limit?.toFixed(2) ?? "0.00"}</td>
                <td className={`border px-2 py-1 ${isOver ? "text-red-600" : "text-green-600"}`}>
                  {isOver ? "Over" : "Within"}
                </td>
              </tr>
            );
          })}
          <tr className="font-semibold">
            <td className="border px-2 py-2">TOTAL</td>
            <td className="border px-2 py-2">₹{totalSpent.toFixed(2)}</td>
            <td className="border px-2 py-2">₹{totalLimit.toFixed(2)}</td>
            <td className="border px-2 py-2">
              {(totalSpent > totalLimit && totalLimit > 0) ? (
                <span className="text-red-600">Over</span>
              ) : (
                <span className="text-green-600">Within</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
