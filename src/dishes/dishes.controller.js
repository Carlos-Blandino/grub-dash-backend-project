const { resolve } = require("path");
const path = require("path");


// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");


// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req,res,next) {
    res.json({data: dishes})
}

function isValidDish(req,res,next) {
    const requiredFields = ["name","description","price","image_url"];
  
    for ( const field of requiredFields){
       if(!req.body.data[field]) {
        return next({
                status: 400,
                message: `${field} is required`
            })
           }
       }
       
    next();
}
function create(req,res,next) {
    
    const {data: {name, description, image_url,price}} = req.body
    const newDish = {
        id: nextId(),
        name,
        description,
        image_url,
        price,
}

dishes.push(newDish);
res.status(201).json({data: newDish});

}

function read(req,res,next){
    const {dishId }= req.params
    const foundDish = dishes.find((dish)=> dish.id === dishId);
    if(foundDish){
        res.status(200).json({data: foundDish});
    } 
    next({status: 404, message: `${dishId} is not valid`})
}
function update(req, res, next) {
    const { dishId } = req.params;
    const foundIndex = dishes.findIndex((dish) => dish.id === Number(dishId));
    if (foundIndex !== -1) {
      const dish = dishes[foundIndex];
      const {
        data: { name, description, image_url, price },
      } = req.body;
      dish.name = name;
      dish.description = description;
      dish.image_url = image_url;
      dish.price = price;
      res.status(200).json({ data: dishes[foundIndex] });
    } else {
      next({ status: 404, message: `${dishId} is not valid` });
    }
    const {
      data: { name, description, image_url, price },
    } = req.body;
  
    if (foundDish) {
      const newDish = {
        id: foundDish.id,
        name: name,
        description: description,
        image_url: image_url,
        price: price,
      };
    }
    next({ status: 404, message: `${dishId} is not valid` });
  }

module.exports = {
    list,
    create:[isValidDish, create],
    read,
    update: [isValidDish, update],

}