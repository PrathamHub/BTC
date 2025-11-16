const CustomerHistoryList = ({ bills }) => {
  if (!bills || bills.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-5">
        No bills found for this customer.
      </p>
    );
  }

  return (
    <div className="mt-6">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white text-center">
              <th className="border p-2">#</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Items</th>
            </tr>
          </thead>

          <tbody>
            {bills.map((bill, idx) => (
              <tr key={bill._id} className="text-center hover:bg-gray-100">
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">
                  {new Date(bill.date).toLocaleString()}
                </td>
                <td className="border p-2 text-green-600 font-semibold">
                  ₹{bill.totalAmount}
                </td>
                <td className="border p-2 text-left">
                  {bill.items.map((item, i) => (
                    <div key={i}>
                      {item.name} - {item.bags || 0} Bags, {item.pieces || 0}{" "}
                      Pcs
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {bills.map((bill, idx) => (
          <div key={bill._id} className="border p-4 rounded-xl shadow bg-white">
            <div className="flex justify-between">
              <p className="font-bold">#{idx + 1}</p>
              <p className="text-sm text-gray-500">
                {new Date(bill.date).toLocaleDateString()}
              </p>
            </div>

            <p className="mt-2 text-green-600 font-bold">₹{bill.totalAmount}</p>

            <div className="mt-2">
              <strong>Items:</strong>
              <ul className="list-disc pl-5">
                {bill.items.map((item, i) => (
                  <li key={i}>
                    {item.name} — {item.bags || 0} Bags, {item.pieces || 0} Pcs
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerHistoryList;
