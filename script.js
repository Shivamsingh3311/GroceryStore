
const products = [
    {
        id: 1, name: "Fresh Apples", category: "Fruits",
        price: 140, unit: "1 kg", tag: "Popular",
        description: "Sweet and crunchy",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2, name: "Bananas", category: "Fruits",
        price: 60, unit: "1 dozen", tag: "Best value",
        description: "Naturally sweet",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3, name: "Fresh Strawberries", category: "Fruits",
        price: 180, unit: "250 g", tag: "Fresh",
        description: "Juicy and delicious",
        image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4, name: "Broccoli", category: "Vegetables",
        price: 55, unit: "1 piece", tag: "Healthy",
        description: "Green and nutritious",
        image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5, name: "Fresh Carrots", category: "Vegetables",
        price: 40, unit: "500 g", tag: "Fresh",
        description: "Crisp farm produce",
        image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6, name: "Tomatoes", category: "Vegetables",
        price: 35, unit: "500 g", tag: "Popular",
        description: "Perfect for every meal",
        image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7, name: "Fresh Milk", category: "Dairy",
        price: 32, unit: "500 ml", tag: "Daily essential",
        description: "Everyday goodness",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8, name: "Cheese", category: "Dairy",
        price: 120, unit: "200 g", tag: "Tasty",
        description: "Rich and creamy",
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 9, name: "Fresh Bread", category: "Bakery",
        price: 45, unit: "1 loaf", tag: "Fresh",
        description: "Soft and fluffy",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 10, name: "Croissants", category: "Bakery",
        price: 90, unit: "2 pieces", tag: "Treat",
        description: "Golden and buttery",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 11, name: "Almonds", category: "Snacks",
        price: 160, unit: "200 g", tag: "Healthy",
        description: "A crunchy little snack",
        image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 12, name: "Cookies", category: "Snacks",
        price: 75, unit: "1 pack", tag: "Popular",
        description: "A sweet little treat",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=80"
    }
];

// Store data
let cart = [];
let activeCategory = "All";
let searchTerm = "";

// Delivery is free on orders of ₹499 or more.
const DELIVERY_FEE = 40;
const FREE_DELIVERY_LIMIT = 499;

const productsGrid = document.getElementById("productsGrid");
const productTotal = document.getElementById("productTotal");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");

