
// Функція для розрахунку кількості років за датою народження
function calculateAge(birthDate) {
    // Отримання поточної дати.
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    // Розрахунок різниці у роках між поточною датою та датою народження.
    let age = today.getFullYear() - birthDateObj.getFullYear();
    // Розрахунок різниці у місяцях та перевірка, чи є особа вже народженою у поточному місяці.
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        // Зменшення віку, якщо особа ще не відсвяткувала день народження в поточному місяці.
        age--;
    }
    return age;
}
module.exports = {calculateAge}