import './CreateAssetPage.css'
import React, {useState} from "react";
import {Button, Col, Dropdown, Form, Row} from "react-bootstrap";
import {ErrorMessage, Formik} from "formik";
import {useHistory} from "react-router-dom";
import * as Yup from 'yup';
import {BsFillCalendarDateFill, VscTriangleDown} from "react-icons/all";
import CategoryModal from "./CategoryModal/CategoryModal";
import axios from "axios";
import {API_URL, DATE_FORMAT} from "../../../common/constants";
import Error from "../../Error/Error";
import DatePicker from "react-datepicker";
import useFetch from "../../../hooks/useFetch";


const validateForm = Yup.object().shape({
    assetName: Yup.string().required("Required!"),
    categoryName: Yup.string().required("Required!"),
    specification: Yup.string().required("Required!"),
    installedDate: Yup.date().max(new Date(), "Installed Date is not future day. Please select a different date")
        .required("Invalid date. Please select a different date").nullable()
});

const convertDataResponse = res => res.data;

const CreateAssetPage = () => {
    let history = useHistory();

    const {
        data: categories,
    } = useFetch([], `${API_URL}/categories`, convertDataResponse);
    const handleRedirectAssetManagePage = () => {
        history.push("/asset")
    }

    const [show, setShow] = useState(false);
    const handleClickCategoryPopup = () => setShow(true);
    const handleClose = () => setShow(false);
    const [dropValue, setDropValue] = useState(" ")
    // const [category, setCategory] = useState({});
    // console.log("before send data ", category)
    // const handlePassingData = (cate) => setCategory(cate);
    // console.log("after send data = ", category)

    const initialValues = {
        assetName: "",
        categoryName: dropValue,
        specification: "",
        installedDate: "",
        state: "Available"
    }

    const submit = (values, {resetForm}) => {
        console.log("value on submit =", values);
        axios({
            method: 'POST',
            url: `${API_URL}/assets/`,
            data: {
                assetName: values.assetName,
                categoryName: dropValue,
                specification: values.specification,
                installedDate: values.installedDate,
                state: values.state
            }
        }).then(res => {
            console.log("res = ", res);
            console.log('create asset success.');
            history.push("/asset", {firstId: res.data.id});
        }).catch(err => {
            console.log("err = ", err);
            return <Error message={err.response.data.message}/>
        }).finally(
            resetForm()
        );
    }

    return (
        <div className="app-page">
            <div className="row">
                <div className="col-lg-2"/>
                <div className="col-lg-8">
                    <div className="app-content__title">Create New Asset</div>
                    <Formik
                        enableReinitialize={false}
                        initialValues={initialValues}
                        validationSchema={validateForm}
                        onSubmit={submit}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleBlur,
                              handleChange,
                              setFieldValue,
                              handleSubmit
                          }) => (
                            <>
                                <Form onSubmit={handleSubmit}>
                                    {/*Asset name*/}
                                    <Form.Group as={Row} className="mb-3" controlId="formTextFirstName">
                                        <Form.Label column sm="3">Name</Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                type="text"
                                                name="assetName"
                                                value={values.assetName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.assetName && errors.assetName}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.assetName}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3" controlId="formSelectCategory">
                                        <Form.Label column sm="3">Category</Form.Label>
                                        <Col sm="6">
                                            <Dropdown
                                                name="categoryName"
                                                value={values.categoryName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                onSelect={(eventKey, evt) => {
                                                    if (evt.target.textContent === 'Create new category') {
                                                        handleClickCategoryPopup();
                                                    } else {
                                                        setDropValue(evt.target.textContent);
                                                    }
                                                }}
                                                // autoClose={false}
                                                className="drop-category"
                                            >
                                                <Dropdown.Toggle
                                                    id="dropdown-autoclose-false" className="form-control drop-category"
                                                >
                                                    {/*{dropValue}*/}
                                                    <div className="drop-box">
                                                        <span className="drop-title">{dropValue}</span>
                                                        <VscTriangleDown/>
                                                    </div>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="form-control menu-control">
                                                    {categories.map(cate =>
                                                        <Dropdown.Item key={cate.id}>{cate.categoryName}</Dropdown.Item>
                                                    )}
                                                    <Dropdown.Item>Create new category</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.category}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    {/*Specification*/}
                                    <Form.Group as={Row} className="mb-3" controlId="exampleFormControlTextarea">
                                        <Form.Label column sm="3">Specification</Form.Label>
                                        <Col sm="6">
                                            <Form.Control rows={4}
                                                          as="textarea"
                                                          name="specification"
                                                          value={values.specification}
                                                          onChange={handleChange}
                                                          onBlur={handleBlur}
                                                          isInvalid={touched.specification && errors.specification}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.specification}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    {/*Installed Date<*/}
                                    <Form.Group as={Row} className="mb-3" controlId="formTextBirthDate">
                                        <Form.Label column sm="3">Installed Date</Form.Label>
                                        <Col sm="6" className="date-form">
                                            <DatePicker
                                                className="form-control "
                                                dateFormat={DATE_FORMAT.DATE_PICKER}
                                                selected={values.installedDate}
                                                name="installedDate"
                                                onChange={(date) => {
                                                    setFieldValue('installedDate', date);
                                                }}
                                                onBlur={handleBlur}
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                todayButton={"Today"}
                                            />
                                            <BsFillCalendarDateFill className="icon-form"/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Col sm="3"/>
                                        <Col sm="6">
                                            <ErrorMessage name="installedDate">
                                                {msg => <div className="errorMessage">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                    </Form.Group>
                                    {/*State*/}
                                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">State</Form.Label>
                                        <Col sm="6">
                                            <div className="mb-3">
                                                <Form.Check
                                                    label="Available"
                                                    name="state"
                                                    type="radio"
                                                    value="Available"
                                                    defaultChecked={true}
                                                    onChange={handleChange}
                                                />
                                                <Form.Check
                                                    label="Not Available"
                                                    name="state"
                                                    type="radio"
                                                    value="Not Available"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </Col>
                                    </Form.Group>
                                    {/*Buttons*/}
                                    <div className="group-btn">
                                        <Button type="submit" className="btn-primary"
                                                disabled={!values.assetName || !values.specification
                                                || !values.installedDate||dropValue===' '}
                                        >
                                            Save
                                        </Button>
                                        <Button className="btn-cancel" type="reset"
                                                onClick={handleRedirectAssetManagePage}>
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                                {show &&
                                <CategoryModal
                                    show={show}
                                    handleClose={handleClose}
                                    categories={categories}
                                />}
                            </>
                        )}
                    </Formik>
                </div>
                <div className="col-lg-2"/>
            </div>
        </div>
    )
}
export default CreateAssetPage
