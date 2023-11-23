const Router = require('express');
const controller = require("../controllers/staffController");
const checkStaffMiddleware = require("../middleware/CheckStaffMiddleware");
const router = new Router();


router.post("/generateQr",checkStaffMiddleware, controller.generateQrLogin);
module.exports = router;