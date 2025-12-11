import { cart, deleteFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption } from "../../data/cart.js";
import { products } from '../../data/products.js';
import { formatPrice } from "../utils/money.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'; //Import external libraries as ES modules using Default import
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary(){ 

    updateCartQuantity();
    
    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const product = products.find(product => product.id === cartItem.productId);
        let deliveryOption = deliveryOptions.find(option => cartItem.deliveryOptionId === option.id);
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${product.id}">
        <div class="delivery-date">
            Delivery date: ${dateString}
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
            ${deliveryOptionsHTML(product, cartItem)}
            </div>
        </div>
    </div>
        `;
    });

    function deliveryOptionsHTML(product,cartItem){
        let html = '';
        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
            const dateString = deliveryDate.format('dddd, MMMM D');
            const priceString = (deliveryOption.priceCents === 0) ? 'FREE' : `${formatPrice(deliveryOption.priceCents)}`;
            const isChecked = (deliveryOption.id === cartItem.deliveryOptionId);
            html += 
            `
            <div class="delivery-option js-delivery-option" data-product-id="${product.id}" data-delivery-option-id="${deliveryOption.id}">
                <input type="radio"
                ${isChecked ? 'checked': ''}
                class="delivery-option-input"
                name="delivery-option-${product.id}">
                <div>
                <div class="delivery-option-date">
                    ${dateString}
                </div>
                <div class="delivery-option-price">
                    ${priceString} - Shipping
                </div>
                </div>
            </div>
            `
        });
        return html;
    }

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
                renderPaymentSummary();
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
                renderOrderSummary();
                renderPaymentSummary();
                updateCartQuantity();
            });
        });

    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const {productId, deliveryOptionId} = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();
                renderPaymentSummary();
            });
        });
}
