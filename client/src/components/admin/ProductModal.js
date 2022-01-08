import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Option, FloatingLabel, Modal, ModalBody, Table, FormLabel } from 'react-bootstrap';

const ProductModal = (props) => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

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
    const { name, description, price, quantity, category } = form;
    const newErrors = {};
    if (!name || name === '') newErrors.name = 'Required field';
    if (!description || description === '') newErrors.password1 = 'Required field';
    if (!price || price === '') newErrors.email = 'Required field';
    if (!quantity || quantity === '') newErrors.password2 = 'Required field';
    if (!category || category === '') newErrors.phone = 'Required field';
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = findError();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        axios
          .post(`http://localhost:6969/api/v1/products`, form, { headers: { Authorization: `Bearer ${props.token}` } })
          .then((res) => {
            alert(res.data.message);
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

  return <div></div>;
};
export default ProductModal;
