import Customer from "../models/Customer.js";

export const findOrCreateCustomer = async (customerName, session) => {
  let customer = await Customer.findOne({
    name: { $regex: new RegExp(`^${customerName}$`, "i") },
  });

  if (!customer) {
    customer = new Customer({
      name: customerName,
      amount: 0,
      date: new Date(),
    });
    await customer.save({ session });
  }

  return customer;
};
// customerName
// :
// "btc"
// freeItems
// :
// Array(1)
// 0
// :
// {name: 'Premium Bar 200g', quantity: 1, bags: '10', pieces: 0}
// length
// :
// 1
// [[Prototype]]
// :
// Array(0)
// grandTotal
// :
// 31200
// items
// :
// Array(2)
// 0
// :
// {id: 9, name: 'Utensil Cleaning Soap Rs 10', sellingPrice: 10, quantity: 1, bags: 20, …}
// 1
// :
// {id: 3, name: 'Fena 2kg', sellingPrice: 3100, quantity: 1, bags: 10, …}
// length
// :
// 2
// [[Prototype]]
// :
// Array(0)
// totalDispatch
// :
// Array(12)
// 0
// :
// {name: 'Fena 5kg', totalBags: 0, totalPieces: 0}
// 1
// :
// {name: 'Fena 3kg', totalBags: 0, totalPieces: 0}
// 2
// :
// {name: 'Fena 2kg', totalBags: 10, totalPieces: 0}
// 3
// :
// {name: 'Fena 1kg', totalBags: 0, totalPieces: 0}
// 4
// :
// {name: 'Fena 500g', totalBags: 0, totalPieces: 0}
// 5
// :
// {name: 'Washing Soap Rs 10', totalBags: 0, totalPieces: 0}
// 6
// :
// {name: 'Washing Soap Rs 5', totalBags: 0, totalPieces: 0}
// 7
// :
// {name: 'Utensil Cleaning Soap Rs 5', totalBags: 0, totalPieces: 0}
// 8
// :
// {name: 'Utensil Cleaning Soap Rs 10', totalBags: 20, totalPieces: 0}
// 9
// :
// {name: 'Utensil Cleaning Soap Rs 30', totalBags: 0, totalPieces: 0}
// 10
// :
// {name: 'Premium Bar 200g', totalBags: 10, totalPieces: 0}
// 11
// :
// {name: 'Premium Bar 300g', totalBags: 0, totalPieces: 0}
