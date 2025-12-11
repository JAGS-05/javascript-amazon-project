import { cart, calculateCartQuantity } from "../../data/cart.js";
import { products } from '../../data/products.js';
import { formatPrice } from "../utils/money.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";

export function renderPaymentSummary(){
    let productsPriceCents = 0;
    let shippingPriceCents = 0;
    cart.forEach(cartItem => {
        const product = products.find(product => product.id === cartItem.productId);
        productsPriceCents += (product.priceCents * cartItem.quantity);

        let deliveryOption = deliveryOptions.find(option => cartItem.deliveryOptionId === option.id);
        shippingPriceCents += deliveryOption.priceCents;
    });

    let beforeTaxPriceCents = productsPriceCents + shippingPriceCents;
    let afterTaxPriceCents = (beforeTaxPriceCents * 0.1);
    let totalPriceCents = beforeTaxPriceCents + afterTaxPriceCents;
    let cartQuantity = calculateCartQuantity();

    let paymentSummaryHTML = `
    <div class="payment-summary-title">
        Order Summary
        </div>

        <div class="payment-summary-row">
        <div>Items (${cartQuantity}):</div>
        <div class="payment-summary-money">${formatPrice(productsPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">${formatPrice(shippingPriceCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">${formatPrice(beforeTaxPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">${formatPrice(afterTaxPriceCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">${formatPrice(totalPriceCents)}</div>
        </div>

        <button class="place-order-button button-primary">
        Place your order
        </button>
    `;
    document.querySelector('.js-payment-summary')
        .innerHTML = paymentSummaryHTML;

}
