import React from 'react';
import {SORT_ORDERS} from "../../common/constants";
import BootstrapTable from "react-bootstrap-table-next";
import NoDataFound from "../NoDataFound/NoDataFound";

const defaultSorted = [{
    dataField: 'categoryName',
    order: SORT_ORDERS.ASC
}]

const ReportTable = ({reports, isLoading, errorMessage}) => {
    const columns = [
        {
            dataField: 'categoryName',
            text: 'Category',
            sort: true,
        },
        {
            dataField: 'total',
            text: 'Total',
            sort: true
        },
        {
            dataField: 'assigned',
            text: 'Assigned',
            sort: true
        }, {
            dataField: 'available',
            text: 'Available',
            sort: true
        }, {
            dataField: 'notAvailable',
            text: 'Not available',
            sort: true
        }, {
            dataField: 'waitingForRecycling',
            text: 'Waiting for recycling',
            sort: true,
            headerStyle: () => {
                return {width: '190px'};
            }
        }, {
            dataField: 'recycled',
            text: 'Recycled',
            sort: true
        }
    ];

    return (
        <>
            <BootstrapTable
                hover
                keyField='id'
                columns={columns}
                data={reports}
                defaultSorted={defaultSorted}
            />
            {isLoading && <div>Loading...</div>}
            {errorMessage && <div>{errorMessage}</div>}
            {!errorMessage && !isLoading && reports.length === 0 && <NoDataFound/>}
        </>
    );
};

export default ReportTable;