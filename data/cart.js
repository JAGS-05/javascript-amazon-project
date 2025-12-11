export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

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
            quantity: selectedQuantity,
            deliveryOptionId: '1'
        });
    }
    saveToStorage();
}

export function deleteFromCart(productId){
    let newCart = [];
    cart.forEach((cartItem) => {
        if(cartItem.productId !== productId){
            newCart.push(cartItem)
        }
    });
    cart = newCart;
    saveToStorage();
}

export function calculateCartQuantity(){
    let cartQuantity = 0;
    cart.forEach(item => {
        cartQuantity += item.quantity;
    });
    return cartQuantity;
}

export function updateQuantity(productId, newQuantity){
    let cartItem = cart.find(item => item.productId === productId);
    cartItem.quantity = newQuantity;
    saveToStorage();
}