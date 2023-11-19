const Router = require('express');
const router = new Router();
const controller = require('../controllers/authController')

router.post("/registration", controller.registration);
router.post("/login", controller.login);
router.post("/new_passport", controller.newPassport);
router.post("/login/passport", controller.passportLogin);

module.exports = router;