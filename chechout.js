document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("checkout-form").addEventListener("submit", submitOrder);
    populateOrderDetails();
});

function submitOrder(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const town = document.getElementById("town").value;
    const zip = document.getElementById("zip").value;
    const recoveryAddress = document.getElementById("recoveryAddress").value;
    const paymentType = document.getElementById("paymentType").value;
    const cardName = document.getElementById("cardName").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    // Validate the inputs (basic validation)
    if (name && email && phone && address && town && zip && paymentType && cardName && expiryDate && cvv) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5); // Assuming delivery takes 5 days

        const formattedDate = deliveryDate.toLocaleDateString("en-US", {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        const orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || [];
        let totalPrice = 0;

        const orderSummary = orderDetails.map(detail => {
            const priceValue = parseFloat(detail.price.replace('$', ''));
            totalPrice += priceValue;

            return `
                <tr>
                    <td>${detail.itemName}</td>
                    <td>${detail.category}</td>
                    <td>${detail.quantity}</td>
                    <td>${detail.price}</td>
                </tr>
            `;
        }).join('');

        const emailParams = {
            name: name,
            email: email,
            phone: phone,
            address: `${address}, ${town}, ${zip}`,
            deliveryDate: formattedDate,
            orderSummary: orderSummary,
            totalPrice: `$${totalPrice.toFixed(2)}`
        };

        console.log('Sending email with the following parameters:', emailParams);

        emailjs.send('service_gfz8pyp', 'template_tyy5rui', emailParams)
            .then(() => {
                alert(`Thank you for your purchase, ${name}! Your order will be delivered to ${address}, ${town}, ${zip} by ${formattedDate}.`);
            }, (error) => {
                console.error('Failed to send email:', error);
                alert('Failed to send order confirmation email. Please try again.');
            });
    } else {
        alert("Please fill in all required fields.");
    }
}

// Function to populate order details on the checkout page
function populateOrderDetails() {
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || [];
    const tableBody = document.querySelector('#checkout-order-table tbody');
    let totalPrice = 0;

    orderDetails.forEach(detail => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${detail.itemName}</td>
            <td>${detail.category}</td>
            <td>${detail.quantity}</td>
            <td>${detail.price}</td>
        `;
        tableBody.appendChild(row);

        // Extract price from the string, remove '$' and convert to number
        const priceValue = parseFloat(detail.price.replace('$', ''));
        totalPrice += priceValue;
    });

    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
}
