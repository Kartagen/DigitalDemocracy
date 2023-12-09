const express = require('express');
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");
const staffRouter = require("./routers/staffRouter");
const candidateRouter = require("./routers/candidateRouter");
const voteRouter = require("./routers/voteRouter");
const voteProcessRouter = require("./routers/voteProcessRouter");
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 5000;

const app = express();
const {connection} = require("./config");
const {autoBackup} = require("./services/backupService");
const fs = require("fs");
const https = require("https");
const options = {
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem'),
};

app.use(express.json());
app.use(fileUpload(undefined));
app.use("/auth", authRouter);
app.use("/staff",staffRouter)
app.use("/candidate", candidateRouter);
app.use("/vote", voteRouter);
app.use("/vote_process", voteProcessRouter);
const server = https.createServer(options, app);
const start = async () =>{
    try{
        await mongoose.connect(connection);
        await autoBackup();
        app.listen(PORT, () => console.log(`server started at port ${PORT}`));
    } catch (e){
        console.log(e);
    }
}

start();