import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path"; // native package which comes with node
import { fileURLToPath } from "url"; // These two will allow us to set paths when we configure directories
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

// MIDDLEWARE (what runs in between requests and different things) AND PACKAGE CONFIGURATIONS

const __filename = fileURLToPath(import.meta.url); // Having added the type module to package.json, this allows us to use/grab file and directory names
const __dirname = path.dirname(__filename);

dotenv.config(); // invoke this so that we can use .env files

const app = express(); // invoke our express app so that we can use the app middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // sets the directory for where we keep our assets. Usually would want to put them in a storage file directory or something like S3. But keeping it simple here...

// FILE STORAGE

// info from multer's Github repo

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets"); // how files will be saved when uploaded
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage }); // We use this variable whenever we need to upload a file

// ROUTES WITH FILES

app.post("/auth/register", upload.single("picture"), register); // We will use middleware (upload.single("picture")) which will act between the user registering and the data being logged and handled by the database. Note that we need the upload variable in here, which is why it cannot have its own separate route file.

app.post("/posts", verifyToken, upload.single("picture"), createPost); // We also need a route with files for this, because whenever a user creates a post, we want them to also be able to upload a photo along with it.

// ROUTES

app.use("/auth", authRoutes);

// We want to create three users' routes - one for grabbing any particular user via their id, another for their friends/friends list, and a third route for adding or removing friends.
app.use("/users", userRoutes);

app.use("/posts", postRoutes);

// MONGOOSE SET-UP

const PORT = process.env.PORT || 6001; // If it doesn't work, go to 6001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`)); // Connecting from the database to node




