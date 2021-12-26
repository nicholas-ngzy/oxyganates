import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavMenu from '../NavMenu';
import { Table } from 'react-bootstrap';

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:6969/api/v1/products')
      .then((res) => {
        setProducts(res.data.productList);
        console.log(products);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <NavMenu />
      <div className='mx-2'>
        <h1>Product</h1>
        <Table maxwidth={'70%'} striped bordered>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ProductDashboard;
