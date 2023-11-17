const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
    roleId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    role: { type: String, required: true },
});

const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;