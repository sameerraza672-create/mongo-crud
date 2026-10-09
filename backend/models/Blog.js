const mongoose = require("mongoose")

module.exports = mongoose.model("blog", new mongoose.Schema({
    title: { type: String, requirerd: true },
    desc: { type: String, requirerd: true },
    hero: { type: String, requirerd: true },
}))