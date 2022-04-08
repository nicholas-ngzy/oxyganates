import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, FormGroup, FormLabel, Modal, ModalBody, Table, FloatingLabel } from 'react-bootstrap';
import ProductModal from '../components/ProductModal';
import jwt_decode from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Stack, Button, Alert, AlertTitle } from '@mui/material';
import NotFound from './NotFound';

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  // const [categories, setCategories] = useState([]);
  // const [modalState, setModalState] = useState('close');
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token'));
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  const [selection, setSelection] = useState([]);

  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    {
      field: 'name',
      headerName: 'Product name',
      editable: true,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Product description',
      flex: 2.5,
      editable: true,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.5,
      valueGetter: (params) => {
        return params.value.name;
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      editable: true,
      flex: 0.5,
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value).toFixed(2);
        return valueFormatted;
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      flex: 0.5,
    },
  ];

  useEffect(() => {
    axios
      .get('http://localhost:6969/api/v1/products')
      .then((res) => {
        setProducts(res.data.productList);
      })
      .catch((err) => {
        console.log(err);
      });
    // return () => setProducts(null);
  }, []);

  // const categoryList = () => {
  //   axios
  //     .get('http://localhost:6969/api/v1/categories')
  //     .then((res) => {
  //       setCategories(res.data.categoryList);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   if (categories) {
  //     categories.map((category) => {
  //       return <option key={category._id}>{category.name}</option>;
  //     });
  //   } else {
  //     console.log('Error');
  //   }
  // };
  // const handleShowModalOne = () => {
  //   setModalState('modal-one');
  //   setForm();
  // };

  // const handleShowModalTwo = () => {
  //   setModalState('modal-two');
  //   setForm(['']);
  // };

  // const handleClose = () => {
  //   setModalState('close');
  // };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const findError = () => {
    const { name, description, price, quantity } = form;
    const newErrors = {};
    if (!name || name === '') newErrors.name = 'Required field';
    if (!description || description === '') newErrors.description = 'Required field';
    if (!price || price === '') newErrors.price = 'Required field';
    if (!quantity || quantity === '') newErrors.quantity = 'Required field';
    return newErrors;
  };

  const handleSubmit = () => {
    const json = JSON.stringify(form);
    console.log(form);
    console.log(json);
    const newErrors = findError();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        axios
          .post(`http://localhost:6969/api/v1/products`, json, config)
          .then((res) => {
            console.log('Success');
            // alert(res.data.message);
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  const handleUpdateRow = (id) => {
    axios
      .put(`http://localhost:6969/api/v1/products/${id}`, form, config)
      .then((res) => {
        alert(res.data.message);
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteRow = () => {
    axios
      .all(selection.map((selection) => axios.delete(`http://localhost:6969/api/v1/products/${selection}`, config)))
      .then((res) => {
        alert(res[0].data.message);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let decoded = '';
  if (localStorage.getItem('token')) {
    decoded = jwt_decode(localStorage.getItem('token'));
  }
  if (decoded.isAdmin) {
    return (
      <div>
        <div className='mx-2'>
          <div className='h1 py-4'>Products</div>
          <div style={{ height: '80vh', width: '90%', margin: '1px auto' }}>
            <Stack sx={{ width: '100%', mb: 1 }} direction='row' alignItems='center' columnGap={1}>
              <Button size='large' variant='outlined' onClick={handleDeleteRow}>
                Delete product
              </Button>
              <Button size='large' variant='outlined' onClick={handleShow}>
                Add product
              </Button>
            </Stack>
            <DataGrid
              autoHeight
              rows={products}
              columns={columns}
              pageSize={25}
              getRowId={(row) => row._id}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(ids) => {
                setSelection(ids);
                console.log(selection);
              }}
            ></DataGrid>
          </div>

          {/* <Table striped bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>RM {product.price.toFixed(2)}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <Button onClick={() => handleShowModalOne()}>More</Button>
                        <Modal show={modalState === 'modal-one'} onHide={handleClose} centered size='lg'>
                          <Modal.Header>
                            <Modal.Title>{product._id}</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form key={product._id}>
                              <FormGroup controlId='name'>
                                <Form.Control
                                  type='text'
                                  name='name'
                                  placeholder='Product name'
                                  defaultValue={product.name}
                                  value={form.name}
                                  onChange={handleChange}
                                ></Form.Control>
                                <Form.Control.Feedback></Form.Control.Feedback>
                              </FormGroup>{' '}
                              <FormGroup controlId='name'>
                                <Form.Control
                                  type='text'
                                  name='name'
                                  placeholder='Product name'
                                  defaultValue={product.name}
                                  value={form.name}
                                  onChange={handleChange}
                                ></Form.Control>
                                <Form.Control.Feedback></Form.Control.Feedback>
                              </FormGroup>{' '}
                              <FormGroup controlId='name'>
                                <Form.Control
                                  type='text'
                                  name='name'
                                  placeholder='Product name'
                                  defaultValue={product.name}
                                  value={form.name}
                                  onChange={handleChange}
                                ></Form.Control>
                                <Form.Control.Feedback></Form.Control.Feedback>
                              </FormGroup>
                              <FormGroup controlId='name'>
                                <Form.Control
                                  type='text'
                                  name='name'
                                  placeholder='Product name'
                                  defaultValue={product.name}
                                  value={form.name}
                                  onChange={handleChange}
                                ></Form.Control>
                                <Form.Control.Feedback></Form.Control.Feedback>
                              </FormGroup>{' '}
                              <FormGroup controlId='name'>
                                <Form.Control
                                  type='text'
                                  name='name'
                                  placeholder='Product name'
                                  defaultValue={product.name}
                                  value={form.name}
                                  onChange={handleChange}
                                ></Form.Control>
                                <Form.Control.Feedback></Form.Control.Feedback>
                              </FormGroup>
                            </Form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant='secondary' onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant='primary' onClick={() => handleUpdate(product._id)}>
                              Save Changes
                            </Button>
                            <Button variant='danger' onClick={() => handleDelete(product._id)}>
                              Delete product
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table> */}
          {/* <Button variant='primary' onClick={() => handleShowModalTwo()}>
              Add product
            </Button> */}
          <Modal show={show} centered size='lg'>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <FormGroup size='lg' className='m-2' controlId='name'>
                  <FormLabel>Product name</FormLabel>
                  <Form.Control
                    autoFocus
                    type='text'
                    name='name'
                    placeholder='Product name'
                    value={form.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
                </FormGroup>

                <FormGroup size='lg' className='m-2' controlId='description'>
                  <FormLabel>Product description</FormLabel>
                  <Form.Control
                    type='text'
                    name='description'
                    placeholder='Product description'
                    value={form.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>{errors.description}</Form.Control.Feedback>
                </FormGroup>

                <FormGroup size='lg' className='m-2' controlId='price'>
                  <FormLabel>Product price</FormLabel>
                  <Form.Control
                    type='double'
                    name='price'
                    placeholder='Product price'
                    min={0.01}
                    value={form.price}
                    onChange={handleChange}
                    isInvalid={!!errors.price}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>{errors.price}</Form.Control.Feedback>
                </FormGroup>

                <FormGroup size='lg' className='m-2' controlId='quantity'>
                  <FormLabel>Product quantity</FormLabel>
                  <Form.Control
                    type='number'
                    name='quantity'
                    min={1}
                    placeholder='Product quantity'
                    value={form.quantity}
                    onChange={handleChange}
                    isInvalid={!!errors.quantity}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>{errors.quantity}</Form.Control.Feedback>
                </FormGroup>

                <FormGroup size='lg' className='m-2' controlId='category'>
                  <FormLabel>Product category</FormLabel>
                  <Form.Control as='select' name='category' onChange={handleChange}>
                    <option value={'61c42a40e21866d19b031296'}>Seeds</option>
                    <option value={'61c42a7ae21866d19b031297'}>Fertilizers</option>
                    <option value={'61c42a91e21866d19b031298'}>Kits</option>
                  </Form.Control>
                </FormGroup>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={handleClose}>
                Close
              </Button>
              <Button variant='primary' onClick={() => handleSubmit()}>
                Add product
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  } else {
    return <NotFound />;
  }
};

export default ProductDashboard;
