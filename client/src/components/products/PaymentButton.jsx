import { useState } from 'react';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/api/axiosInstance';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentButton = ({ product, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Failed to load payment gateway. Check your connection.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post('/api/payments/create-order', {
        productId: product._id,
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'BizNotion',
        description: product.name,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await axiosInstance.post('/api/payments/verify', {
              productId: product._id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            onSuccess(verifyRes.data.product);
          } catch (err) {
            alert(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full mt-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition-colors"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Processing...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          Pay Rs. {product.price.toLocaleString('en-IN')}
        </>
      )}
    </button>
  );
};

export default PaymentButton;
