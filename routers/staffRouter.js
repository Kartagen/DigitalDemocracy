const Router = require('express');
const controller = require("../controllers/staffController");
const checkStaffMiddleware = require("../middlewares/checkStaffMiddleware");
const checkAdminMiddleware = require("../middlewares/checkAdminMiddleware");
const router = new Router();


router.post("/generateQr",checkStaffMiddleware, controller.generateQrLogin);
router.get('/export', checkAdminMiddleware ,controller.exportData);
router.get('/import', checkAdminMiddleware ,controller.importData);
module.exports = router;