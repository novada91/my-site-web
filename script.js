let cart = [];

const buttons = document.querySelectorAll(".add-cart");
const cartItems = document.getElementById("cart-items");
const cartTotalDisplay = document.getElementById("cart-total");
const cartCountDisplay = document.getElementById("cart-count");

buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        const product = button.closest(".product");

        const name = product.querySelector("h3").textContent;

        const price = parseInt(
            product.querySelector("p").textContent.replace(/\D/g, "")
        );

        const existingProduct = cart.find(function(item) {
            return item.name === name;
        });

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        displayCart();
    });
});


function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let itemCount = 0;

    cart.forEach(function(item, index) {

        total += item.price * item.quantity;
        itemCount += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.innerHTML = `
            <p>
                <strong>${item.name}</strong>
                - ${(item.price * item.quantity).toLocaleString()} KES
            </p>

            <button onclick="decreaseQuantity(${index})">−</button>

            <strong>${item.quantity}</strong>

            <button onclick="increaseQuantity(${index})">+</button>

            <button onclick="removeItem(${index})">🗑️</button>

            <hr>
        `;

        cartItems.appendChild(cartItem);
    });

    cartTotalDisplay.textContent = total.toLocaleString();
    cartCountDisplay.textContent = itemCount;
}


function increaseQuantity(index) {

    cart[index].quantity++;

    displayCart();
}


function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }

    displayCart();
}


function removeItem(index) {

    cart.splice(index, 1);

    displayCart();
}

const checkoutButton = document.getElementById("checkout-btn");

checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "Hello NOVA SHOES! 👟%0A%0A";
    message += "I would like to order:%0A";

    cart.forEach(function(item) {
        message +=
            "- " + item.name +
            " x" + item.quantity +
            " = " +
            (item.price * item.quantity).toLocaleString() +
            " KES%0A";
    });

    let total = 0;

    cart.forEach(function(item) {
        total += item.price * item.quantity;
    });

    message += "%0ATotal: " + total.toLocaleString() + " KES";
    message += "%0A%0AThank you!";

    const phoneNumber = "254724842660";

    window.open(
        "https://wa.me/" + phoneNumber + "?text=" + message,
        "_blank"
    );
});

const shareButton = document.getElementById("share-btn");
const copyLinkButton = document.getElementById("copy-link-btn");
const shareStatus = document.getElementById("share-status");

shareButton.addEventListener("click", async function() {
    const shareData = {
        title: "NOVA SHOES",
        text: "Discover the latest shoes at NOVA SHOES.",
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            shareStatus.textContent = "Site shared!";
            return;
        }

        await copySiteLink();
    } catch (error) {
        if (error.name !== "AbortError") {
            shareStatus.textContent = "Unable to share the site.";
        }
    }
});

copyLinkButton.addEventListener("click", copySiteLink);

async function copySiteLink() {
    const siteLink = window.location.href;

    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(siteLink);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = siteLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            textArea.remove();
        }

        shareStatus.textContent = "Site link copied!";
    } catch (error) {
        shareStatus.textContent = "Unable to copy the site link.";
    }
}