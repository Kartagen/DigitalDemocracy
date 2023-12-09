const Router = require('express');
const controller = require("../controllers/voteProcessController");
const router = new Router();
const checkAuthorizedMiddleware = require("../middlewares/checkAuthorizedMiddleware")


router.post("/vote",checkAuthorizedMiddleware, controller.addVote);
router.get("/verify",checkAuthorizedMiddleware, controller.verify);
router.post("/delete_qr/",checkAuthorizedMiddleware,controller.addUsedJwt)
module.exports = router;