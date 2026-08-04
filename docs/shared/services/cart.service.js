export const CartService = {
    getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },
    addToCart(item) {
        const cart = this.getCart();
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
    },
    clearCart() {
        localStorage.removeItem('cart');
    }
};
