const Router = require('express');
const router = new Router();
const controller = require('../controllers/candidateController')
const checkAdminMiddleware = require("../middleware/checkAdminMiddleware");

router.get('/', controller.getAllCandidates);
router.post("/registration",checkAdminMiddleware, controller.registration);
router.patch("/update",checkAdminMiddleware, controller.update);
router.delete("/delete",checkAdminMiddleware, controller.delete);

module.exports = router;