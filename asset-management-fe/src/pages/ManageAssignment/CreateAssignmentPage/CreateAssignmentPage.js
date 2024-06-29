import React, {useState} from "react";
import './CreateAssignmentPage.css'
import {Button, Col, Form, Row} from "react-bootstrap";
import {ErrorMessage, Formik} from "formik";
import {useHistory} from "react-router-dom";
import * as Yup from 'yup';
import useFetch from "../../../hooks/useFetch";
import {API_URL, DATE_FORMAT, FILTER_ASM_STATE_OPTIONS, TODAY} from "../../../common/constants";

import moment from "moment";
import {InputGroup} from "reactstrap";
import UserAssignmentModal from "../AssignmentModal/UserAssignmentModal";
import AssetAssignmentModal from "../AssignmentModal/AssetAssignmentModal";
import axios from "axios";
import {BsSearch, BsFillCalendarDateFill} from "react-icons/all";
import DatePicker from "react-datepicker";

const validateForm = Yup.object().shape({
    user: Yup.string().required("Required!"),
    asset: Yup.string().required("Required!"),
    note: Yup.string().required("Required!"),
    assignedDate: Yup
        .date()
        .required("Required!")
        .min(TODAY, "Date cannot be in the past")
        .nullable()
})
const convertUserResponse = res => res.data.map(u => (
    {
        id: u.id,
        staffCode: u.staffCode,
        fullName: `${u.lastName} ${u.firstName}`,
        username: u.username,
        joinedDate: moment(u.joinedDate).format(DATE_FORMAT.TO),
        type: u.type,
        location: u.location
    }
));
const convertAssetResponse = res => res.data;
const CreateAssignmentPage = ({curUsername}) => {
    let history = useHistory();

    const [assignedDate, setAssignedDate] = useState(new Date());

    /**
     * Fetch user and asset
     */
    const {
        data: users,
        errorUserMessage
    } = useFetch([], `${API_URL}/users`, convertUserResponse);
    const {
        data: assets,
        errorAssetMessage
    } = useFetch([], `${API_URL}/assets`, convertAssetResponse);

    if (errorUserMessage && errorAssetMessage) window.location.reload(history.push("/login"));

    const submit = (values, {resetForm}) => {
        let didCancel = false;
        axios({
            method: 'POST',
            url: `${API_URL}/admin/assignments/`,
            data: {
                assetCode: assignedAsset.assetCode,
                assignBy: curUsername,
                assignTo: assignedTo.username,
                assignedDate: values.assignedDate,
                state: FILTER_ASM_STATE_OPTIONS.WAITING_FOR_ACCEPTANCE,
                note: values.note
            }
        }).then(res => {
            if (!didCancel && res.status === 200) {
                history.push("/assignment", {firstId: res.data.id})
            }
        }).catch(err => {
            if (!didCancel && err) {
                console.log("err = ", err);
            }
        }).finally(() => {
                resetForm();
                setAssignedAsset("");
                setAssignedTo("");
            }
        );
        return () => didCancel = true;
    }
    const handleRedirectAssignmentManagePage = () => {
        history.push("/assignment")
    }

    /**
     * Popup handle go here
     */
    const [show, setShow] = useState(false);
    const handleClickUserPopup = () => setShow(true);
    const handleClose = () => setShow(false);

    const [showAsset, setShowAsset] = useState(false);
    const handleClickAssetPopup = () => setShowAsset(true);
    const handleAssetClose = () => setShowAsset(false);
    /**
     * Pass users from popup to input form
     */
    const [assignedTo, setAssignedTo] = useState({});
    const handlePassingData = (user) => setAssignedTo(user);
    console.log(assignedTo.fullName)
    const [assignedAsset, setAssignedAsset] = useState({});
    const handlePassingAsset = (asset) => setAssignedAsset(asset);
    console.log(assignedAsset)

    let assignedFullName = "";
    if (assignedTo.fullName !== undefined) {
        assignedFullName = assignedTo.fullName
    }
    let assignedAssetName = "";
    if (assignedAsset.assetName !== undefined) {
        assignedAssetName = assignedAsset.assetName;
    }
    const initialValues = {
        user: assignedFullName,
        asset: assignedAssetName,
        note: "",
        assignedDate: assignedDate
    }

    return (
        <div className="app-page">
            <div className="row">
                <div className="col-lg-2"/>
                <div className="col-lg-8">
                    <div className="app-content__title">Create New Assignment</div>

                    <Formik
                        enableReinitialize={true}
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
                              handleSubmit,
                              setFieldValue
                          }) => (
                            <Form onSubmit={handleSubmit}>
                                {/*User*/}
                                <Form.Group as={Row} className="mb-3" controlId="formTextFullName" id="userInput">
                                    <Form.Label column sm="3">User</Form.Label>
                                    <Col sm="6">
                                        <InputGroup>
                                            <Form.Control
                                                type="text" name="user"
                                                className="input-assign"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.user}
                                                isInvalid={touched.user && errors.user}
                                                readOnly
                                                onClick={handleClickUserPopup}
                                            />
                                            <Button className="button-add"
                                                    onClick={handleClickUserPopup}
                                            >
                                                <BsSearch className="icon-assign"/>
                                            </Button>
                                            <UserAssignmentModal
                                                show={show} handleClose={handleClose} users={users}
                                                handlePassingData={handlePassingData}
                                                setFieldValue={setFieldValue}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.user}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Col>
                                </Form.Group>
                                {/*Asset*/}
                                <Form.Group as={Row} className="mb-3" controlId="formTextAssetName" id="assetInput">
                                    <Form.Label column sm="3">Asset</Form.Label>
                                    <Col sm="6">
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                name="asset"
                                                className="input-assign"
                                                value={values.asset}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.asset && errors.asset}
                                                readOnly
                                                onClick={handleClickAssetPopup}
                                            />
                                            <Button className="button-add"
                                                    onClick={handleClickAssetPopup}
                                            >
                                                <BsSearch className="icon-assign"/>
                                            </Button>
                                            <AssetAssignmentModal
                                                show={showAsset} handleClose={handleAssetClose} assets={assets}
                                                handlePassingData={handlePassingAsset}
                                                setFieldValue={setFieldValue}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.asset}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Col>
                                </Form.Group>
                                {/*Assigned Date*/}
                                <Form.Group as={Row} controlId="formAssignedDate">
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
                                            todayButton="Today"
                                        />
                                        <BsFillCalendarDateFill className="icon-form"/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Col sm="3"/>
                                    <Col sm="6">
                                        <ErrorMessage name="assignedDate">
                                            {msg => <div className="errorMessage">{msg}</div>}
                                        </ErrorMessage>
                                    </Col>
                                </Form.Group>
                                {/*Note*/}
                                <Form.Group as={Row} className="mb-3" controlId="formTextareaNote">
                                    <Form.Label column sm="3">Note</Form.Label>
                                    <Col sm="6">
                                        <Form.Control rows={4}
                                                      as="textarea"
                                                      name="note"
                                                      value={values.note}
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      isInvalid={touched.note && errors.note}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.note}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                {/*Buttons*/}
                                <div className="group-btn row">
                                    <Col sm="3"></Col>
                                    <Col sm="6">
                                        <Button type="submit" className="btn-primary"
                                                disabled={!values.user || !values.asset || !values.note || !values.assignedDate}
                                        >
                                            Save
                                        </Button>
                                        <Button className="btn-cancel" type="reset"
                                                onClick={handleRedirectAssignmentManagePage}>
                                            Cancel
                                        </Button>
                                    </Col>
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
export default CreateAssignmentPage;
