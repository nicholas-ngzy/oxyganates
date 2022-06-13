import { useState } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function Paypal({ cart, subtotal, user, handleClear }) {
  const [update, setUpdate] = useState([]);
  return (
    <PayPalScriptProvider
      options={{
        'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID,
        currency: 'MYR',
        intent: 'capture',
        components: 'buttons',
      }}
    >
      <PayPalButtons
        onClick={async (data, actions) => {
          for (let i = 0; i < cart.length; i++) {
            let id = cart[i].product.id;
            axios
              .get(`${process.env.REACT_APP_API_URL}/products/${id}`)
              .then((res) => {
                let stock = res.data.quantity;
                let quantity = cart[i].quantity;
                if (quantity > stock) {
                  cart.splice(i, 1);
                  i--;
                } else {
                  let newUpdate = update;
                  newUpdate.push({ id: id, quantity: stock - quantity });
                  setUpdate(newUpdate);
                }
              })
              .catch((err) => console.error(err));
          }
        }}
        createOrder={async (data, actions) => {
          return actions.order
            .create({
              items: [cart],
              purchase_units: [{ amount: { currency: 'MYR', value: (Math.round(subtotal * 100) / 100).toFixed(2) } }],
            })
            .then((orderId) => orderId);
        }}
        onApprove={async (data, actions) => {
          return actions.order.capture().then((details) => {
            alert('Transaction completed');
            for (let i = 0; i < update.length; i++) {
              axios
                .put(`${process.env.REACT_APP_API_URL}/products/${update[i].id}/count`, {
                  quantity: update[i].quantity,
                })
                .then((res) => res)
                .catch((err) => console.log(err));
            }
            axios
              .post(`${process.env.REACT_APP_API_URL}/orders`, {
                user: user,
                items: cart,
                total: (Math.round(subtotal * 100) / 100).toFixed(2),
              })
              .then((res) => res)
              .catch((err) => console.log(err));

            handleClear();
          });
        }}
        onError={async (err) => alert(err)}
      />
    </PayPalScriptProvider>
  );
}
