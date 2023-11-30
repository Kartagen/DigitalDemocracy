const Router = require('express');
const controller = require("../controllers/voteProcessController");
const router = new Router();
const checkAuthorizedMiddleware = require("../middleware/checkAuthorizedMiddleware")


router.post("/vote",checkAuthorizedMiddleware, controller.addVote);
module.exports = router;