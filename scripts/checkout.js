import { cart, deleteFromCart, calculateCartQuantity, updateQuantity } from "../data/cart.js";
import {products} from '../data/products.js';
import { formatPrice } from "./utils/money.js";

updateCartQuantity();

let cartSummaryHTML = '';

cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const product = products.find(product => product.id === productId);
    cartSummaryHTML += `
<div class="cart-item-container js-cart-item-container-${product.id}">
    <div class="delivery-date">
        Delivery date: Tuesday, June 21
    </div>

    <div class="cart-item-details-grid">
        <img class="product-image"
        src="${product.image}">

        <div class="cart-item-details">
        <div class="product-name">
            ${product.name}
        </div>
        <div class="product-price">
            ${formatPrice(product.priceCents)}
        </div>
        <div class="product-quantity">
            <span>
                Quantity: <span class="quantity-label js-quantity-label-${product.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${product.id}">
                Update
            </span>
            <input type="number" class="quantity-input js-quantity-input" min="1" max="1000" value="${cartItem.quantity}">
            <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${product.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${product.id}">
                Delete
            </span>
        </div>
        </div>

        <div class="delivery-options">
        <div class="delivery-options-title">
            Choose a delivery option:
        </div>
        <div class="delivery-option">
            <input type="radio" checked
            class="delivery-option-input"
            name="delivery-option-${product.id}">
            <div>
            <div class="delivery-option-date">
                Tuesday, June 21
            </div>
            <div class="delivery-option-price">
                FREE Shipping
            </div>
            </div>
        </div>
        <div class="delivery-option">
            <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${product.id}">
            <div>
            <div class="delivery-option-date">
                Wednesday, June 15
            </div>
            <div class="delivery-option-price">
                $4.99 - Shipping
            </div>
            </div>
        </div>
        <div class="delivery-option">
            <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${product.id}">
            <div>
            <div class="delivery-option-date">
                Monday, June 13
            </div>
            <div class="delivery-option-price">
                $9.99 - Shipping
            </div>
            </div>
        </div>
        </div>
    </div>
</div>
    `;
});

document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

function updateCartQuantity(){
    let cartQuantity = calculateCartQuantity();
    document.querySelector('.js-return-to-home-link')
        .innerHTML = (cartQuantity !== 0 ) ? `${cartQuantity} items` : ''; 
}

document.querySelectorAll('.js-delete-quantity-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            deleteFromCart(productId);
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();
            updateCartQuantity();
        });
    });

document.querySelectorAll('.js-update-quantity-link')
    .forEach((link) => {
        link.addEventListener('click', () =>{
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add('is-editing-quantity');
            container.querySelector('.js-update-quantity-link').style.display = 'none';
        });
    });

document.querySelectorAll('.js-save-quantity-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            const newQuantity = Number(container.querySelector('.js-quantity-input').value);
            container.classList.remove('is-editing-quantity');
            container.querySelector('.js-update-quantity-link').style.display = 'initial';
            //Update displayed quantity labels
            document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
            updateQuantity(productId, newQuantity);
            updateCartQuantity();
        });
    });


