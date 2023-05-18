import Post from "../models/Post.js";
import User from "../models/User.js";

// CREATE

export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body // This is what the frontend will send through 
        const user = await User.findById(userId);
        const newPost = new Post({
            userId, 
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {}, // this will be something like "some id": true - either they liked it or they didn't, really
            comments: []
        })
        await newPost.save();

        const post = await Post.find(); // We save the post, and we want to make sure we can find and grab all posts in this case
        res.status(201).json(post);

    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

// READ

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find(); // Basically grabbing the news feed
        res.status(200).json(post); // 201 for creating something, 200 for a successful request
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId }); // This will only grab the user posts
        res.status(200).json(post); 
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// UPDATE

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId); // Checking if the user id exists. If it does, then that means the post has been liked by that user

        if(isLiked) {
            post.likes.delete(userId); // Delete it if it exists, set it if it doesn't exist
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate( // this is how we update a specific post
            id,
            { likes: post.likes }, // list of likes that we modify
            { new: true }
        );

        res.status(200).json(updatedPost); // RECAP: We're grabbing the post information, we're grabbing whether the user liked it or not, and if they'd liked it then we will delete them, and if they haven't previously liked it, we will set them. Then we pass in the updatedPost so that we can update the front end once you click the like button.

    } catch (err) {
        res.status(404).json({ message: err.message });
    }

};



