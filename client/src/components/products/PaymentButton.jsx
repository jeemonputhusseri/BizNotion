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
    <Button size="sm" className="w-full mt-2" onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Collect Payment'}
    </Button>
  );
};

export default PaymentButton;
