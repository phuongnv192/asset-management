import React from 'react';
import {Button, Modal} from "react-bootstrap";
import './AssetDeleteConfirm.css'
import axios from "axios";
import {API_URL} from "../../../common/constants";

const AssetDeleteConfirm = ({show, handleCloseConfirm, idDelete, reloadData}) => {

	const handleConfirmDelete = () => {
		axios
			.delete(`${API_URL}/assets/${idDelete}`)
			.then(() => {
				console.log(`Delete successful asset: ${idDelete}`);
				handleCloseConfirm();
				reloadData(true);
			})
			.catch(err => {
				handleCloseConfirm();
				alert(`Delete error: ${err}`);
			});
	}

	return (
		<Modal
			show={show}
			onHide={handleCloseConfirm}
			centered
			backdrop='static'
		>
			<Modal.Header closeButton='' className="text-danger">
				<Modal.Title>Are you sure?</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Do you want to delete this asset? </p>
			</Modal.Body>
			<Modal.Footer className="confirm">
				<Button
					variant="danger"
					onClick={handleConfirmDelete}
					type="submit"
				>
					Delete
				</Button>
				<Button variant="outline-secondary" onClick={handleCloseConfirm}>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AssetDeleteConfirm;
