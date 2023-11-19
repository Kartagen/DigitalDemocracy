const express = require('express');
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 5000;

const app = express();
const connection = "mongodb+srv://server:O8qy9c9vPJnxJJhd@cluster0.mmgb2cb.mongodb.net/?retryWrites=true&w=majority";

app.use(express.json());
app.use(fileUpload());
app.use("/auth", authRouter);

const start = async () =>{
    try{
        await mongoose.connect(connection);
        app.listen(PORT, () => console.log(`server started at port ${PORT}`));
    } catch (e){
        console.log(e);
    }
}

start();