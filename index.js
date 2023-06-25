const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { Url } = require("./models/schema")
const shortid = require("shortid")
const bodyParser = require("body-parser")
const { render } = require("ejs")
const port = process.env.port || 8800
const uri = "mongodb://127.0.0.1:27017/urlShortner"

const createConnection = async () => {
    return await mongoose.connect(uri)
}

createConnection().then(() => {
    console.log("connection successfull...");
}).catch(() => {
    console.log("error in connecting database!!!");
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("./public"))
app.set("view engine", "ejs")

app.get("/", async (req, res) => {
    try {
        const respoceFormDb = await Url.find({})
        res.render("index", {
            shortUrls: respoceFormDb
        })
    } catch (error) {
        res.render("404")
    }
})

app.post("/sortUrl", async (req, res) => {
    try {
        const url = new Url({
            fullUrl: req.body.longUrl,
            sortUrl: shortid.generate().substring(0, 5),
        })
        const respoceFormDb = await url.save()
        res.redirect("/")
    } catch (error) {
        res.render("404")
    }
})

// for requesting short link
app.get("/:sortUrl", async (req, res) => {
    try {
        const respoceFormDb = await Url.findOneAndUpdate({sortUrl: req.params.sortUrl}, {$inc: {clicks: 1}}, {new: true})
        if (respoceFormDb == null) throw new Error("data found")
        const mainUrl = respoceFormDb.fullUrl
        res.redirect(mainUrl)
    } catch (error) {
        res.render("404")
    }
})

app.use((req, res)=>{
    res.render("404")
})

app.listen(port, () => {
    console.log(`server listen on http://localhost:${port}`);
})