import { useState } from "react";
import CustomerSearch from "../components/CustomerSearch";
import CustomerHistoryList from "../components/CustomerHistoryList";
import { getBillsByCustomerName } from "../services/api";
import { toast } from "react-toastify";

const CustomerHistory = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (name) => {
    if (!name.trim()) return toast.error("Enter customer name");

    try {
      setLoading(true);
      const res = await getBillsByCustomerName(name);
      setBills(res.data);

      if (res.data.length === 0) toast.info("No history found");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch customer history");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBills([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Customer Buying History
        </h1>

        <CustomerSearch onSearch={handleSearch} onClear={handleClear} />

        {loading ? (
          <div className="text-center mt-5 font-semibold text-blue-600">
            Loading...
          </div>
        ) : (
          <CustomerHistoryList bills={bills} />
        )}
      </div>
    </div>
  );
};

export default CustomerHistory;
