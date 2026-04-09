import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { updateBill } from "../services/api";

export default function EditBill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const bill = location.state?.bill;

  // Prevent crash if bill not found
  useEffect(() => {
    if (!bill) {
      alert("No bill data received!");
      navigate("/fena/bills");
    }
  }, [bill, navigate]);

  const [customerName, setCustomerName] = useState(bill?.customerName || "");
  const [note, setNote] = useState(bill?.note || "");
  const [items, setItems] = useState(bill?.items || []);

  // Update items
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Save updates
  const handleSave = async () => {
    const updatedBill = {
      ...bill,
      customerName,
      note,
      items,
    };

    try {
      await updateBill(id, updatedBill);
      alert("Bill Updated Successfully!");
      navigate("/fena/bills");
    } catch (err) {
      console.error("Update Failed:", err);
      alert("Error updating bill. Check console.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Bill</h1>

      {/* Editable Fields */}
      <label className="font-semibold">Customer Name:</label>
      <input
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      <label className="font-semibold">Note:</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      <h2 className="text-xl font-bold mt-6 mb-4">Items</h2>

      {items.length === 0 && <p>No items found</p>}

      {items.map((item, index) => (
        <div
          key={index}
          className="border rounded p-4 mb-4 shadow-sm bg-gray-50"
        >
          <h3 className="font-semibold mb-2">{item.name}</h3>

          <label className="text-sm font-semibold">Quantity:</label>
          <input
            type="number"
            value={item.bags}
            onChange={(e) =>
              handleItemChange(index, "quantity", Number(e.target.value))
            }
            className="border p-2 w-full mb-3 rounded"
          />

          <label className="text-sm font-semibold">Price:</label>
          <input
            type="number"
            value={item.sellingPrice}
            onChange={(e) =>
              handleItemChange(index, "price", Number(e.target.value))
            }
            className="border p-2 w-full mb-3 rounded"
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg mt-4"
      >
        Save Changes
      </button>
    </div>
  );
}
