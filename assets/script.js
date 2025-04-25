const products = [
    { id: 1, name: "Chocolate Cake", category: "cakes", price: 250, desc: "Rich and moist chocolate delight", img: "https://source.unsplash.com/300x200/?chocolate-cake" },
    { id: 2, name: "Vanilla Cake", category: "cakes", price: 200, desc: "Soft vanilla sponge", img: "https://source.unsplash.com/300x200/?vanilla-cake" },
    { id: 3, name: "Garlic Bread", category: "breads", price: 80, desc: "Freshly baked garlic bread", img: "https://source.unsplash.com/300x200/?garlic-bread" },
    { id: 4, name: "Multigrain Bread", category: "breads", price: 100, desc: "Healthy and hearty", img: "https://source.unsplash.com/300x200/?bread" },
    { id: 5, name: "Chocolate Chip Cookies", category: "cookies", price: 120, desc: "Crispy and gooey", img: "https://source.unsplash.com/300x200/?cookies" },
    { id: 6, name: "Butter Cookies", category: "cookies", price: 90, desc: "Melt-in-mouth texture", img: "https://source.unsplash.com/300x200/?butter-cookies" },
    { id: 7, name: "Red Velvet Cupcake", category: "cupcakes", price: 60, desc: "Cream cheese topped treat", img: "https://source.unsplash.com/300x200/?cupcake" },
    { id: 8, name: "Strawberry Cupcake", category: "cupcakes", price: 65, desc: "Bursting with berry flavor", img: "https://source.unsplash.com/300x200/?strawberry-cupcake" },
];

let cart = JSON.parse(localStorage.getItem('bakeryCart')) || [];

function renderProducts(filterCategory = "all") {
    const list = document.getElementById("product-list");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const sortValue = document.getElementById("sortSelect").value;
    list.innerHTML = "";

    let filtered = products.filter(item =>
        (filterCategory === "all" || item.category === filterCategory) &&
        item.name.toLowerCase().includes(search)
    );

    if (sortValue === "low") filtered.sort((a, b) => a.price - b.price);
    if (sortValue === "high") filtered.sort((a, b) => b.price - a.price);

    filtered.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4 product-card";
        col.dataset.category = item.category;
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${item.img}" class="card-img-top" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.desc}</p>
                    <p class="card-text"><strong>₹${item.price}</strong></p>
                    <button class="btn btn-primary" onclick="openModal(${item.id})">View</button>
                    <button class="btn btn-success" onclick="addToCartItem(${item.id}, '${item.name}', ${item.price}, '${item.img}')">Add to Cart</button>
                </div>
            </div>
        `;
        list.appendChild(col);
    });
}

function openModal(id) {
    const product = products.find(p => p.id === id);
    document.getElementById("modalImg").src = product.img;
    document.getElementById("modalTitle").innerText = product.name;
    document.getElementById("modalDesc").innerText = product.desc;
    document.getElementById("modalPrice").innerText = product.price;
    new bootstrap.Modal(document.getElementById("productModal")).show();
}

function addToCartItem(id, name, price, imgSrc) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1, imgSrc });
    }
    updateCartUI();
    localStorage.setItem('bakeryCart', JSON.stringify(cart));
    alert(name + " added to cart!");
}

function updateCartUI() {
    const cartContainer = document.getElementById("cart-preview");
    if (!cartContainer) return;
    cartContainer.innerHTML = `<h5>Your Cart</h5>`;
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartContainer.innerHTML += `
            <div class="mb-2 border-bottom pb-2">
                <img src="${item.imgSrc}" style="width:50px; height:50px; object-fit:cover;" class="me-2 rounded">
                <strong>${item.name}</strong> x ${item.quantity}<br/>
                ₹${item.price * item.quantity}
            </div>
        `;
    });

    cartContainer.innerHTML += `
        <hr/>
        <h6>Total: ₹${total}</h6>
        <a href="checkout.html" class="btn btn-sm btn-main w-100 mt-2">Checkout</a>
    `;
}

function loginFake() {
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPass").value;
    if (email && pass) {
        alert("Logged in as: " + email);
        sessionStorage.setItem("user", email);
        window.location.href = "index.html";
    } else {
        alert("Enter valid details.");
    }
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const msg = input.value.trim();
    if (msg) {
        const chatWindow = document.getElementById("chatBox");
        chatWindow.innerHTML += `<div class="text-end mb-2"><span class="bg-primary text-white p-2 rounded">${msg}</span></div>`;
        setTimeout(() => {
            chatWindow.innerHTML += `<div class="text-start mb-2"><span class="bg-light p-2 rounded">Hi! How can I help you with your order?</span></div>`;
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 500);
        input.value = '';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
    renderProducts();
});

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "none";
    }
});

const scrollTopBtn = document.getElementById("scrollTopBtn");
if (scrollTopBtn) {
    window.onscroll = () => {
        scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    };
    scrollTopBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
}

const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeToggle.innerText = document.body.classList.contains("dark-mode")
            ? "☀️ Light"
            : "🌙 Dark";
    });
}

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        renderProducts(btn.dataset.category);
    });
});

document.getElementById("searchInput").addEventListener("input", () => {
    renderProducts();
});

document.getElementById("sortSelect").addEventListener("change", () => {
    renderProducts();
});