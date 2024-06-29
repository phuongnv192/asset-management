import React from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import {SORT_ORDERS} from "../../../../common/constants";

const CategoryList = ({categories, selectRow, selectedRowId}) => {
    const columns = [
        {
            dataField: 'categoryName',
            text: 'Category name',
            sort: true,
            headerStyle: () => {
                return {width: '120px'};
            }
        }, {
            dataField: 'categoryPrefix',
            text: 'Prefix',
            sort: true,
            headerStyle: () => {
                return {width: '40px'};
            }
        }
    ];

    return (
        <div className="table-scroll">
            <BootstrapTable
                keyField='id'
                columns={columns}
                data={categories}
                defaultSorted={[{
                    dataField: 'categoryPrefix',
                    order: SORT_ORDERS.ASC
                }]}
                selectRow={{
                    mode: 'radio',
                    clickToSelect: true,
                    hideSelectColumn: true,
                    bgColor: 'rgba(108,117,125,0.53)',
                    onSelect: selectRow,
                    selected: [selectedRowId]
                }}
            />
        </div>
    );
};

export default CategoryList;