const mongoose = require('mongoose');

const usedJwtSchema = new mongoose.Schema({
    jwt: { type: String, required: true },
});

const UsedJwt = mongoose.model('UsedJwt', usedJwtSchema);

module.exports = UsedJwt;