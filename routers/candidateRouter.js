const Router = require('express');
const router = new Router();
const controller = require('../controllers/candidateController')
const checkAdminMiddleware = require("../middlewares/checkAdminMiddleware");

router.get('/', controller.getAllCandidates);
router.post("/create",checkAdminMiddleware, controller.registration);
router.patch("/:id/update",checkAdminMiddleware, controller.update);
router.delete("/:id/delete",checkAdminMiddleware, controller.delete);

module.exports = router;