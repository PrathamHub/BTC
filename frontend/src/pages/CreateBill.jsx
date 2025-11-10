import React, { useState } from "react";
import ProductSelector from "../components/ProductSelector";
import BillTable from "../components/BillTable";
import FreeItems from "../components/FreeItem";
import BillSummary from "../components/BillSummery";
import { createBill } from "../services/api";
import { products } from "../data/Product";
import { toast } from "react-toastify";
import axios from "axios";

const CreateBill = () => {
  const [note, setNote] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [freeItems, setFreeItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [focusedProductId, setFocusedProductId] = useState(null);
  const addProduct = (product) => {
    if (billItems.find((item) => item.id === product.id)) return;
    const newItems = [
      ...billItems,
      {
        ...product,
        quantity: 1,
        bags: 0,
        pieces: 0,
        total: product.sellingPrice,
      },
    ];
    setBillItems(newItems);
    setFocusedProductId(product.id); // 👈 Focus this product’s quantity field
  };

  const updateItem = (id, field, value) => {
    const updated = billItems.map((item) => {
      if (item.id === id) {
        const newValue = Number(value);
        const bags = field === "bags" ? newValue : item.bags || 0;
        const pieces = field === "pieces" ? newValue : item.pieces || 0;
        const price = field === "sellingPrice" ? newValue : item.sellingPrice;
        const quantity = bags > 0 ? bags : pieces;
        const total = price * quantity;

        return { ...item, [field]: newValue, total };
      }
      return item;
    });

    setBillItems(updated);
    calculateTotal(updated);
  };

  const removeItem = (id) => {
    const updated = billItems.filter((i) => i.id !== id);
    setBillItems(updated);
    calculateTotal(updated);
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, i) => sum + i.total, 0);
    setGrandTotal(total);
  };

  const addFreeItem = () =>
    setFreeItems([...freeItems, { name: "", quantity: 1, bags: 0, pieces: 0 }]);

  const updateFreeItem = (index, field, value) => {
    const updated = [...freeItems];
    updated[index][field] = value;
    setFreeItems(updated);
  };

  const removeFreeItem = (index) =>
    setFreeItems(freeItems.filter((_, i) => i !== index));

  const totalDispatch = products.map((p) => {
    const bill = billItems.find((i) => i.name === p.name) || {};
    const free = freeItems.find((i) => i.name === p.name) || {};

    return {
      name: p.name,
      totalBags: Number(bill.bags || 0) + Number(free.bags || 0),
      totalPieces: Number(bill.pieces || 0) + Number(free.pieces || 0),
    };
  });

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

    if (!customerName || customerName.trim() === "") {
      toast.warning(
        "⚠️ Please enter a customer name before generating the bill."
      );
      return;
    }

    try {
      await createBill(data);
      toast.success("✅ Bill Created Successfully!");
      setBillItems([]);
      setCustomerName("");
      setFreeItems([]);
      setGrandTotal(0);
      setNote("");
    } catch (error) {
      console.error("❌ Failed to create bill:", error);
      toast.error(
        error.response?.data?.message ||
          "❌ Something went wrong while creating the bill!"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        {/* 🧾 Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          🧾 FENA BILLING SYSTEM
        </h1>

        {/* 🧍 Customer Section */}
        <div className="mb-6 relative">
          <label className="block text-base sm:text-lg font-medium mb-2 text-gray-700">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={async (e) => {
              setCustomerName(e.target.value);
              if (e.target.value.trim() === "")
                return setCustomerSuggestions([]);

              try {
                const res = await axios.get(
                  `https://btc-efgq.onrender.com/api/customers/search?q=${e.target.value}`
                );
                setCustomerSuggestions(res.data);
              } catch (err) {
                console.error("Error fetching customer suggestions", err);
              }
            }}
            placeholder="Enter customer name"
            className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {customerSuggestions.length > 0 && (
            <ul className="absolute z-50 bg-white border w-full max-h-48 overflow-y-auto mt-1 rounded-md shadow-md">
              {customerSuggestions.map((c, idx) => (
                <li
                  key={idx}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm sm:text-base"
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

        {/* 📦 Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side: Products & Bill Table */}
          <div className="space-y-6">
            <ProductSelector addProduct={addProduct} />
            <BillTable
              billItems={billItems}
              updateItem={updateItem}
              removeItem={removeItem}
              focusProductId={focusedProductId}
            />
          </div>

          {/* Right side: Free Items & Summary */}
          <div className="space-y-6">
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
              dispatchDetails={totalDispatch}
              onGenerate={handleGenerateBill}
            />
          </div>
        </div>

        {/* 📝 Note Section */}
        <div className="mt-8">
          <label className="block text-base sm:text-lg font-medium mb-2 text-gray-700">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write any important message for this bill..."
            className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 h-24 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
