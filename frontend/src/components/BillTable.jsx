import React, { useEffect, useRef } from "react";

const BillTable = ({ billItems, updateItem, removeItem, focusProductId }) => {
  const inputRefs = useRef({});

  useEffect(() => {
    if (focusProductId && inputRefs.current[focusProductId]) {
      inputRefs.current[focusProductId].focus();
    }
  }, [focusProductId]);

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
    <div className="mt-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border p-3 text-left">Product</th>
              <th className="border p-3 text-center">Price (₹)</th>
              <th className="border p-3 text-center">Quantity</th>
              <th className="border p-3 text-center">Total (₹)</th>
              <th className="border p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {billItems.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-6 italic"
                >
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
                  <tr
                    key={item.id}
                    className="text-center hover:bg-gray-50 transition"
                  >
                    <td className="border px-3 py-2 font-medium text-left">
                      {item.name}
                    </td>

                    <td className="border px-3 py-2">
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
                        className="w-20 md:w-24 border rounded-md text-center p-1 focus:ring focus:ring-blue-200"
                      />
                    </td>

                    <td className="border px-3 py-2 flex flex-col md:flex-row justify-center items-center gap-2">
                      <input
                        ref={(el) => (inputRefs.current[item.id] = el)}
                        type="number"
                        min="0"
                        placeholder="Bags"
                        value={item.bags === 0 ? "" : item.bags}
                        onChange={(e) =>
                          handleChange(item.id, "bags", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur(item.id, "bags", e.target.value)
                        }
                        className="border rounded-md p-1 w-20 text-center focus:ring focus:ring-blue-200"
                      />

                      <span className="text-gray-500 hidden md:inline">or</span>

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
                        className="border rounded-md p-1 w-20 text-center focus:ring focus:ring-blue-200"
                      />
                    </td>

                    <td className="border px-3 py-2 font-semibold">
                      ₹{total.toFixed(2)}
                    </td>

                    <td className="border px-3 py-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
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
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-4">
        {billItems.map((item) => {
          const quantity =
            item.bags && item.bags > 0
              ? item.bags
              : item.pieces && item.pieces > 0
              ? item.pieces
              : 0;

          const total = item.sellingPrice * quantity;

          return (
            <div
              key={item.id}
              className="border rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={item.sellingPrice === 0 ? "" : item.sellingPrice}
                    onChange={(e) =>
                      handleChange(item.id, "sellingPrice", e.target.value)
                    }
                    onBlur={(e) =>
                      handleBlur(item.id, "sellingPrice", e.target.value)
                    }
                    className="w-full border rounded-md p-2 text-center focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Bags</label>
                  <input
                    ref={(el) => (inputRefs.current[item.id] = el)}
                    type="number"
                    min="0"
                    value={item.bags === 0 ? "" : item.bags}
                    onChange={(e) =>
                      handleChange(item.id, "bags", e.target.value)
                    }
                    onBlur={(e) => handleBlur(item.id, "bags", e.target.value)}
                    className="w-full border rounded-md p-2 text-center focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Pieces</label>
                  <input
                    type="number"
                    min="0"
                    value={item.pieces === 0 ? "" : item.pieces}
                    onChange={(e) =>
                      handleChange(item.id, "pieces", e.target.value)
                    }
                    onBlur={(e) =>
                      handleBlur(item.id, "pieces", e.target.value)
                    }
                    className="w-full border rounded-md p-2 text-center focus:ring focus:ring-blue-200"
                  />
                </div>

                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BillTable;
