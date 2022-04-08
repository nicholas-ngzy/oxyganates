import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';

const ProductCard = (props) => {
  return (
    <div className='border mb-4 rounded overflow-hidden h-5'>
      <Card key={props.product.id} style={{ height: '500px' }}>
        <Card.Img variant='top' src={props.product.image} height={'300'} />
        <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Card.Title>{props.product.name}</Card.Title>
            <Card.Text>RM {props.product.price.toFixed(2)}</Card.Text>
            <Card.Text>{props.product.description}</Card.Text>
          </div>
          <div>
            <Link to={`/products/${props.product._id}`}>
              <Button>View</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
export default ProductCard;
