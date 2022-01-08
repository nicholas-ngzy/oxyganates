import react, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, Modal, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavMenu from './NavMenu';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    axios
      .get(`https://localhost:6969/posts`)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <NavMenu />
      <div className='h1 py-4'>Forum</div>
      <Card className='m-4' style={{ textAlign: 'left', display: 'flex', flexDirection: 'row' }}>
        <Card.Body className='h3'>First post</Card.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to={`/posts/61cd4168dd0b93867057928c`}>
            <Button>View</Button>
          </Link>
        </div>
      </Card>
      <Card className='m-4' style={{ textAlign: 'left', display: 'flex', flexDirection: 'row' }}>
        <Card.Body className='h3'>Second post</Card.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to={`/posts/61cd418bdd0b93867057928e`}>
            <Button>View</Button>
          </Link>
        </div>
      </Card>
      <Card className='m-4' style={{ textAlign: 'left', display: 'flex', flexDirection: 'row' }}>
        <Card.Body className='h3'>Third post</Card.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to={`/posts/61cd43224a32d42751708bb4`}>
            <Button>View</Button>
          </Link>
        </div>
      </Card>
      <Button variant='primary' onClick={handleShow}>
        Create post
      </Button>
      <Modal show={show} centered size='lg'>
        <Modal.Body>
          <Form>
            <FormGroup size='lg' className='m-2' controlId='title'>
              <FormLabel>Post title</FormLabel>
              <Form.Control
                autoFocus
                type='text'
                name='title'
                placeholder='Post title'
                // value={form.name}
                // onChange={handleChange}
                // isInvalid={!!errors.name}
              ></Form.Control>
              {/* <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback> */}
            </FormGroup>

            <FormGroup size='lg' className='m-2' controlId='content'>
              <FormLabel>Product content</FormLabel>
              <Form.Control
                as='textarea'
                name='content'
                placeholder='Post content'
                style={{ height: '200px' }}
                // value={form.description}
                // onChange={handleChange}
                // isInvalid={!!errors.description}
              ></Form.Control>
              {/* <Form.Control.Feedback type='invalid'>{errors.description}</Form.Control.Feedback> */}
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary'>Create post</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Forum;
