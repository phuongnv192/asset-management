import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {ErrorMessage, Formik} from 'formik';
import * as Yup from 'yup';
import moment from "moment";
import {useHistory, useParams} from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import {AGE_LIMIT, API_URL, DATE_FORMAT, ISO_WEEKEND} from "../../../common/constants";
import axios from "axios";
import jwt_decode from "jwt-decode";
import DatePicker from "react-datepicker";
import {BsFillCalendarDateFill} from "react-icons/all";


const validateForm = Yup.object().shape({
    birthDate: Yup.date().max(new Date(Date.now() - AGE_LIMIT), "User is under 18. Please select a different date")
        .required("Invalid date. Please select a different date").nullable(),
    type: Yup.string().required("Required!")
});

const validation = ({birthDate, joinedDate}) => {
    const errors = {};

    if (!joinedDate) {
        errors.joinedDate = "Invalid date. Please select a different date";
        return errors;
    }
    let isoWeekday = moment(joinedDate).isoWeekday();
    if (moment(joinedDate).isBefore(birthDate)) {
        errors.joinedDate = "Joined date is not later than Date of Birth. Please select a different date";
    } else if (ISO_WEEKEND.includes(isoWeekday)) {
        errors.joinedDate = "Joined date is Saturday or Sunday. Please select a different date"
    } else if (moment(joinedDate).isAfter(Date.now())) {
        errors.joinedDate = "Joined date is not future day. Please select a different date"
    }
    return errors;
}

const convertDataResponse = res => (
    {
        username: res.data.username,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        birthDate: moment(res.data.birthDate).toDate(),
        joinedDate: moment(res.data.joinedDate).toDate(),
        type: res.data.type,
        gender: res.data.gender
    }
);

const EditUserPage = ({token}) => {
    let history = useHistory();
    const {id} = useParams();

    const {
        isLoading,
        data: user,
        errorMessage,
    } = useFetch([], `${API_URL}/users/${id}`, convertDataResponse);
    const initialValues = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        joinedDate: user.joinedDate,
        type: user.type,
        gender: user.gender
    }
    console.log("initial ", initialValues)
    if (isLoading) return "Loading";
    if (errorMessage) return <div style={{color: "red"}}>{errorMessage}</div>;
    // console.log("user = ", user);
    // console.log(history)
    const submit = (values, {resetForm}) => {
        // console.log('Form values =', {values});
        // console.log('token=',localStorage.getItem('TOKEN'));
        axios({
            method: 'PUT',
            url: `${API_URL}/users/${id}`,
            header: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
            },
            data: {
                birthDate: values.birthDate,
                gender: values.gender,
                joinedDate: values.joinedDate,
                type: values.type
            }
        }).then((res) => {
            // console.log("res = ", res);
            console.log("Edit success");
            history.push("/user", {firstId: res.data.id});
        }).catch(err => {
            console.log("err = ", err);
            return <div style={{color: "red"}}>{err}</div>;
        });
        resetForm();
    }

    const handleRedirectUserManagePage = () => {
        history.push("/user");
    }
    return (
        <div className="app-page">
            <div className="row">
                <div className="col-lg-2"/>
                <div className="col-lg-8">
                    <div className="app-content__title">Edit User</div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        validationSchema={validateForm}
                        validate={validation}
                        onSubmit={submit}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              setFieldValue
                          }) => (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group as={Row} className="mb-3" controlId="formTextFirstName">
                                    <Form.Label column sm="3">First Name</Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            defaultValue={values.firstName}
                                            disabled={true}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.firstName}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" controlId="formTextLastName">
                                    <Form.Label column sm="3">Last Name</Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            defaultValue={values.lastName}
                                            disabled={true}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lastName}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2"/>
                                <Form.Group as={Row} className="mb-2" controlId="formTextBirthDate">
                                    <Form.Label column sm="3">Date Of Birth</Form.Label>
                                    <Col sm="6" className="date-form">
                                        <DatePicker
                                            className="form-control "
                                            dateFormat={DATE_FORMAT.DATE_PICKER}
                                            selected={values.birthDate}
                                            name="birthDate"
                                            onChange={(date) => {
                                                setFieldValue('birthDate', date);
                                            }}
                                            onBlur={handleBlur}
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                        />
                                        <BsFillCalendarDateFill className="icon-form"/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2">
                                    <Col sm="3"/>
                                    <Col sm="6">
                                        <ErrorMessage name="birthDate">
                                            {msg => <div className="errorMessage">{msg}</div>}
                                        </ErrorMessage>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                    <Form.Label column sm="3">
                                        Gender
                                    </Form.Label>
                                    <Col sm="6">
                                        <div className="mb-3">
                                            <Form.Check
                                                inline
                                                label="Female"
                                                name="gender"
                                                type="radio"
                                                value="Female"
                                                checked={values.gender === "Female"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                label="Male"
                                                name="gender"
                                                type="radio"
                                                value="Male"
                                                checked={values.gender === "Male"}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2"/>
                                <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                    <Form.Label column sm="3">Joined Date</Form.Label>
                                    <Col sm="6" className="date-form">
                                        <DatePicker
                                            className="form-control"
                                            dateFormat={DATE_FORMAT.DATE_PICKER}
                                            selected={values.joinedDate}
                                            name="joinedDate"
                                            onChange={(date) => setFieldValue('joinedDate', date)}
                                            onBlur={handleBlur}
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            todayButton="Today"
                                        />
                                        <BsFillCalendarDateFill className="icon-form"/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2">
                                    <Col sm="3"/>
                                    <Col sm="6">
                                        <ErrorMessage name="joinedDate">
                                            {msg => <div className="errorMessage">{msg}</div>}
                                        </ErrorMessage>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                    <Form.Label column sm="3">Type</Form.Label>
                                    <Col sm="6">
                                        <Form.Select
                                            name="type"
                                            value={values.type}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.type && errors.type}
                                            disabled={jwt_decode(token).sub === values.username}
                                        >
                                            <option value="Staff" defaultChecked={values.type === "Staff"}
                                                    label="Staff"/>
                                            <option value="Admin" defaultChecked={values.type === "Admin"}
                                                    label="Admin"/>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.type}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <div className="group-btn">
                                    <Button type="submit" className="btn-primary"
                                            disabled={!values.firstName || !values.lastName ||
                                            !values.birthDate || !values.joinedDate ||
                                            errors.birthDate || errors.joinedDate || !values.type}
                                    >
                                        Save
                                    </Button>
                                    <Button className="btn-cancel" type="reset" onClick={handleRedirectUserManagePage}>
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="col-lg-2"/>
            </div>
        </div>
    )
}
export default EditUserPage