const money = amount =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Display products and apply search/category filters
function renderProducts() {
    const filtered = products.filter(product => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const searchableText =
            `${product.name} ${product.category} ${product.description}`.toLowerCase();

        return matchesCategory && searchableText.includes(searchTerm);
    });

    productTotal.textContent =
        `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`;

    if (filtered.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-products">
                <div style="font-size:42px">🔎</div>
                <h3>No groceries found</h3>
                <p>Try a different search or category.</p>
            </div>`;
        return;
    }

    productsGrid.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img src="${escapeHTML(product.image)}"
                     alt="${escapeHTML(product.name)}"
                     loading="lazy">
                <span class="product-tag">${escapeHTML(product.tag)}</span>
            </div>
            <div class="product-info">
                <span class="product-category">${escapeHTML(product.category)}</span>
                <h3>${escapeHTML(product.name)}</h3>
                <p class="product-description">${escapeHTML(product.description)}</p>
                <div class="product-bottom">
                    <div class="product-price">
                        ${money(product.price)}
                        <small>/ ${escapeHTML(product.unit)}</small>
                    </div>
                    <button class="add-button" data-add="${product.id}">
                        + Add
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// Add a product to the cart
function addToCart(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    showToast(`${product.name} added to cart!`);
}

// Change product quantity
function changeQuantity(id, change) {
    const item = cart.find(product => product.id === id);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    renderCart();
}

// Remove an item
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
    showToast("Item removed from cart.");
}

// Calculate totals
function getTotals() {
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_LIMIT
        ? 0
        : DELIVERY_FEE;

    return {
        subtotal,
        delivery,
        total: subtotal + delivery
    };
}

// Update cart display
function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totals = getTotals();

    cartCount.textContent = count;
    document.getElementById("subtotal").textContent = money(totals.subtotal);
    document.getElementById("delivery").textContent = money(totals.delivery);
    document.getElementById("grandTotal").textContent = money(totals.total);
    document.getElementById("checkoutTotal").textContent = money(totals.total);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span>🛒</span>
                <h3>Your cart is empty</h3>
                <p>Add some fresh groceries to get started.</p>
            </div>`;
        document.getElementById("deliveryNote").textContent =
            "Add items to get started.";
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${escapeHTML(item.image)}"
                     alt="${escapeHTML(item.name)}">
                <div>
                    <h3>${escapeHTML(item.name)}</h3>
                    <p>${money(item.price * item.quantity)}</p>
                    <div class="quantity-control">
                        <button data-quantity="${item.id}" data-change="-1"
                                aria-label="Decrease quantity">−</button>
                        <span>${item.quantity}</span>
                        <button data-quantity="${item.id}" data-change="1"
                                aria-label="Increase quantity">+</button>
                    </div>
                    <button class="remove-button" data-remove="${item.id}">
                        Remove
                    </button>
                </div>
                <span style="font-size:11px;color:#758176">
                    ${escapeHTML(item.unit)}
                </span>
            </div>
        `).join("");

        const remaining = FREE_DELIVERY_LIMIT - totals.subtotal;

        document.getElementById("deliveryNote").textContent =
            remaining > 0
                ? `Add ${money(remaining)} more for free delivery!`
                : "🎉 Congratulations! You get free delivery.";
    }

    document.getElementById("checkoutButton").disabled = cart.length === 0;
}

// Open and close the cart
function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
}

// Small notification
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

// Product add buttons
productsGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(Number(button.dataset.add));
});

// Quantity and remove buttons
cartItems.addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
        changeQuantity(
            Number(quantityButton.dataset.quantity),
            Number(quantityButton.dataset.change)
        );
    }

    if (removeButton) {
        removeFromCart(Number(removeButton.dataset.remove));
    }
});

// Search
document.getElementById("searchInput").addEventListener("input", event => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderProducts();
});

// Category filters
document.getElementById("categoryButtons").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    activeCategory = button.dataset.category;

    document.querySelectorAll(".category").forEach(categoryButton => {
        categoryButton.classList.toggle("active", categoryButton === button);
    });

    renderProducts();
});

// Cart events
document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Escape key closes the cart
document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCart();
});

// Checkout
const checkoutDialog = document.getElementById("checkoutDialog");

document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Please add items to your cart first.");
        return;
    }

    closeCart();
    checkoutDialog.showModal();
});

document.getElementById("closeCheckout").addEventListener("click", () => {
    checkoutDialog.close();
});

checkoutDialog.addEventListener("click", event => {
    if (event.target === checkoutDialog) checkoutDialog.close();
});

document.getElementById("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        checkoutDialog.close();
        showToast("Your cart is empty.");
        return;
    }

    const formData = new FormData(event.currentTarget);
    const customerName = formData.get("customerName").trim();
    const totals = getTotals();

    // This is a front-end demonstration, not a real order.
    const orderNumber = "FM" + Date.now().toString().slice(-8);

    checkoutDialog.close();
    event.currentTarget.reset();

    alert(
        `Thank you, ${customerName}!\n\n` +
        `Demo order: ${orderNumber}\n` +
        `Order total: ${money(totals.total)}\n\n` +
        `This is a demonstration only. No real order was submitted.`
    );

    cart = [];
    renderCart();
});

// Newsletter demonstration
document.getElementById("newsletterForm").addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("newsletterEmail").value.trim();

    if (!email) return;

    event.currentTarget.reset();
    showToast("Thanks for your interest in FreshMart!");
});

// Current year
document.getElementById("year").textContent = new Date().getFullYear();

// Initial rendering
renderProducts();
renderCart();
