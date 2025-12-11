export function formatPrice(amountInCents){
    return `$${(amountInCents/100).toFixed(2)}`; 
}