const router = require("express").Router();
const dishController = require("../dishes/dishes.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

// TODO: Implement the /dishes routes needed to make the tests pass

router
.route("/")
.get(dishController.list)
.post(dishController.create)
.all(methodNotAllowed)

router
.route("/:dishId")
.put(dishController.update)
.get(dishController.read)
.all(methodNotAllowed)
module.exports = router;
