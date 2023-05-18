import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER USER

export const register = async (req, res) => { // Here, we are making a call to mongoose database, which will be asynchronous. The call to the API will be from front end to back end, and then from backend to database. The req is for the request body we get from the front end, and the res is for the response that we get which is sent back to the frontend
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body; // We grab all this information/these parameters in the request body from the frontend and use it within this function

        // For encrypting the password, create a random salt with bcrypt and use it to encrypt the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt); // So that the password created is not exposed

        const newUser = new User({ // We will encrypt the password and save it. Then when the user tries to log in, they provide the password, we make sure it is the correct one, and then we give them a jsonwebtoken.
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000), // We just give this a random dummy figure
            impressions: Math.floor(Math.random() * 10000),
        }); 
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // Using the res argument provided by express. If there are no errors, We will send the user back a status of 201, and the frontend will receive this response if it is the correct user. Need to ensure that this is the correct response and it is in the correct format to be used in the frontend.
    } catch (err) {
        res.status(500).json({ error: err.message }) // If there is an error, the front end will get a 500 status error, with an error message of whatever MongoDB has returned.
    };
};

// LOGGING IN 

export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // We grab the email and password when the user tries to log in
        const user = await User.findOne({ email: email }); // Here, we use mongoose to find the one that has the specified email, and it will bring back all the user information.
        if(!user) return res.status(400).json({ msg: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password); // We use bcrypt to compare the password typed with the user password saved
        if(!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });

    } catch (err) {
        res.status(500).json({ error: err.message });          
    };
};