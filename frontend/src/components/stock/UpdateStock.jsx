import React, { useEffect, useState } from "react";
import { getAllStocks, updateStock } from "../../services/api";

const UpdateStock = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({}); // { productName: quantity }

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await getAllStocks();
        setProducts(res.data.map((s) => s.product));
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load products");
      }
    };

    fetchStocks();
  }, []);

  // Toggle product selection
  const handleRowClick = (productName) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      if (updated[productName]) {
        delete updated[productName]; // deselect if already selected
      } else {
        updated[productName] = ""; // add with empty quantity
      }
      return updated;
    });
  };

  // Update quantity for a selected product
  const handleQuantityChange = (productName, value) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productName]: value,
    }));
  };

  // Generic function for BOTH buttons
  const handleUpdateAll = async (mode) => {
    const updates = Object.entries(selectedProducts)
      .filter(([_, qty]) => qty !== "")
      .map(([productName, qty]) => ({
        productName,
        quantity: Number(qty),
        mode, // "add" or "replace"
      }));

    if (updates.length === 0) {
      alert("Please select at least one product and enter quantities");
      return;
    }

    try {
      await updateStock({ updates });
      alert("✅ Stock updated successfully!");
      setSelectedProducts({});
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update stock");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">✏️ Update Stock</h2>

      <div className="grid gap-2 mb-4">
        {products.map((p, index) => (
          <div
            key={index}
            onClick={() => handleRowClick(p.name)}
            className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer transition 
              ${
                selectedProducts[p.name] !== undefined
                  ? "bg-blue-100 border-blue-400"
                  : "hover:bg-gray-100"
              }`}
          >
            <div className="flex items-center gap-3 w-1/2">
              <input
                type="checkbox"
                checked={selectedProducts[p.name] !== undefined}
                readOnly
              />
              <span className="font-medium">{p.name}</span>
            </div>

            {selectedProducts[p.name] !== undefined && (
              <div
                className="flex items-center gap-2 w-1/2 justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="number"
                  className="border p-2 rounded-md w-28"
                  placeholder="Qty"
                  value={selectedProducts[p.name]}
                  onChange={(e) => handleQuantityChange(p.name, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.keys(selectedProducts).length > 0 && (
        <div className="flex gap-4">
          {/* ADD STOCK BUTTON */}
          <button
            onClick={() => handleUpdateAll("add")}
            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
          >
            ➕ Add Stock
          </button>

          {/* REPLACE STOCK BUTTON */}
          <button
            onClick={() => handleUpdateAll("replace")}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
          >
            ♻️ Replace Stock
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateStock;
