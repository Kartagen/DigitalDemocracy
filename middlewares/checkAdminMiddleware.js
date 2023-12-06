const jwt = require('jsonwebtoken');
const { secret } = require("../config");
const Role = require('../models/Role');

const checkAdminMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized. Token missing.' });
    }
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Token missing.' });
    }

    try {
        const decodedToken = jwt.verify(token, secret);
        const userRoleId = decodedToken.userRole;
        const roleExists = await Role.findOne({ _id: userRoleId });
        if (roleExists.role==="admin") {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admin role required.' });
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    }
};
module.exports = checkAdminMiddleware;