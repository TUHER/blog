let mongoose = require("mongoose")
let Schema = mongoose.Schema;

let postSchema = new Schema({
    postAuthor: {
        type: String,
        required: true,
    },
    postTitle: {
        type: String,
        requierd: true,
    },
    postContent: {
        type: String,
        requierd: true,
    },
}, {timestamps: true});

let postModel = mongoose.model("postModel", postSchema);

module.exports = postModel;