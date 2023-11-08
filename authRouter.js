const Router = require('express');
const router = new Router();
const controller = require('./authController')
const {check} = require('express-validator')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post("/registration",[
    check("passportNumber","there are problems with passport").notEmpty(),
    check("password","there are problems with password").isLength({min:8,max:15})
], controller.registration);
router.post("/login", controller.login);
router.get("/users",roleMiddleware(["admin"]), controller.getUsers);

module.exports = router;