const {Schema, model} = require('mongoose');


const Role = new Schema ({
    value: {type: String, unique: true, default:"voter", required: true}
})

module.exports = model("Role", Role);