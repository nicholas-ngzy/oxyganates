import React from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function Paypal({ cart, subtotal, user, handleClear }) {
  return (
    <PayPalScriptProvider
      options={{
        'client-id': 'AdjpJeCU_0NVbn2r2ackLQzk3qiOhWME3CjplIhvhE8ntzZ3LClXB5O1UVE8U9NCf4JOKwxKoQt5vc7F',
        currency: 'MYR',
        intent: 'capture',
        components: 'buttons',
      }}
    >
      <PayPalButtons
        createOrder={async (data, actions) => {
          return actions.order
            .create({
              items: [cart],
              purchase_units: [
                {
                  amount: {
                    currency: 'MYR',
                    value: (Math.round(subtotal * 100) / 100).toFixed(2),
                  },
                },
              ],
            })
            .then((orderId) => {
              return orderId;
            });
        }}
        onApprove={async (data, actions) => {
          return actions.order.capture().then((details) => {
            alert('Transaction completed by ' + details.payer.name.given_name);
            console.log(details);
            axios
              .post(
                `http://localhost:6969/api/v1/orders`,
                {
                  user: user,
                  items: cart,
                  total: (Math.round(subtotal * 100) / 100).toFixed(2),
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                  },
                }
              )
              .then((res) => {
                console.log(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
            handleClear();
          });
        }}
        onError={async (err) => {
          alert(err);
        }}
      />
    </PayPalScriptProvider>
  );
}
