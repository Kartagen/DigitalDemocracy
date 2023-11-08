const {secret} = require("../config")
const jwt = require("jsonwebtoken");
module.exports = function (request, result, next){
    if(request.method === "options"){
        next()
    }

    try{
        const token = request.headers.authorization.split(' ')[1]
        if(!token)
            return result.status(403).json({message:"user isn`t authorized"})
        request.user = jwt.verify(token, secret);
        next();
    } catch (e){
        console.log(e)
        return result.status(403).json({message:"user isn`t authorized"})
    }
}