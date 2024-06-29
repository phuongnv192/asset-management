import React from "react";
import {Button, Modal} from "react-bootstrap";
import axios from "axios";
import {API_URL, DATE_FORMAT, FILTER_ASM_STATE_OPTIONS} from "../../../common/constants";
import jwt_decode from "jwt-decode";
import moment from "moment";

const CompleteReturnConfirmation = ({currentRowSelected, showCompleteConfirm, handleCloseCompleteConfirm}) => {
    const updateAssignment = () => {
        currentRowSelected.acceptedBy = jwt_decode(localStorage.getItem("TOKEN")).sub;
        currentRowSelected.state = FILTER_ASM_STATE_OPTIONS.COMPLETED;
        currentRowSelected.returnedDate = moment(new Date()).format(DATE_FORMAT.TO);
    }

    const handleConfirmComplete = () => {
        axios
            .put(`${API_URL}/admin/assignments/${currentRowSelected.id}/return/complete`)
            .then(() => {
                // console.log(`Complete return request successfully: ${currentRowSelected.id}`);
                updateAssignment();
            })
            .catch(err => {
                // console.log(`Complete return request failed: ${currentRowSelected.id}`);
                // console.log(err);
                // console.log(err.response.data);
            })
            .finally(() => {
                handleCloseCompleteConfirm();
            });
        // console.log(`Complete return request end.`);
    }

    return (
        <Modal
            show={showCompleteConfirm}
            onHide={handleCloseCompleteConfirm}
            centered
            backdrop="static">
            <Modal.Header closeButton='' className="text-danger">
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Do you want to mark this returning request as 'Completed'?</p>
            </Modal.Body>
            <Modal.Footer className="confirm">
                <Button
                    variant="danger"
                    onClick={handleConfirmComplete}
                    type="submit"
                >
                    Yes
                </Button>
                <Button variant="outline-secondary" onClick={handleCloseCompleteConfirm}>
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CompleteReturnConfirmation;
