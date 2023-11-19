const User = require("../models/User");
const Role = require('../models/Role');
const GovernmentPassport = require("../models/GovermentPassport");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret} = require("../config")
const {validationResult} = require("express-validator");
const request = require('request-promise');
const decode = require('jsqr');
const { createCanvas, loadImage } = require('canvas');

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
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(422).json({ message: 'Validation error', errors });
            }

            const { passportNumber, email, password } = request.body;

            // Перевірка наявності паспорта у GovernmentPassport
            const passportExists = await GovernmentPassport.findOne({ passportNumber });
            if (!passportExists) {
                return response.status(404).json({ message: 'Passport not found in the government records' });
            }

            // Перевірка віку
            const birthDate = passportExists.dateOfBirth;
            const age = calculateAge(birthDate);
            if (age < 18) {
                return response.status(400).json({ message: 'User must be at least 18 years old' });
            }

            // Перевірка наявності користувача за паспортом
            const existingUser = await User.findOne({ passportNumber });
            if (existingUser) {
                return response.status(402).json({ message: 'User already registered' });
            }

            // Перевірка наявності користувача за електронною поштою
            const existingEmailUser = await User.findOne({ email });
            if (existingEmailUser) {
                return response.status(403).json({ message: 'Email is already in use' });
            }
            const hashPassword = bcrypt.hashSync(password, 10);
            const userRole = await Role.findOne({ role: 'voter' });

            const user = new User({
                passportNumber,
                email,
                password: hashPassword,
                roleId: userRole._id,
            });

            await user.save();

            return response.json({ message: 'Registration successful' });
        }catch (e){
            console.log(e)
            response.status(500).json({message:'Internal Server Error'})
        }
    }
    async login(request, response){
        try{
            const {email, password} = request.body
            const user = await User.findOne({email})
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
            response.status(500).json({message:'Internal Server Error'})
        }
    }
    async passportLogin(req, res){
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ message: 'No files were uploaded.' });
            }

            const uploadedFile = req.files.image;
            const imageBuffer = uploadedFile.data;

            const qrData = await readQRCode(imageBuffer);
            if (qrData) {
                try {
                    res.json({ message: 'Registration successful' });
                } catch (err) {

                }
            } else {
                res.status(400).json({ message: 'Unable to read QR code data' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async newPassport(request, response){
        try {
            const { name, surname, dateOfBirth, cityOfResidence, passportNumber } = request.body;

            // Перевірка наявності паспорта за номером
            const existingPassport = await GovernmentPassport.findOne({ passportNumber });
            if (existingPassport) {
                return response.status(400).json({ message: 'Passport with this number already exists' });
            }

            // Створення нового паспорта
            const newPassport = new GovernmentPassport({
                name,
                surname,
                dateOfBirth,
                cityOfResidence,
                passportNumber,
            });

            await newPassport.save();

            return response.json({ message: 'New passport data added successfully' });
        } catch (e) {
            console.log(e);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
async function readQRCode(imageBuffer) {
    try {
        const image = await loadImage(imageBuffer);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = decode(imageData.data, imageData.width, imageData.height);
        console.log(qrCode.data)
        if (qrCode.data) {
            try {
                const webpageContent = await request(qrCode.data);
                return webpageContent;
            } catch (webpageError) {
                console.error('Error fetching webpage:', webpageError);
            }
        } else {
            console.error('Unable to read QR code data');
        }
    } catch (error) {
        console.error('Error reading QR code:', error);
        throw error;
    }
}
function calculateAge(birthDate) {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
}
module.exports = new authController();