const express = require('express');
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");
const staffRouter = require("./routers/staffRouter");
const candidateRouter = require("./routers/candidateRouter");
const voteRouter = require("./routers/voteRouter");
const voteProcessRouter = require("./routers/voteProcessRouter");
const fileUpload = require('express-fileupload');
const {connection} = require("./config");
const {autoBackup} = require("./services/backupService");
const fs = require("fs");
const https = require("https");
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const options = {
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem'),
};
app.use(express.json());
app.use(fileUpload(undefined));
// Додавання маршрутів до сервера
app.use("/auth", authRouter);
app.use("/staff",staffRouter)
app.use("/candidate", candidateRouter);
app.use("/vote", voteRouter);
app.use("/vote_process", voteProcessRouter);
// Підключення HTTPS
const server = https.createServer(options, app);
const start = async () =>{
    try{
        // Підключення до бази даних
        await mongoose.connect(connection);
        // Створення резервної копії, якщо її ще не створено сьогодні
        await autoBackup();
        // Запуск сервера програми
        app.listen(PORT, () => console.log(`server started at port  ${PORT}`));
    } catch (e){
        console.log(e);
    }
}
start();
