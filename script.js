
// ===============================
// BLOG SEARCH FUNCTIONALITY
// ===============================

const searchInput = document.getElementById("searchInput");

const blogCards = document.querySelectorAll(".blog-card");

const noResults = document.getElementById("noResults");

if (searchInput && noResults) {

    searchInput.addEventListener("input", function () {

        const searchValue = searchInput.value.toLowerCase();

        let visibleCount = 0;

        blogCards.forEach(function (card) {

            const blogText = card.innerText.toLowerCase();

            if (blogText.includes(searchValue)) {

                card.style.display = "block";
                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });

        noResults.hidden = visibleCount !== 0;

    });

}




// ===============================
// LOGIN FORM
// ===============================


// BACKEND USER LOGIN

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const loginMessage = document.getElementById("loginMessage");

        try {

            const response = await fetch("https://blogspace-4k3y.onrender.com/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {

                loginMessage.textContent = data.message;
                loginMessage.style.color = "green";

                // Save JWT token
                localStorage.setItem("token", data.token);

                // Save logged-in user's email
                localStorage.setItem("loggedInUser", data.user.email);

                // Save logged-in user's ID
                localStorage.setItem("userId", data.user.id);

                // Save logged-in user's name
                localStorage.setItem("userName", data.user.name);

                // Open Dashboard
                setTimeout(function() {
                    window.location.href = "dashboard.html";
                }, 1000);

            } else {

                loginMessage.textContent = data.message;
                loginMessage.style.color = "red";

            }

        } catch (error) {

            loginMessage.textContent = "Cannot connect to backend server!";
            loginMessage.style.color = "red";

            console.error(error);

        }

    });

}




// ===============================
// REGISTRATION FORM
// ===============================


// BACKEND USER REGISTRATION

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const registerMessage = document.getElementById("registerMessage");

        // Check passwords
        if (password !== confirmPassword) {
            registerMessage.textContent = "Passwords do not match!";
            registerMessage.style.color = "red";
            return;
        }

        if (password.length < 6) {
            registerMessage.textContent = "Password must contain at least 6 characters!";
            registerMessage.style.color = "red";
            return;
        }

        try {

            const response = await fetch("https://blogspace-4k3y.onrender.com/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {

                registerMessage.textContent = data.message;
                registerMessage.style.color = "green";

                registerForm.reset();

            } else {

                registerMessage.textContent = data.message;
                registerMessage.style.color = "red";

            }

        } catch (error) {

            registerMessage.textContent = "Cannot connect to backend server!";
            registerMessage.style.color = "red";

            console.error(error);

        }

    });

}


// Create Blog Functionality


// Create Blog Functionality - Backend API

const createBlogForm = document.getElementById("createBlogForm");

if (createBlogForm) {

    createBlogForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const title = document.getElementById("blogTitle").value.trim();
        const category = document.getElementById("blogCategory").value;
        const content = document.getElementById("blogContent").value.trim();

        const blogMessage = document.getElementById("blogMessage");

        if (title === "" || category === "" || content === "") {
            blogMessage.textContent = "Please fill in all fields.";
            blogMessage.style.color = "red";
            return;
        }

        try {

            const response = await fetch("https://blogspace-4k3y.onrender.com/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    title: title,
                    category: category,
                    content: content
                })
            });

            const data = await response.json();

            if (response.ok) {

                blogMessage.textContent = data.message;
                blogMessage.style.color = "green";

                createBlogForm.reset();

            } else {

                blogMessage.textContent = data.message;
                blogMessage.style.color = "red";

            }

        } catch (error) {

            blogMessage.textContent = "Cannot connect to backend server!";
            blogMessage.style.color = "red";

            console.error(error);

        }

    });

}



// Display Saved Blogs on Homepage


 
// Display Backend Blogs on Homepage

const savedBlogsContainer = document.getElementById("savedBlogs");

