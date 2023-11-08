const jwt = require("jsonwebtoken");
const {secret} = require("../config");
module.exports = function (roles){
    return function (request, result, next){
        if(request.method === "options"){
            next()
        }

        try{
            const token = request.headers.authorization.split(' ')[1]
            if(!token)
                return result.status(403).json({message:"user isn`t authorized"})
            const {roles: userRoles} = jwt.verify(token,secret);
            let hasRole = false;
            userRoles.forEach(role => {
                    if(roles.includes(role)){
                        hasRole = true;
                    }
            })
            if(!hasRole){
                return result.status(403).json({message:"access denied"})
            }
            next();
        } catch (e){
            console.log(e)
            return result.status(403).json({message:"user isn`t authorized"})
        }
    }
}