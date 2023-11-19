const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    passportNumber: { type: String, required: true, unique: true, ref: 'GovernmentPassport' },
    roleId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserRole' },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;