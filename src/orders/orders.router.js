const router = require("express").Router();
const orderController = require("../orders/orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
// TODO: Implement the /orders routes needed to make the tests pass

router
  .route("/")
  .get(orderController.list)
  .post(orderController.create)
  .all(methodNotAllowed);

router
  .route("/:orderId")
  .put(orderController.update)
  .get(orderController.read)
  .delete(orderController.destroy)
  .all(methodNotAllowed);
module.exports = router;
