const mongoose = require("mongoose")
const shortid = require("shortid")

const urlSchema = () => {
    return new mongoose.Schema({
        fullUrl: {
            type: String,
            required: true,
            unique: true
        },
        sortUrl: {
            type: String,
            default: shortid.generate
        },
        clicks: {
            type: Number,
            default: 0
        }
    }, {
        timestamps: true,
        versionKey: false
    })
}
const Url = mongoose.model("Url", urlSchema())


module.exports = { Url }