import { Modal, Button } from "react-bootstrap";
import "./CancelPopup.css";
import axios from "axios";
import { API_URL } from "../../../common/constants";

const CancelRequestConfirmation = ({
  idCancel,
  showCancelConfirm,
  handleCloseCancelConfirm,
  reloadData
}) => {
  const handleConfirmDelete = () => {
		axios
			.delete(`${API_URL}/admin/assignments/${idCancel}/cancel`)
			.then(() => {
				console.log(`Cancel successful assignment: ${idCancel}`);
				handleCloseCancelConfirm();
        reloadData(true);
			})
			.catch(err => {
				handleCloseCancelConfirm();
				alert(`Delete error: ${err}`);
			});
	}
  return (
    <Modal 
            show={showCancelConfirm} 
            onHide={handleCloseCancelConfirm} 
            centered
            backdrop="static">
      <Modal.Header closeButton='' className="text-danger">
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Do you want to cancel this returning request? </p>
      </Modal.Body>
      <Modal.Footer className="confirm">
        <Button
          variant="danger"
          onClick={handleConfirmDelete}
          type="submit"
        >
          Yes
        </Button>
        <Button variant="outline-secondary" onClick={handleCloseCancelConfirm}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelRequestConfirmation;
