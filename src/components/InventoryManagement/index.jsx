import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Switch from '@mui/material/Switch';
// import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import EditModal from '@/components/EditModal';
import Table from '@/components/Table';

import styles from './inventoryManagement.module.scss'

const InventoryManagement = () => {

    const [tableState, setTableState] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isInventoryError, setIsInventoryError] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false)
    const [editModalDetails, setEditModalDetails] = useState({})

    // handler for model close
    const handleEditModalClose = () => setShowEditModal(false);

    // logic for saving the edit modal and reflecting on Inventory
    const handleModalProductSave = (productItem) => {
        const updatedTableState = tableState.map(rowDetails => {
            if (rowDetails.id === productItem.id) return productItem;

            return rowDetails;
        })

        setTableState(updatedTableState);
    }


    // performing api call on page mount and handling api failure
    useEffect(() => {
        fetch('https://dev-0tf0hinghgjl39z.api.raw-labs.com/inventory')
            .then(response => response.json())
            .then(json => setTableState(json.map(val => ({ ...val, id: val.name + val.category, disable: false }))))
            .catch(err => {
                setIsInventoryError(true);
            })

    }, [])

    // handle logic for edit modal
    const handleEdit = (rowData) => {
        const { id, disable } = rowData || {};
        if (disable || !isAdmin) return;

        setEditModalDetails(rowData);
        setShowEditModal(true);
    }

    // handle logic for Disabling the productItem
    const handleDisable = (rowData, shouldDisable) => {
        if (!isAdmin) return;

        const { id } = rowData || {};
        const newTableData = tableState.map(tableRowData => {
            if (tableRowData.id === id) return { ...tableRowData, disable: shouldDisable };

            return tableRowData;
        });

        setTableState(newTableData);
    }

    // handle logic for Deleting the productItem
    const handleDelete = (rowData) => {
        if (!isAdmin) return;

        const { id } = rowData || {};
        const filteredData = tableState.filter(tableRowData => tableRowData.id !== id);

        setTableState(filteredData);
    }


    // rendering admin, user switch
    const renderViewSwitch = () => (
        <span>
            <span>admin</span>
            <Switch checked={!isAdmin} onClick={() => setIsAdmin(!isAdmin)} />
            <span>user</span>
        </span>
    )

    // rendering OverView of products
    const renderInventoryOverViewItem = (Icon, title, value) => {

        return <div className={styles.inventoryOverviewCard}>
            <span className={styles.inventoryOverviewCardSection}>
                <Icon />
                <span>
                    <div>{title}</div>
                    <h1>{value}</h1>
                </span>
            </span>
        </div>
    }

    const renderInventoryOverView = () => {
        const removedDisabledList = tableState.filter(rowDetails => rowDetails?.disable === false);

        const totalCategory = {}
        const totalProducts = removedDisabledList.length;
        const totalStoreValue = removedDisabledList.reduce(((acc, tableRowData) => acc + (Number(tableRowData?.price.replace('$', ''))) * Number(tableRowData?.quantity)), 0)
        const outOfStockCount = removedDisabledList.reduce(((acc, tableRowData) => tableRowData?.quantity == 0 ? acc + 1 : acc), 0);

        removedDisabledList.forEach(tableRowData => { totalCategory[tableRowData?.category] = 1 });

        const totalCategoryCount = Object.keys(totalCategory).length;

        return <div className={styles.inventoryOverViewContainer}>
            {renderInventoryOverViewItem(ShoppingCartIcon, 'Total Products', totalProducts)}
            {renderInventoryOverViewItem(AttachMoneyIcon, 'Total store value', totalStoreValue)}
            {renderInventoryOverViewItem(RemoveShoppingCartIcon, 'Out of stocks', outOfStockCount)}
            {renderInventoryOverViewItem(CategoryIcon, 'No of Category', totalCategoryCount)}
        </div>
    }

    // handling api failure cases
    if (isInventoryError) return <div>Oops! Something went Wrong</div>;


    return (
        <>
            <div className={styles.viewSwitch}>{renderViewSwitch()}</div>

            <EditModal
                productItem={editModalDetails}
                open={showEditModal}
                onSave={handleModalProductSave}
                onClose={handleEditModalClose}
            />
            <h1> Inventory Stats</h1>
            {renderInventoryOverView()}
            <Table
                isAdmin={isAdmin}
                tableData={tableState}
                onEdit={handleEdit}
                onDisable={handleDisable}
                onDelete={handleDelete}
            />
        </>
    );
};

export default InventoryManagement;
