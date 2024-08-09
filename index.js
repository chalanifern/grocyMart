const prices = {
    'Apple':600,
    'Banana':480,
    'Orange':1000,
    'Pineapple': 200,
    'WaterMelon': 890,
    'Avacado': 1000,
    'Carrot': 890,
    'Beans':500,
    'brinjal':600,
    'Broccoli':480,
    'Pumpkin':800,
    'Spinach':200,
    'Chicken': 1200,
    'Frozen Fish': 600,
    'Prawns': 580,
    'Beef': 2090,
    'Butter': 1200,
    'Cheese': 600,
    'Cream': 580,
    'Curd': 1090,
    'Yoghurt': 80,
    'Milk': 1800,
    'Baking Powder': 1800,
    'Egg': 500,
    'Sugar': 450,
    'Flour': 550,
    'vanilla': 2000,
    'Yeast': 2500,
};

let totalCartItems = 0;

function addItem(name, category) {
    const quantityInput = document.getElementById(`${name.toLowerCase().replace(' ', '-')}-quantity`);
    const quantity = parseFloat(quantityInput.value);
    if (quantity > 0) {
        const price = prices[name] * quantity;
        const tableBody = document.getElementById('order-table').getElementsByTagName('tbody')[0];
        const rows = tableBody.getElementsByTagName('tr');
        let itemExists = false;
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.cells[0].textContent === name) {
                const existingQuantity = parseFloat(row.cells[2].textContent);
                row.cells[2].textContent = (existingQuantity + quantity).toFixed(1);
                row.cells[3].textContent = (parseFloat(row.cells[3].textContent) + price).toFixed(2);
                itemExists = true;
                break;
            }
        }

        if (!itemExists) {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = name;
            row.insertCell(1).textContent = category;
            row.insertCell(2).textContent = quantity.toFixed(1);
            row.insertCell(3).textContent = price.toFixed(2);
            row.insertCell(4).innerHTML = '<button onclick="removeItem(this)">Remove</button>';
        }
        updateTotalPrice();

         // Increment the cart item count and update the cart logo
         totalCartItems += quantity;
         updateCartLogo();
        alert(`Added ${quantity.toFixed(1)} kg of ${name} to your order.`);
    } else {
        alert(`Please enter a quantity greater than 0 for ${name}.`);
    }
}

function updateCartLogo() {
    const cartLogo = document.querySelector('.cart-logo span');
    cartLogo.textContent = totalCartItems.toFixed(1);
}

function removeItem(button) {
    const row = button.parentNode.parentNode;
    const price = parseFloat(row.cells[3].textContent);
    const quantity = parseFloat(row.cells[2].textContent);
    totalCartItems -= quantity;
    updateCartLogo();
    row.parentNode.removeChild(row);
    updateTotalPrice();
}

// Function to update total price
function updateTotalPrice() {
    let totalPrice = 0;
    const rows = document.querySelectorAll('#order-table tbody tr');
    rows.forEach(row => {
        const price = parseFloat(row.children[3].textContent);
        totalPrice += price;
    });
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
}

function navigateToCheckout() {
    const rows = document.querySelectorAll('#order-table tbody tr');
    const orderDetails = [];
    rows.forEach(row => {
        const itemName = row.children[0].textContent;
        const category = row.children[1].textContent;
        const quantity = row.children[2].textContent;
        const price = row.children[3].textContent;
        orderDetails.push({ itemName, category, quantity, price });
    });
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    window.location.href = './checkout.html'; // Redirect to checkout page
}

function addToFavourites() {
    const tableBody = document.getElementById('order-table').getElementsByTagName('tbody')[0];
    const rows = tableBody.getElementsByTagName('tr');
    let favourites = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const item = row.cells[0].textContent;
        const category = row.cells[1].textContent;
        const quantity = parseInt(row.cells[2].textContent);
        const price = parseFloat(row.cells[3].textContent);
        favourites.push({ item, category, quantity, price });
    }
    localStorage.setItem('favourites', JSON.stringify(favourites));
    alert('Your selected items have been added to favourites!\nYou can Apply your order after order the products! ');
}

function applyFavourites() {
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const tableBody = document.getElementById('order-table').getElementsByTagName('tbody')[0];
    favourites.forEach(fav => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = fav.item;
        row.insertCell(1).textContent = fav.category;
        row.insertCell(2).textContent = fav.quantity;
        row.insertCell(3).textContent = fav.price.toFixed(2);
        row.insertCell(4).innerHTML = '<button onclick="removeItem(this)">Remove</button>';
    });
    alert('Your Choose products added to the Order!....');
    updateTotalPrice();
}

function clearLocalStorage() {
    localStorage.removeItem('favourites');
    alert('Your favourites have been cleared!\nYou can choose products again...');
}
