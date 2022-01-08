import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import ProductCard from './ProductCard';
import NavMenu from '../NavMenu';
import { useLocation } from 'react-router-dom';

const CatalogCategory = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState();
  const query = new URLSearchParams(useLocation().search);
  const id = query.get('categories');
  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/products?categories=${id}`)
      .then((res) => {
        setProducts(res.data.productList);
        setCategory(res.data.productList[0].category.name);
      })
      .catch((err) => {
        console.log(err);
      });
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
      <NavMenu />
      <div className='h1 py-4'>{category}</div>
      <Container>{rows}</Container>
    </div>
  );
};

export default CatalogCategory;