if (savedBlogsContainer) {

    async function displayBackendBlogs() {

        try {

            const response = await fetch("https://blogspace-4k3y.onrender.com/api/blogs");
            const data = await response.json();

            savedBlogsContainer.innerHTML = "";

            data.blogs.forEach(function(blog) {

                const blogCard = document.createElement("div");
                blogCard.className = "blog-card";

                const blogInfo = document.createElement("div");
                blogInfo.className = "blog-info";

                const category = document.createElement("span");
                category.textContent = blog.category;

                const title = document.createElement("h3");
                title.textContent = blog.title;

                const content = document.createElement("p");
                content.textContent = blog.content;

                const date = document.createElement("small");
                date.textContent = "Published on: " + blog.date;

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.className = "edit-btn";

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "delete-btn";

                // Edit Blog
                editButton.addEventListener("click", async function() {

                    const newTitle = prompt("Enter new blog title:", blog.title);

                    if (newTitle === null || !newTitle.trim()) {
                        return;
                    }

                    const newCategory = prompt("Enter new category:", blog.category);

                    if (newCategory === null || !newCategory.trim()) {
                        return;
                    }

                    const newContent = prompt("Enter new content:", blog.content);

                    if (newContent === null || !newContent.trim()) {
                        return;
                    }

                    try {

                        const response = await fetch(
                            "https://blogspace-4k3y.onrender.com/api/blogs/" + blog._id,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + localStorage.getItem("token")
                                },
                                body: JSON.stringify({
                                    title: newTitle,
                                    category: newCategory,
                                    content: newContent
                                })
                            }
                        );

                        const result = await response.json();

                        alert(result.message);

                        if (response.ok) {
                            displayBackendBlogs();
                        }

                    } catch (error) {
                        alert("Unable to update blog.");
                    }

                });

                // Delete Blog
                deleteButton.addEventListener("click", async function() {

                    const confirmDelete = confirm(
                        "Are you sure you want to delete this blog?"
                    );

                    if (!confirmDelete) {
                        return;
                    }

                    try {

                        const response = await fetch(
                            "https://blogspace-4k3y.onrender.com/api/blogs/" + blog._id,
                            {
                                method: "DELETE",
                                headers: {
                                    "Authorization": "Bearer " + localStorage.getItem("token")
                                }
                            }
                        );

                        const result = await response.json();

                        alert(result.message);

                        if (response.ok) {
                            displayBackendBlogs();
                        }

                    } catch (error) {
                        alert("Unable to delete blog.");
                    }

                });

                blogInfo.appendChild(category);
                blogInfo.appendChild(title);
                blogInfo.appendChild(content);
                blogInfo.appendChild(date);

                blogCard.appendChild(blogInfo);
                blogCard.appendChild(editButton);
                blogCard.appendChild(deleteButton);

                savedBlogsContainer.appendChild(blogCard);

            });

            if (data.blogs.length === 0) {
                savedBlogsContainer.innerHTML = "<p>No blogs published yet.</p>";
            }

        } catch (error) {

            console.error("Error loading blogs:", error);
            savedBlogsContainer.innerHTML = "<p>Unable to load blogs.</p>";

        }

    }

    displayBackendBlogs();

}






// Dynamic Dashboard Statistics


// Dynamic Dashboard Statistics from MongoDB

const totalBlogsElement = document.getElementById("totalBlogs");
const publishedBlogsElement = document.getElementById("publishedBlogs");
const draftBlogsElement = document.getElementById("draftBlogs");

if (totalBlogsElement && publishedBlogsElement && draftBlogsElement) {

    async function updateDashboardStatistics() {

        try {

            const response = await fetch("https://blogspace-4k3y.onrender.com/api/my-blogs", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

            if (!response.ok) {
                throw new Error("Unable to fetch blogs");
            }

            const data = await response.json();

            const totalBlogs = data.blogs.length;

            totalBlogsElement.textContent = totalBlogs;
            publishedBlogsElement.textContent = totalBlogs;
            draftBlogsElement.textContent = 0;

        } catch (error) {

            console.error("Dashboard statistics error:", error);

            totalBlogsElement.textContent = "—";
            publishedBlogsElement.textContent = "—";
            draftBlogsElement.textContent = "—";

        }

    }

    updateDashboardStatistics();

}



// Protect Dashboard Page

// Protect Dashboard Page

const userWelcome = document.getElementById("userWelcome");

if (userWelcome) {

    const token = localStorage.getItem("token");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!token || !loggedInUser) {

        localStorage.clear();
        window.location.href = "login.html";

    } else {

        userWelcome.textContent =
            "Welcome! You are logged in as: " + loggedInUser;

    }

}

// Logout Function

function logoutUser() {

    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    window.location.href = "login.html";

}