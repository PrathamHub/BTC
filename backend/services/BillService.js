import Bill from "../models/Bill.js";

export const createBillEntry = async (
  customerName,
  items = [], // ✅ ensure always array
  freeItems = [], // ✅ ensure always array (optional)
  grandTotal,
  session,
  note
) => {
  // Filter only actually purchased items
  const filteredItems = (items || []).filter(
    (item) => item.bags > 0 || item.pieces > 0
  );

  // Filter free items (optional)
  const filteredFreeItems = (freeItems || []).filter(
    (item) => item.bags > 0 || item.pieces > 0
  );

  const newBill = new Bill({
    customerName,
    items: filteredItems,
    freeItems: filteredFreeItems, // will just be []
    totalAmount: grandTotal,
    date: new Date(),
    note: note || "", // optional note field
  });

  await newBill.save({ session });
  return newBill;
};
