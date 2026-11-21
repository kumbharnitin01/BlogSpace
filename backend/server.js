
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Blog = require("./models/Blog");

const app = express();

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

        res.json({
            message: "Login successful!",
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

// Create Blog API
app.post("/api/blogs", async (req, res) => {

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
            content
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
app.put("/api/blogs/:id", async (req, res) => {

    try {

        const { title, category, content } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({
                message: "Please fill all blog fields"
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
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
app.delete("/api/blogs/:id", async (req, res) => {

    try {

        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

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
