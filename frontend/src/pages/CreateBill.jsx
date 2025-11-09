import React, { useState } from "react";
import ProductSelector from "../components/ProductSelector";
import BillTable from "../components/BillTable";
import FreeItems from "../components/FreeItem";
import BillSummary from "../components/BillSummery";
import { createBill } from "../services/api";
import { products } from "../data/Product"; // ✅ import product list
import { toast } from "react-toastify";
import axios from "axios";
const CreateBill = () => {
  const [note, setNote] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [freeItems, setFreeItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const addProduct = (product) => {
    if (billItems.find((item) => item.id === product.id)) return;
    setBillItems([
      ...billItems,
      {
        ...product,
        quantity: 1,
        bags: 0,
        pieces: 0,
        total: product.sellingPrice,
      },
    ]);
  };

  // 🟠 FIX: Update totals dynamically when user changes price, bags, or pieces
  const updateItem = (id, field, value) => {
    const updated = billItems.map((item) => {
      if (item.id === id) {
        const newValue = Number(value);

        // determine quantity based on bags/pieces
        const bags = field === "bags" ? newValue : item.bags || 0;
        const pieces = field === "pieces" ? newValue : item.pieces || 0;
        const price = field === "sellingPrice" ? newValue : item.sellingPrice;

        // 🧮 choose non-zero quantity: bags > 0 ? bags : pieces
        const quantity = bags > 0 ? bags : pieces;
        const total = price * quantity;

        return { ...item, [field]: newValue, total };
      }
      return item;
    });

    setBillItems(updated);
    calculateTotal(updated); // 🟢 recalculate total whenever item changes
  };

  // 🟢 Remove product from bill
  const removeItem = (id) => {
    const updated = billItems.filter((i) => i.id !== id);
    setBillItems(updated);
    calculateTotal(updated);
  };

  // 🟢 Recalculate total (sum of all item totals)
  const calculateTotal = (items) => {
    const total = items.reduce((sum, i) => sum + i.total, 0);
    setGrandTotal(total);
  };

  // 🟢 Free item management
  const addFreeItem = () =>
    setFreeItems([...freeItems, { name: "", quantity: 1, bags: 0, pieces: 0 }]);

  const updateFreeItem = (index, field, value) => {
    const updated = [...freeItems];
    updated[index][field] = value;
    setFreeItems(updated);
  };

  const removeFreeItem = (index) =>
    setFreeItems(freeItems.filter((_, i) => i !== index));

  // 🟢 Create per-product dispatch summary (bill + free items)
  const totalDispatch = products.map((p) => {
    const bill = billItems.find((i) => i.name === p.name) || {};
    const free = freeItems.find((i) => i.name === p.name) || {};

    return {
      name: p.name,
      totalBags: Number(bill.bags || 0) + Number(free.bags || 0),
      totalPieces: Number(bill.pieces || 0) + Number(free.pieces || 0),
    };
  });

  // 🟢 Overall dispatch totals
  const totalBags = totalDispatch.reduce((sum, i) => sum + i.totalBags, 0);
  const totalPieces = totalDispatch.reduce((sum, i) => sum + i.totalPieces, 0);

  const handleGenerateBill = async () => {
    const data = {
      customerName,
      items: billItems,
      freeItems,
      grandTotal,
      totalDispatch,
      note,
    };

    // Validate customer name
    if (!customerName || customerName.trim() === "") {
      toast.warning(
        "⚠️ Please enter a customer name before generating the bill."
      );
      return;
    }

    try {
      await createBill(data);
      console.log(data);
      toast.success("✅ Bill Created Successfully!");

      // reset fields
      setBillItems([]);
      setCustomerName("");
      setFreeItems([]);
      setGrandTotal(0);
      setNote("");
    } catch (error) {
      console.error("❌ Failed to create bill:", error);

      // Handle backend custom messages
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("❌ Something went wrong while creating the bill!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          🧾 FENA BILLING SYSTEM
        </h1>
        <div className="mb-6 relative">
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={async (e) => {
              setCustomerName(e.target.value);

              if (e.target.value.trim() === "") {
                setCustomerSuggestions([]);
                return;
              }

              try {
                // 🔹 Call backend API to get matching customer names
                const res = await axios.get(
                  `http://localhost:5000/api/customers/search?q=${e.target.value}`
                );
                setCustomerSuggestions(res.data); // expects array of { name: "John Doe" }
              } catch (err) {
                console.error("Error fetching customer suggestions", err);
              }
            }}
            placeholder="Enter customer name"
            className="w-full border rounded-md p-2"
          />
          {/* 🔹 Suggestions dropdown */}
          {customerSuggestions.length > 0 && (
            <ul className="absolute z-50 bg-white border w-full max-h-48 overflow-y-auto mt-1 rounded-md shadow-md">
              {customerSuggestions.map((c, idx) => (
                <li
                  key={idx}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setCustomerName(c.name);
                    setCustomerSuggestions([]);
                  }}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <ProductSelector addProduct={addProduct} />
        <BillTable
          billItems={billItems}
          updateItem={updateItem}
          removeItem={removeItem}
        />
        <FreeItems
          freeItems={freeItems}
          addFreeItem={addFreeItem}
          updateFreeItem={updateFreeItem}
          removeFreeItem={removeFreeItem}
          allProducts={products}
        />
        <BillSummary
          grandTotal={grandTotal}
          totalBags={totalBags}
          totalPieces={totalPieces}
          dispatchDetails={totalDispatch} // 🧠 pass detailed summary
          onGenerate={handleGenerateBill}
        />
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write any important message for this bill..."
            className="w-full border border-gray-300 rounded-lg p-3 h-24 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
