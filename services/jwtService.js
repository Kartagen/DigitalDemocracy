const jwt = require("jsonwebtoken");
const {secret} = require("../config");
function generateAccessToken (passportNumber, userRole){
    const payload = {
        passportNumber,
        userRole
    }
    return jwt.sign(payload, secret, {expiresIn:60 * 60 * 1000})
}
module.exports = {generateAccessToken}