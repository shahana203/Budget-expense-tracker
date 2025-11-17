import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [message, setMessage] = useState("");

  // Fetch categories on load
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data);
    } catch (err) {
      setMessage("Failed to load categories.");
    }
  }

  // Add category
  async function addCategory() {
    if (!newCategoryName.trim()) return;
    try {
      await axios.post("/categories", { name: newCategoryName });
      setNewCategoryName("");
      fetchCategories();
      setMessage("Category added!");
    } catch (err) {
      setMessage("Error adding category.");
    }
  }

  // Start editing category
  function startEdit(category) {
    setEditingCategory(category._id);
    setEditedName(category.name);
    setMessage("");
  }

  // Save edited category
  async function saveEdit(id) {
    if (!editedName.trim()) return;
    try {
      await axios.put(`/categories/${id}`, { name: editedName });
      setEditingCategory(null);
      fetchCategories();
      setMessage("Category updated!");
    } catch (err) {
      setMessage("Error updating category.");
    }
  }

  // Delete category
  async function deleteCategory(id) {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`/categories/${id}`);
      fetchCategories();
      setMessage("Category deleted!");
    } catch (err) {
      setMessage("Error deleting category.");
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Settings - Categories</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className="grow border px-3 py-2 rounded"
        />
        <button
          onClick={addCategory}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>
      {message && (
        <div className="mb-4 text-center text-sm text-red-600">{message}</div>
      )}
      <table className="w-full border-collapse border border-gray-200 text-left">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td className="border border-gray-300 p-2">
                {editingCategory === cat._id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td className="border border-gray-300 p-2 flex gap-2">
                {editingCategory === cat._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(cat._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="text-gray-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
