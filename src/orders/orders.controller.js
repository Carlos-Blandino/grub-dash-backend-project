const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

function isOrderValid(req, res, next) {
  const requiredFields = ["deliverTo", "mobileNumber", "dishes"];

  for (const field of requiredFields) {
    if (!req.body.data[field]) {
      return next({
        status: 400,
        message: `${field} is required`,
      });
    }
  }

  next();
}
function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
      res.locals.order = foundOrder;
      return next();
    }
    next({
      status: 404,
      message: `Order id not found: ${orderId}`,
    });
  }
function isDishArrayEmpty(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if (dishes.length === 0) {
      next({
        status: 400,
        message: `Order must include at least one dish.`,
      });
    }
    next();
  }
function isDishAValidArray(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if (Array.isArray(dishes)) {
      return next();
    }
    next({
      status: 400,
      message: `Order must include at least one dish.`,
    });
  next();
}

function isDishQuantityMissing(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  console.log("data", dishes);
  const missingQuantity = dishes.find((dish) => !dish.quantity);
  if (missingQuantity) {
    missingQuantity.index = dishes.indexOf(missingQuantity);
    next({
      status: 400,
      message: `Dish ${missingQuantity.index} must have a quantity that is an integer greater than 0.`,
    });
  }
  return next();
}
function isDishQuantityZero(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  for (let i = 0; i < dishes.length; i++) {
    if (dishes[i].quantity < 1) {
      next({
        status: 400,
        message: `Dish ${i} must have a quantity that is an integer greater than 0.`,
      });
    }
  }

  return next();
}
function isDishQuantityInterger(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  for (let i = 0; i < dishes.length; i++) {
    if (!Number.isInteger(dishes[i].quantity)) {
      next({
        status: 400,
        message: `Dish ${i} must have a quantity that is an integer greater than 0.`,
      });
    }
  }

  return next();
}

function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo: deliverTo,
    mobileNumber: mobileNumber,
    status: status,
    dishes: dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}
function read(req, res, next) {
   res.json({ data: res.locals.order });
}
function update(req, res, next) {
  next();
}
function destroy(req, res, next) {
  next();
}
function list(req, res, next) {
  res.status(200).json({ data: orders });
}
module.exports = {
  create: [
    isOrderValid,
    isDishAValidArray,
    isDishArrayEmpty,
    isDishQuantityMissing,
    isDishQuantityZero,
    isDishQuantityInterger,
    create,
  ],
  read:[orderExists, read],
  update:[orderExists,isOrderValid, update],
  delete:[orderExists, destroy],
  list,
};
