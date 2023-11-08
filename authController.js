const User = require("./models/User")
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {secret} = require("./config")
const {validationResult} = require("express-validator")

const generateAccessToken = (passportNumber, roles) => {
    const payload = {
        passportNumber,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn:60 * 10})
}

class authController{
    async registration(request, response){
        try{
            const errors = validationResult(request)
            if(!errors.isEmpty()){
                return response.status(400).json({message:"validation error", errors})
            }
            const {passportNumber, password} = request.body;
            const candidate = User.findOne({passportNumber})
            if(candidate.passportNumber){
                return response.status(400).json({message:`User already registered`})
            }
            const hashPassword = bcrypt.hashSync(password, 10);
            const userRole = await Role.findOne({value:"voter"})
            const user = new User({passportNumber, password: hashPassword, roles:[userRole.value]});
            await user.save();
            return response.json({message:"Registration successful"});
        }catch (e){
            console.log(e)
            response.status(400).json({message:'Registration error'})
        }
    }
    async login(request, response){
        try{
            const {passport, password} = request.body
            const user = await User.findOne({passport})
            if(!user){
                return response.status(404).json({message:'No such user'})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword){
                return response.status(400).json({message:'Password not compare'})
            }
            const token = generateAccessToken(user.passportNumber, user.roles);
            return response.json({token})
        }catch (e){
            console.log(e)
            response.status(400).json({message:'Login error'})
        }
    }
    async getUsers(request, response){
        try{
            const users = await User.find();
            return response.json(users)
        }catch (e){

        }
    }
}

module.exports = new authController();