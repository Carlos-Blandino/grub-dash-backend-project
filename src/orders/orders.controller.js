const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

//Start of Middleware functions
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

function isDishQuantityMissing(req, res, next) {
  const { data: { dishes } = {} } = req.body;
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

function isIdMatchingOrderId(req, res, next) {
  const { id } = req.body.data;
  const { orderId } = req.params;
  if (id === orderId || !id) {
    return next();
  }
  next({
    status: 400,
    message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
  });
}

function isStatusValueMissing(req, res, next) {
  const { data: { status } = {} } = req.body;
  switch (status) {
    case "pending":
    case "preparing":
    case "out-for-delivery":
    case "delivered":
      return next();
    default:
      next({
        status: 400,
        message: `Order must have a status of pending, preparing, out-for-delivery, delivered.`,
      });
  }
}

function isStatusDelivered(req, res, next) {
  const { data: { status } = {} } = req.body;
  if (status === "delivered") {
    next({
      status: 400,
      message: "A delivered order cannot be changed",
    });
  }
  return next();
}

function isOrderStatusPending(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  const { status } = foundOrder;

  if (status === "pending") {
    next();
  } else {
    next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
    });
  }
}

// End of Middleware functions

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

function list(req, res, next) {
  res.status(200).json({ data: orders });
}

function update(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  res.json({ data: order });
}

function destroy(req, res, next) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);
  orders.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [
    isOrderValid,
    isDishAValidArray,
    isDishArrayEmpty,
    isDishQuantityMissing,
    isDishQuantityZero,
    isDishQuantityInterger,
    create,
  ],
  read: [orderExists, read],
  update: [
    orderExists,
    isOrderValid,
    isDishAValidArray,
    isDishArrayEmpty,
    isDishQuantityMissing,
    isDishQuantityZero,
    isDishQuantityInterger,
    isIdMatchingOrderId,
    isStatusValueMissing,
    isStatusDelivered,
    update,
  ],
  delete: [orderExists, isOrderStatusPending, destroy],
};
