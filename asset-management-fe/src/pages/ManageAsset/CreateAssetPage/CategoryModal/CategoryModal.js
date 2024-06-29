import React from 'react';
import '../../../../assets/styles/main.css'
import './CategoryModal.css';
import {API_URL} from "../../../../common/constants";
import {Button, Col, Form, Modal, ModalBody, Row} from "react-bootstrap";
import {Formik} from "formik";
import {BsPlusLg} from "react-icons/all";
import axios from "axios";
import Error from "../../../Error/Error";

const CategoryModal = ({show, handleClose, categories}) => {
    const updateCategoryList = (newCategory) => {
        // console.log('newCategory', newCategory)
        console.log('old categories', categories);
        categories.push(newCategory);
        console.log('new categories', categories);
    }

    const handleCreateCategory = (values, {resetForm}) => {
        console.log("Create category ", values)
        axios({
            method: 'POST',
            url: `${API_URL}/categories`,
            data: {
                categoryName: values.categoryName,
                categoryPrefix: values.categoryPrefix
            }
        }).then(res => {
            // console.log("res = ", res);
            updateCategoryList(res.data);
            console.log('create category success.');
        }).catch(err => {
            console.log("err = ", err);
            return <Error message={err.response.data.message}/>
        }).finally(() => {
            resetForm();
            handleClose();
        });
    }

    return (
        <Modal show={show} onHide={handleClose} centered
               backdrop="static"
            // className="modal-display"
            // backdropClassName="drop-display"
        >
            <Modal.Header closeButton className="text-danger">
                <Modal.Title>Add new category</Modal.Title>
            </Modal.Header>
            <ModalBody className="body-content">
                <Formik initialValues={{categoryName: "", categoryPrefix: ""}}
                        validate={values => {
                            const errors = {};
                            if (!values.categoryName) {
                                errors.categoryName = "Required"
                            } else if (categories.find(category => category.categoryName === values.categoryName)) {
                                errors.categoryName = "Category is already existed. Please enter a different category"
                            }

                            if (!values.categoryPrefix) {
                                errors.categoryPrefix = "Required";
                            } else if (values.categoryPrefix.length > 3) {
                                errors.categoryPrefix = "Prefix must not be more than 3 characters";
                            } else if (categories.find(category => category.categoryPrefix === values.categoryPrefix)) {
                                errors.categoryPrefix = "Prefix is already existed. Please enter a different prefix";
                            }
                            return errors;
                        }}
                        onSubmit={handleCreateCategory}>
                    {({
                          values,
                          errors,
                          touched,
                          handleBlur,
                          handleChange,
                          handleSubmit
                      }) => (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    name="categoryName"
                                    className="categoryName"
                                    value={values.categoryName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.categoryName && errors.categoryName}
                                    placeholder="Name of new category"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.categoryName}
                                </Form.Control.Feedback>
                                <Form.Group as={Row} className="mb-3 group-category">
                                    <Col sm="6">
                                        <Form.Control
                                            type="text"
                                            name="categoryPrefix"
                                            placeholder="Prefix of new category"
                                            value={values.categoryPrefix}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.categoryPrefix && errors.categoryPrefix}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.categoryPrefix}
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col sm="6">
                                        <Button type="submit" className="btn btn-addCategory"><BsPlusLg/>Add category
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </Form.Group>
                        </Form>
                    )}
                </Formik>

            </ModalBody>
        </Modal>
    )
        ;
};

export default CategoryModal;