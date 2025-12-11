export const cart = [];

let hideTimeouts = {};

export function addToCart(productId){      
    let matchingItem = cart.find(item => item.productId === productId);
    const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
    const selectedQuantity = Number(quantitySelector.value);

    const addedToCartMessage = document.querySelector(`.js-added-to-cart-${productId}`);
    addedToCartMessage.classList.add('added-to-cart-visible');

    // Clear previous timeout for THIS product only
    if (hideTimeouts[productId]) {
        clearTimeout(hideTimeouts[productId]);
    }

    // Create a new timeout for THIS product
    hideTimeouts[productId] = setTimeout(() => {
        addedToCartMessage.classList.remove('added-to-cart-visible');
        hideTimeouts[productId] = null;
    }, 2000);      

    if(matchingItem){
        matchingItem.quantity += selectedQuantity;
    }
    else{
        cart.push({
            productId: productId,
            quantity: selectedQuantity
        });
    }
}