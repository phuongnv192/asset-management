import './EditAssignmentPage.css'
import {useHistory, useParams} from "react-router-dom";
import {ErrorMessage, Formik} from "formik";
import {Button, Col, Form, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import * as Yup from "yup";
import useFetch from "../../../hooks/useFetch";
import {API_URL, DATE_FORMAT} from "../../../common/constants";
import moment from "moment";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {InputGroup} from "reactstrap";
import {BsFillCalendarDateFill, VscTriangleDown} from "react-icons/all";
import UserAssignmentModal from "../AssignmentModal/UserAssignmentModal";
import AssetAssignmentModal from "../AssignmentModal/AssetAssignmentModal";
import DatePicker from "react-datepicker";

const validateForm = Yup.object().shape({
    assignedDate: Yup.date().required("Invalid date. Please select a different date").nullable()
})
const convertDataResponse = res => res.data;
const convertDataAssignmentResponse = res => (
    {
        assetName: res.data.assetName,
        assetCode: res.data.assetCode,
        assignTo: res.data.assignTo,
        assignedDate: moment(res.data.assignedDate).toDate(),
        note: res.data.note
    }
)
const convertDataUserResponse = res => res.data.map(u => (
    {
        id: u.id,
        username: u.username,
        staffCode: u.staffCode,
        fullName: `${u.lastName} ${u.firstName}`,
        type: u.type
    }
));

const EditAssignmentPage = () => {
    const {id} = useParams();

    let history = useHistory();
    const handleRedirectAssignmentPage = () => {
        history.push("/assignment");
    }

    const {
        data: users
    } = useFetch([], `${API_URL}/users`, convertDataUserResponse);
    const listUser = users.filter(u => u.username !== jwt_decode(localStorage.getItem("TOKEN")).sub);

    const {
        data: assets,
    } = useFetch([], `${API_URL}/assets`, convertDataResponse);

    const {
        isLoading,
        data: assignments,
        errorMessage
    } = useFetch([], `${API_URL}/user/assignments/${id}`, convertDataAssignmentResponse);

    /* Popup handle */
    const [show, setShow] = useState(false);
    const handleClickUserPopup = () => setShow(true);
    const handleClose = () => setShow(false);

    const [showAsset, setShowAsset] = useState(false);
    const handleClickAssetPopup = () => setShowAsset(true);
    const handleAssetClose = () => setShowAsset(false);

    const currentUser = users.find(u => u.username === assignments.assignTo);
    const currentAsset = assets.find(a => a.assetCode === assignments.assetCode);
    // console.log('currentUser', currentUser);
    // console.log('currentAsset', currentAsset);

    /* Pass users from popup to input form */
    const [assignedTo, setAssignedTo] = useState({});
    const [assignedAsset, setAssignedAsset] = useState({});
    const [assignedDate, setAssignedDate] = useState(assignments.assignedDate);
    const handlePassingUser = (user) => setAssignedTo(user);
    const handlePassingAsset = (asset) => setAssignedAsset(asset);
    // console.log('assignedTo', assignedTo);
    // console.log('assignedAsset', assignedAsset);
    // console.log('assignedDate', assignedDate);

    useEffect(() => {
        if (currentUser !== undefined) {
            setAssignedTo(currentUser);
        }
        if (currentAsset !== undefined) {
            setAssignedAsset(currentAsset);
        }
        if (assignments !== undefined) {
            setAssignedDate(assignments.assignedDate);
        }
    }, [currentUser, currentAsset, assignments]);

    let assignedFullName = "";
    if (assignedTo.fullName !== undefined) {
        assignedFullName = assignedTo.fullName;
    }
    let assignedAssetName = "";
    if (assignedAsset.assetName !== undefined) {
        assignedAssetName = assignedAsset.assetName;
    }
    const initialValues = {
        userFullName: assignedFullName,
        assetName: assignedAssetName,
        assignedDate: assignedDate,
        note: assignments.note
    }
    // console.log("Initial value = ", initialValues);

    const submit = (values, {resetForm}) => {
        // console.log('Form values =', {values});
        axios({
            method: 'PUT',
            url: `${API_URL}/admin/assignments/${id}`,
            data: {
                assignTo: assignedTo.username,
                assetCode: assignedAsset.assetCode,
                assignedDate: assignedDate,
                note: values.note
            }
        }).then((res) => {
            // console.log("res = ", res);
            // console.log("Edit success");
            history.push("/assignment", {firstId: res.data.id});
        }).catch(err => {
            console.log("err = ", err);
            return <div style={{color: "red"}}>{err}</div>;
        });
        resetForm();
    }

    if (isLoading) return "Loading...";
    if (errorMessage) return <div style={{color: "red"}}>{errorMessage}</div>;
    return (
        <div className="app-page">
            <div className="row">
                <div className="col-lg-2"/>
                <div className="col-lg-8">
                    <div className="app-content__title">Edit Assignment</div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        validationSchema={validateForm}
                        onSubmit={submit}
                    >
                        {({
                              values,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              setFieldValue
                          }) => (
                            <Form onSubmit={handleSubmit}>
                                {/*User*/}
                                <Form.Group as={Row} className="mb-3" controlId="formTextFullName">
                                    <Form.Label column sm="3">User</Form.Label>
                                    <Col sm="6">
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                name="user"
                                                value={values.userFullName}
                                                readOnly
                                                onClick={handleClickUserPopup}
                                            />
                                            <Button className="button-select"
                                                    onClick={handleClickUserPopup}
                                            >
                                                <VscTriangleDown className="icon-edit"/>
                                            </Button>
                                            <UserAssignmentModal
                                                show={show} handleClose={handleClose} users={listUser}
                                                handlePassingData={handlePassingUser}
                                                setFieldValue={setFieldValue}
                                                currentUser={currentUser}
                                            />
                                        </InputGroup>
                                    </Col>
                                </Form.Group>

                                {/*Asset*/}
                                <Form.Group as={Row} className="mb-3" controlId="formTextAssetName">
                                    <Form.Label column sm="3">Asset</Form.Label>
                                    <Col sm="6">
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                name="asset"
                                                value={values.assetName}
                                                readOnly
                                                onClick={handleClickAssetPopup}
                                            />
                                            <Button className="button-select"
                                                    onClick={handleClickAssetPopup}
                                            >
                                                <VscTriangleDown className="icon-edit"/>
                                            </Button>
                                            <AssetAssignmentModal
                                                show={showAsset} handleClose={handleAssetClose} assets={assets}
                                                currentAsset={currentAsset}
                                                setFieldValue={setFieldValue}
                                                handlePassingData={handlePassingAsset}
                                            />
                                        </InputGroup>
                                    </Col>
                                </Form.Group>

                                {/*Assign Date*/}
                                <Form.Group as={Row} className="mb-2" controlId="formTextBirthDate">
                                    <Form.Label column sm="3">Assigned Date</Form.Label>
                                    <Col sm="6" className="date-form">
                                        <DatePicker
                                            className="form-control "
                                            dateFormat={DATE_FORMAT.DATE_PICKER}
                                            selected={assignedDate}
                                            name="assignedDate"
                                            onChange={(date) => {
                                                setAssignedDate(date);
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
                                <Form.Group as={Row} className="mb-2">
                                    <Col sm="3"/>
                                    <Col sm="6">
                                        <ErrorMessage name="assignedDate">
                                            {msg => <div className="errorMessage">{msg}</div>}
                                        </ErrorMessage>
                                    </Col>
                                </Form.Group>

                                {/*Note*/}
                                <Form.Group as={Row} className="mb-3" controlId="exampleFormControlTextarea">
                                    <Form.Label column sm="3">Note</Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            rows={3}
                                            as="textarea"
                                            name="note"
                                            defaultValue={values.note}
                                            onChange={(evt) => {
                                                handleChange(evt);
                                                setFieldValue('note', evt.target.value);
                                            }}
                                        />
                                    </Col>
                                </Form.Group>

                                {/*Buttons*/}
                                <div className="group-btn">
                                    <Button type="submit" className="btn-primary"
                                            disabled={!values.assignedDate}
                                    >
                                        Save
                                    </Button>
                                    <Button className="btn-cancel" type="reset" onClick={handleRedirectAssignmentPage}>
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
export default EditAssignmentPage