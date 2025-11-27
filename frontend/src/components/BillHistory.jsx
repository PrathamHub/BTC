import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBillById } from "../services/api";

export default function BillDetails() {
  const { id } = useParams(); // 👈 Get bill ID from URL
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const data = await getBillById(id); // 👈 CALLING YOUR FUNCTION
        setBill(data);
      } catch (err) {
        console.error("Error loading bill:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading bill...</div>;

  if (!bill) return <div className="p-6 text-center">Bill not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bill Details</h1>

      <div className="border rounded-lg p-4 mb-4">
        <p>
          <strong>Customer:</strong> {bill.customerName}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹{bill.totalAmount}
        </p>
        <p>
          <strong>Date:</strong> {new Date(bill.date).toLocaleString()}
        </p>
      </div>

      {/* Items */}
      <h2 className="text-xl font-semibold mb-2">Items</h2>
      <div className="border rounded-lg p-4 mb-4">
        {bill.items?.map((item, i) => (
          <div key={i} className="mb-1">
            {item.name} — {item.bags} Bags, {item.pieces} Pieces
          </div>
        ))}
      </div>

      {/* Free Items */}
      <h2 className="text-xl font-semibold mb-2">Free Items</h2>
      <div className="border rounded-lg p-4 mb-4">
        {bill.freeItems?.length > 0 ? (
          bill.freeItems.map((item, i) => (
            <div key={i} className="mb-1">
              {item.name} — {item.bags} Bags, {item.pieces} Pieces
            </div>
          ))
        ) : (
          <p className="text-gray-500">No free items</p>
        )}
      </div>

      {/* Notes */}
      <h2 className="text-xl font-semibold mb-2">Notes</h2>
      <div className="border rounded-lg p-4">
        {bill.note ? (
          bill.note
        ) : (
          <span className="text-gray-500">No notes</span>
        )}
      </div>
    </div>
  );
}
