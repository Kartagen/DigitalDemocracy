const Router = require('express');
const controller = require("../controllers/voteController");
const checkAdminMiddleware = require("../middleware/checkAdminMiddleware");
const router = new Router();

// Створення нового голосування
router.post('/create', checkAdminMiddleware, controller.create);

// Оновлення інформації про голосування
router.patch('/:id/update', checkAdminMiddleware, controller.update);

// Видалення голосування
router.delete('/:id/delete', checkAdminMiddleware, controller.delete);

// Отримання усіх голосувань разом з фільтрацією
router.get('/all', controller.getFilteredVotes);

// Отримання результат голосування з його статистикою
router.get('/result/:id', controller.getVoteResults);

// Отримання голосування з усіма його кандидатами
router.get('/:id', controller.getWithCandidates);



module.exports = router;