import React, { useEffect, useRef } from "react";

const BillTable = ({ billItems, updateItem, removeItem, focusProductId }) => {
  const inputRefs = useRef({});

  // Automatically focus the quantity input (bags) when a new product is added
  useEffect(() => {
    if (focusProductId && inputRefs.current[focusProductId]) {
      inputRefs.current[focusProductId].focus();
    }
  }, [focusProductId]);

  // Prevent negatives and handle empty inputs
  const handleChange = (id, field, value) => {
    if (value === "") {
      updateItem(id, field, "");
      return;
    }

    const numValue = Number(value);
    if (numValue < 0) return;
    updateItem(id, field, numValue);
  };

  const handleBlur = (id, field, value) => {
    if (value === "" || isNaN(value)) {
      updateItem(id, field, 0);
    }
  };

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-200">
        <tr>
          <th className="border p-2">Product</th>
          <th className="border p-2 w-24">Price (₹)</th>
          <th className="border p-2 w-32">Quantity</th>
          <th className="border p-2 w-24">Total (₹)</th>
          <th className="border p-2 w-16">Action</th>
        </tr>
      </thead>
      <tbody>
        {billItems.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center text-gray-500 py-4">
              No items added yet
            </td>
          </tr>
        ) : (
          billItems.map((item) => {
            const quantity =
              item.bags && item.bags > 0
                ? item.bags
                : item.pieces && item.pieces > 0
                ? item.pieces
                : 0;

            const total = item.sellingPrice * quantity;

            return (
              <tr key={item.id} className="text-center">
                <td className="border p-2">{item.name}</td>

                <td className="border p-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={item.sellingPrice === 0 ? "" : item.sellingPrice}
                    onChange={(e) =>
                      handleChange(item.id, "sellingPrice", e.target.value)
                    }
                    onBlur={(e) =>
                      handleBlur(item.id, "sellingPrice", e.target.value)
                    }
                    className="w-20 border rounded-md text-center"
                  />
                </td>

                <td className="border p-2 flex justify-center gap-2">
                  <input
                    ref={(el) => (inputRefs.current[item.id] = el)} // 👈 reference for focus
                    type="number"
                    min="0"
                    placeholder="Bags"
                    value={item.bags === 0 ? "" : item.bags}
                    onChange={(e) =>
                      handleChange(item.id, "bags", e.target.value)
                    }
                    onBlur={(e) => handleBlur(item.id, "bags", e.target.value)}
                    className="border p-1 w-16 text-center"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Pieces"
                    value={item.pieces === 0 ? "" : item.pieces}
                    onChange={(e) =>
                      handleChange(item.id, "pieces", e.target.value)
                    }
                    onBlur={(e) =>
                      handleBlur(item.id, "pieces", e.target.value)
                    }
                    className="border p-1 w-16 text-center"
                  />
                </td>

                <td className="border p-2">{total}</td>

                <td className="border p-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default BillTable;
