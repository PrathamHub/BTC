import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllBills, deleteBill as deleteBillAPI } from "../services/api";

const AllBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBills = async () => {
    try {
      const data = await getAllBills();
      setBills(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("❌ Failed to fetch bills from server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDeleteBill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;

    try {
      const res = await deleteBillAPI(id);
      console.log(res);
      toast.success("✅ Bill deleted successfully!");
      setBills(bills.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting bill:", error);
      toast.error("❌ Failed to delete bill!");
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading bills...</div>;
  if (bills.length === 0)
    return <div className="text-center mt-10 text-lg">No bills found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">All Bills</h1>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Customer Name</th>
              <th className="border px-4 py-2">Total Amount</th>
              <th className="border px-4 py-2">Items</th>
              <th className="border px-4 py-2">Free Items</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, idx) => (
              <tr key={bill._id || idx} className="text-center">
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2">{bill.customerName}</td>
                <td className="border px-4 py-2">{bill.totalAmount}</td>
                <td className="border px-4 py-2">
                  {bill.items.map((item, i) => (
                    <div key={i}>
                      {item.name} - {item.bags || 0} Bags, {item.pieces || 0}{" "}
                      Pieces
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2">
                  {bill.freeItems && bill.freeItems.length > 0 ? (
                    bill.freeItems.map((item, i) => (
                      <div key={i}>
                        {item.name} - {item.bags || 0} Bags, {item.pieces || 0}{" "}
                        Pieces
                      </div>
                    ))
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  {new Date(bill.date).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteBill(bill._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBills;
