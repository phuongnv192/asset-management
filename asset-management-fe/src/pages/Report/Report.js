import React from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import ReportTable from "../../components/ReportTable/ReportTable";
import useFetch from "../../hooks/useFetch";
import {API_URL, DATE_FORMAT} from "../../common/constants";
import exportToXLSX from "../../common/exportToXLSX";
import moment from "moment";

const convertDataResponse = res => res.data;

const Report = () => {
    const {
        isLoading,
        data: reports,
        errorMessage
    } = useFetch([], `${API_URL}/assets/report`, convertDataResponse);

    const handleExport = () => {
        exportToXLSX(
            `assetReport_${moment(new Date()).format(DATE_FORMAT.REPORT_FILE)}`,
            ['Category', 'Total', 'Assigned', 'Available', 'Not available', 'Waiting for recycling', 'Recycled'],
            reports);
    };

    return (
        <div className="mt-4">
            <Container className="px-0">
                <div className="manager__heading pb-3">
                    Report
                </div>
                <Form className="manager__action mb-3">
                    <Row className="actions__wrapper">
                        <Col className="col-11"/>
                        <Col className="h-75 col-1">
                            <Button
                                className="w-100 h-100"
                                onClick={handleExport}
                            >Export</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
            <ReportTable
                reports={reports}
                errorMessage={errorMessage}
                isLoading={isLoading}
            />
        </div>
    );
}
export default Report