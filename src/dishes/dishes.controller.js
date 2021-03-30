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

module.exports = {
    list,
    create:[isValidDish, create]
}