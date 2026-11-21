
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

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        const registeredUser = JSON.parse(
            localStorage.getItem("registeredUser")
        );

        if (!registeredUser) {

            message.textContent = "Please register your account first!";
            message.style.color = "red";

        }

        else if (
            email === registeredUser.email &&
            password === registeredUser.password
        ) {

            localStorage.setItem("loggedInUser", email);

            message.textContent = "Login successful!";
            message.style.color = "green";

            setTimeout(function() {
                window.location.href = "dashboard.html";
            }, 1000);

        }

        else {

            message.textContent = "Invalid email or password!";
            message.style.color = "red";

        }

    });

}



// ===============================
// REGISTRATION FORM
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("regName").value;

        const email = document.getElementById("regEmail").value;

        const password = document.getElementById("regPassword").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("registerMessage");

        if (password.length < 6) {

            message.textContent = "Password must contain at least 6 characters!";

            message.style.color = "red";

        }

        else if (password !== confirmPassword) {

            message.textContent = "Error: Passwords do not match!";

            message.style.color = "red";

        }

        else {

            // Save registered user details

            const user = {
                name: name,
                email: email,
                password: password
            };

            localStorage.setItem("registeredUser", JSON.stringify(user));

            message.textContent = "Account created successfully!";

            message.style.color = "green";

        }

    });

}

// Create Blog Functionality

const createBlogForm = document.getElementById("createBlogForm");

if (createBlogForm) {
    createBlogForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("blogTitle").value;
        const category = document.getElementById("blogCategory").value;
        const content = document.getElementById("blogContent").value;
        const blogMessage = document.getElementById("blogMessage");

        if (title.trim() === "" || category === "" || content.trim() === "") {
            blogMessage.textContent = "Please fill in all fields.";
            blogMessage.style.color = "red";
            return;
        }

        blogMessage.textContent = "Your blog has been published successfully!";
        blogMessage.style.color = "green";

        console.log("Blog Title:", title);
        console.log("Category:", category);
        console.log("Blog Content:", content);
        // Save blog in Local Storage

let blogs = JSON.parse(localStorage.getItem("blogs")) || [];

const newBlog = {
    title: title,
    category: category,
    content: content,
    date: new Date().toLocaleDateString()
};

blogs.push(newBlog);

localStorage.setItem("blogs", JSON.stringify(blogs));

        createBlogForm.reset();
    });
}



// Display Saved Blogs on Homepage

const savedBlogsContainer = document.getElementById("savedBlogs");

if (savedBlogsContainer) {

    const savedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];

    savedBlogsContainer.innerHTML = "";

    savedBlogs.forEach(function(blog, index) {

        const blogCard = document.createElement("div");
        blogCard.className = "blog-card";

        blogCard.innerHTML = `
            <div class="blog-info">
                <span>${blog.category}</span>
                <h3>${blog.title}</h3>
                <p>${blog.content}</p>
                <small>Published on: ${blog.date}</small>

                <button class="edit-blog-btn" data-index="${index}">
                    Edit Blog
                </button>

                <button class="delete-blog-btn" data-index="${index}">
                    Delete Blog
                </button>
            </div>
        `;

        savedBlogsContainer.appendChild(blogCard);

    });

    
savedBlogsContainer.addEventListener("click", function(event) {

    const index = Number(event.target.dataset.index);

    // Edit Blog
    if (event.target.classList.contains("edit-blog-btn")) {

        let blogs = JSON.parse(localStorage.getItem("blogs")) || [];

        const blog = blogs[index];

        const newTitle = prompt("Enter new blog title:", blog.title);

        if (newTitle === null || newTitle.trim() === "") {
            return;
        }

        const newContent = prompt("Enter new blog content:", blog.content);

        if (newContent === null || newContent.trim() === "") {
            return;
        }

        blog.title = newTitle.trim();
        blog.content = newContent.trim();

        blogs[index] = blog;

        localStorage.setItem("blogs", JSON.stringify(blogs));

        location.reload();
    }

    // Delete Blog
    const confirmDelete = confirm("Are you sure you want to delete this blog?");

    if (confirmDelete) {

        blogs.splice(index, 1);

        localStorage.setItem("blogs", JSON.stringify(blogs));

        location.reload();

}

});

}






// Dynamic Dashboard Statistics

const totalBlogsElement = document.getElementById("totalBlogs");
const publishedBlogsElement = document.getElementById("publishedBlogs");
const draftBlogsElement = document.getElementById("draftBlogs");

if (totalBlogsElement && publishedBlogsElement && draftBlogsElement) {

    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

    totalBlogsElement.textContent = blogs.length;

    // All blogs created so far are published
    publishedBlogsElement.textContent = blogs.length;

    // Draft functionality will be added later
    draftBlogsElement.textContent = 0;
}



// Protect Dashboard Page

const userWelcome = document.getElementById("userWelcome");

if (userWelcome) {

    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        window.location.href = "login.html";

    } else {

        userWelcome.textContent =
            "Welcome! You are logged in as: " + loggedInUser;

    }
}
