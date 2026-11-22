
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const User = require("./models/User");
const Blog = require("./models/Blog");

const app = express();

// JWT Authentication Middleware
function verifyToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. Please login first."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {

        if (error) {
            return res.status(403).json({
                message: "Invalid or expired token."
            });
        }

        req.user = decoded;

        next();
    });
}

app.use(cors());
app.use(express.json());

// Home API
app.get("/", (req, res) => {
    res.send("BlogSpace Backend Server is Running!");
});

// User Registration API
app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "Registration successful!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Registration failed"
        });

    }

});

// User Login API
app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
        message: "Login successful!",
        token: token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
        });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Login failed"
            });

        }

        });

// Get All Blogs API
app.get("/api/blogs", async (req, res) => {

    try {

        const blogs = await Blog.find().sort({ _id: -1 });

        res.json({
            blogs: blogs
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to fetch blogs"
        });

    }

});


// Get Logged-in User's Blogs API
app.get("/api/my-blogs", verifyToken, async (req, res) => {

    try {

        const blogs = await Blog.find({
            author: req.user.id
        }).sort({ _id: -1 });

        res.json({
            blogs: blogs
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to fetch your blogs"
        });

    }

});


// Create Blog API
app.post("/api/blogs", verifyToken, async (req, res) => {
    try {

        const { title, category, content } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({
                message: "Please fill all blog fields"
            });
        }

        const newBlog = new Blog({
            title,
            category,
            content,
            author: req.user.id
        });

        await newBlog.save();

        res.status(201).json({
            message: "Blog created successfully!",
            blog: newBlog
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Blog creation failed"
        });

    }

});

// Update Blog API
app.put("/api/blogs/:id", verifyToken, async (req, res) => {

    try {

        const { title, category, content } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({
                message: "Please fill all blog fields"
            });
        }

        const updatedBlog = await Blog.findOneAndUpdate(
        {
            _id: req.params.id,
            author: req.user.id
        },
        {
            title,
            category,
            content
        },
        {
            new: true,
            runValidators: true
        }
    );

        if (!updatedBlog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            message: "Blog updated successfully!",
            blog: updatedBlog
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Blog update failed"
        });

    }

});


// Delete Blog API
app.delete("/api/blogs/:id", verifyToken, async (req, res) => {

    try {

        const deletedBlog = await Blog.findOneAndDelete({
        _id: req.params.id,
        author: req.user.id
    });

        if (!deletedBlog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            message: "Blog deleted successfully!",
            blog: deletedBlog
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Blog deletion failed"
        });

    }

});

// Start Server
const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`BlogSpace server running at http://localhost:${PORT}`);
        });

    })
    .catch((error) => {

        console.error("MongoDB connection failed:", error);

    });
