const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res, next) {
  res.json({ data: dishes });
}

function isValidDish(req, res, next) {
  const requiredFields = ["name", "description", "price", "image_url"];

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

function isPriceANumber(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (Number.isInteger(price)) {
    next();
  }
  next({
    status: 400,
    message: "Dish must have a price that is an integer greater than 0",
  });
}

function isPriceGreaterThanZero(req, res, next) {
  const { data: { price } = {} } = req.body;

  if (price > 0) {
    return next();
  }
  next({
    status: 400,
    message: `Dish must have a price that is an integer greater than 0`,
  });
}

function create(req, res, next) {
  const {
    data: { name, description, image_url, price },
  } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    image_url,
    price,
  };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.status(200).json({ data: foundDish });
  }
  next({ status: 404, message: `${dishId} is not valid` });
}
function isDishIdExist(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);

  if (foundDish) {
    next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}.`,
  });
}
function isIdMatchingDishId(req, res, next) {
  const { data: { id } = {} } = req.body;
  const { dishId } = req.params;
  if (id === dishId || !id) {
    return next();
  }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}.`,
  });
}
function update(req, res, next) {
  const foundIndex = dishes.findIndex((dish) => dish.id === dishId);
  const {
    data: { name, description, image_url, price },
  } = req.body;
  dishes[foundIndex].name = name;
  dishes[foundIndex].description = description;
  dishes[foundIndex].image_url = image_url;
  dishes[foundIndex].price = price;
  res.status(200).json({ data: dishes[foundIndex] });
}

module.exports = {
  list,
  create: [isValidDish, isPriceGreaterThanZero, create],
  read,
  update: [
    isDishIdExist,
    isIdMatchingDishId,
    isValidDish,
    isPriceGreaterThanZero,
    isPriceANumber,
    update,
  ],
};
