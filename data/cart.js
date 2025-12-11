export const cart = [
    { 
        productId : "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity : 1
    },
    {
        productId : "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity : 2
    }
];

let hideTimeouts = {};

export function addToCart(productId){      
    let matchingcartItem = cart.find(cartItem => cartItem.productId === productId);
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

    if(matchingcartItem){
        matchingcartItem.quantity += selectedQuantity;
    }
    else{
        cart.push({
            productId: productId,
            quantity: selectedQuantity
        });
    }
}