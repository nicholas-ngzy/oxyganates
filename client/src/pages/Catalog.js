import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const Catalog = () => {
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
    return () => {
      setProducts(null);
    };
  }, []);

  const chunk = (arr, chunkSize = 1, cache = []) => {
    const tmp = [...arr];
    if (chunkSize <= 0) return cache;
    while (tmp.length) cache.push(tmp.splice(0, chunkSize));
    return cache;
  };
  const productsChunks = chunk(products, 3);
  const rows = productsChunks.map((productChunk, index) => {
    const productsCols = productChunk.map((product, index) => {
      return (
        <Col xs='4' key={product.id}>
          <ProductCard product={product} />
        </Col>
      );
    });
    return <Row key={index}>{productsCols}</Row>;
  });

  return (
    <div>
      <div className='h1 py-4 text-center'>All Products</div>
      <Container>{rows}</Container>
    </div>
  );
};

export default Catalog;
