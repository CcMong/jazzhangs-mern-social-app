import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        likes: {
            type: Map,
            of: Boolean, // Check if the user ID exists in this map. It will either be true or false. If you like it, you will add to this map. If you don't like it, you will remove the map. More efficient and performant to use a map than an array here - for large numbers of likes, we would otherwise have to loop through all to find what we are looking for.
        },
        comments: {
            type: Array,
            default: []
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;