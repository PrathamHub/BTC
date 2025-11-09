import Customer from "../models/Customer.js";

/* ---------------------------------------------------------
 ✅ CREATE or ADD BILL for EXISTING CUSTOMER
   - If customer exists → add new bill entry (same name)
   - If customer does NOT exist → create new entry
--------------------------------------------------------- */
export const createCustomer = async (req, res) => {
  try {
    const { name, amount, date } = req.body;

    if (!name || !amount) {
      return res.status(400).json({ message: "Name and amount are required" });
    }

    // Normalize name for matching
    const formattedName = name.trim().toLowerCase();

    // Check if customer already exists (case-insensitive)
    const existingCustomer = await Customer.findOne({
      name: { $regex: new RegExp("^" + formattedName + "$", "i") },
    });

    let finalName = name;

    if (existingCustomer) {
      // Use the exact existing name (to prevent duplicates like 'John' and 'john')
      finalName = existingCustomer.name;
    }

    // Create new bill entry
    const customer = new Customer({
      name: finalName,
      amount,
      date: date ? new Date(date) : Date.now(),
    });

    const savedCustomer = await customer.save();

    res.status(201).json({
      message: existingCustomer
        ? "Bill added to existing customer"
        : "New customer created",
      customer: savedCustomer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------------------------------------
 ✅ GET ALL CUSTOMERS (Optional: Filter by date range)
--------------------------------------------------------- */
export const getAllCustomers = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = {};
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const customers = await Customer.find(filter).sort({ date: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------------------------------------
 ✅ SEARCH FOR AUTOCOMPLETE (Names starting with user input)
   Example: /api/customers/search?name=a
--------------------------------------------------------- */
export const searchCustomers = async (req, res) => {
  try {
    const { q } = req.query; // get search query from query string

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Query is required" });
    }

    // Use regex to match names starting with the query (case-insensitive)
    const customers = await Customer.find({
      name: { $regex: `^${q}`, $options: "i" },
    }).limit(10); // limit results

    res.status(200).json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------------
 ✅ GET ALL BILLS FOR CUSTOMER BY NAME
--------------------------------------------------------- */
export const getCustomerByName = async (req, res) => {
  try {
    const customerName = req.params.name;

    const customers = await Customer.find({
      name: { $regex: new RegExp(customerName, "i") },
    });

    if (customers.length === 0) {
      return res
        .status(404)
        .json({ message: "No bills found for this customer" });
    }

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------------------------------------
 ✅ UPDATE CUSTOMER (Name, Amount, Date)
--------------------------------------------------------- */
export const updateCustomer = async (req, res) => {
  try {
    const { name, amount, date } = req.body;

    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    if (name) customer.name = name;
    if (amount) customer.amount = amount;
    if (date) customer.date = new Date(date);

    const updatedCustomer = await customer.save();

    res.json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------------------------------------
 ✅ DELETE CUSTOMER ENTRY
--------------------------------------------------------- */
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------------------------------------
 ✅ GET TOTAL AMOUNT FROM ALL BILLS
--------------------------------------------------------- */
export const getTotalAmount = async (req, res) => {
  try {
    const result = await Customer.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const total = result[0]?.totalAmount || 0;

    res.json({ totalAmount: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
