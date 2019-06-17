const router = require("express").Router();
const activityController = require("../controllers/activityController");

router.route("/all-activities")
  .get(activityController.findAll)
  
router.route("/activities")
  .get(activityController.findAllByUser)
  .post(activityController.create);

router
  .route("/activities/:id")
  .get(activityController.findById)
  .put(activityController.update)
  .delete(activityController.remove);

module.exports = router;