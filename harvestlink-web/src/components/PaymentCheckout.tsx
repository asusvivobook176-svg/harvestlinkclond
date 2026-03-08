import React, { useState } from 'react';
import { apiFetch } from '../services/api';
import { CreditCard, Loader2, CheckCircle } from 'lucide-react';

interface PaymentCheckoutProps {
    amount: number;
    description: string;
    onSuccess: (paymentId: string) => void;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ amount, description, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Create order on backend
            // Amount in paise for Razorpay (INR * 100)
            const order = await apiFetch('/payment/create-order', {
                method: 'POST',
                body: JSON.stringify({ amount: Math.round(amount * 100) })
            });

            if (!order || !order.id) throw new Error("Order creation failed");

            // 2. Open Razorpay Checkout
            const options = {
                key: (window as any).RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: order.amount,
                currency: order.currency,
                name: 'HarvestLink',
                description: description,
                order_id: order.id,
                handler: async (response: any) => {
                    // 3. Verify payment on backend
                    const verification = await apiFetch('/payment/verify', {
                        method: 'POST',
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    if (verification.status === 'Payment verified') {
                        setSuccess(true);
                        onSuccess(response.razorpay_payment_id);
                    } else {
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: 'Farmer User',
                    email: 'user@example.com'
                },
                theme: {
                    color: '#2563eb'
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment error:", error);
            alert("Could not initialize payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle className="w-12 h-12 text-emerald-500 mb-2" />
                <h3 className="font-bold text-emerald-900">Payment Successful</h3>
                <p className="text-xs text-emerald-700">Thank you for your transaction.</p>
            </div>
        );
    }

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <CreditCard className="w-4 h-4" />
            )}
            Pay {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)}
        </button>
    );
};
