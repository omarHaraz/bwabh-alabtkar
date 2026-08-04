export const PaymentService = {
    async processPayment(paymentDetails) {
        return { success: true, transactionId: 'TXN_' + Date.now() };
    }
};
