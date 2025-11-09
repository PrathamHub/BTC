// ✅ src/components/billing/FreeItems.jsx
import React from "react";
import { products } from "../data/Product"; // ✅ Correct import — using your local products list

const FreeItems = ({
  freeItems,
  addFreeItem,
  updateFreeItem,
  removeFreeItem,
}) => {
  return (
    <div className="mt-8 border-t pt-4">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">🎁 Free Items</h2>
        <button
          onClick={addFreeItem}
          className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
        >
          + Add Free Item
        </button>
      </div>

      {/* 🔹 Table Section */}
      {freeItems.length === 0 ? (
        <p className="text-gray-500">No free items added.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Bags</th>
              <th className="border p-2">Pieces</th>
              <th className="border p-2 w-16">Action</th>
            </tr>
          </thead>

          <tbody>
            {freeItems.map((item, index) => (
              <tr key={index} className="text-center">
                {/* 🔹 Product Dropdown — now using products from data file */}
                <td className="border p-2">
                  <select
                    value={item.name}
                    onChange={(e) =>
                      updateFreeItem(index, "name", e.target.value)
                    }
                    className="w-full border rounded-md text-center"
                  >
                    <option value="">Select Product</option>
                    {products.map((p, i) => (
                      <option key={i} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* 🔹 Bags Input */}
                <td className="border p-2">
                  <input
                    type="number"
                    min="0"
                    value={item.bags || ""}
                    onChange={(e) =>
                      updateFreeItem(index, "bags", e.target.value)
                    }
                    className="w-20 border rounded-md text-center"
                    placeholder="0"
                  />
                </td>

                {/* 🔹 Pieces Input */}
                <td className="border p-2">
                  <input
                    type="number"
                    min="0"
                    value={item.pieces || ""}
                    onChange={(e) =>
                      updateFreeItem(index, "pieces", e.target.value)
                    }
                    className="w-20 border rounded-md text-center"
                    placeholder="0"
                  />
                </td>

                {/* 🔹 Delete Button */}
                <td className="border p-2">
                  <button
                    onClick={() => removeFreeItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FreeItems;
