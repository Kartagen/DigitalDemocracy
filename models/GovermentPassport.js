const mongoose = require('mongoose');

const governmentPassportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    cityOfResidence: { type: String, required: true },
    passportNumber: { type: String, required: true, unique: true },
});

const GovernmentPassport = mongoose.model('GovernmentPassport', governmentPassportSchema);

module.exports = GovernmentPassport;