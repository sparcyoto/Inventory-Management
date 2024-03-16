import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Switch from '@mui/material/Switch';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import MyModal from '@/components/MyModal';
import Table from '@/components/Table';

import styles from './index.module.scss'


const tableData = [
  {
    "name": "Bluetooth",
    "category": "Electronic",
    "value": "$150",
    "quantity": 5,
    "price": "$30"
  },
  {
    "name": "Edifier M43560",
    "category": "Electronic",
    "value": "0",
    "quantity": 0,
    "price": "$0"
  },
  {
    "name": "Sony 4k ultra 55 inch TV",
    "category": "Electronic",
    "value": "$1190",
    "quantity": 17,
    "price": "$70"
  },
  {
    "name": "Samsumg 55 inch TV",
    "category": "Electronic",
    "value": "$600",
    "quantity": 50,
    "price": "$12"
  },
  {
    "name": "samsumg S34 Ultra",
    "category": "phone",
    "value": "$0",
    "quantity": 0,
    "price": "$0"
  }
]

const Home: NextPage = () => {

  const [tableState, setTableState] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInventoryError, setIsInventoryError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false)
  const [editModalDetails, setEditModalDetails] = useState({})

  const handleEditModalClose = () => setShowEditModal(false);

  const handleModalProductSave = (productItem) => {
    const updatedTableState = tableState.map(rowDetails => {
      if (rowDetails.id === productItem.id) return productItem;

      return rowDetails;
    })

    setTableState(updatedTableState);
  }


  useEffect(() => {
    fetch('https://dev-0tf0hinghgjl39z.api.raw-labs.com/inventory')
      .then(response => response.json())
      .then(json => setTableState(json.map(val => ({ ...val, id: val.name + val.category, disable: false }))))
      .catch(err => {
        setIsInventoryError(true);
      })

    // setTableState(tableData.map(val => ({ ...val, id: val.name + val.category, disable: false })))
  }, [])


  const handleEdit = (rowData) => {
    const { id, disable } = rowData || {};
    if (disable || !isAdmin) return;

    setEditModalDetails(rowData);
    setShowEditModal(true);
  }
  const handleDisable = (rowData, shouldDisable) => {
    if (!isAdmin) return;

    const { id } = rowData || {};
    const newTableData = tableState.map(tableRowData => {
      if (tableRowData.id === id) return { ...tableRowData, disable: shouldDisable };

      return tableRowData;
    });

    setTableState(newTableData);
  }

  const handleDelete = (rowData) => {
    if (!isAdmin) return;

    const { id } = rowData || {};
    const filteredData = tableState.filter(tableRowData => tableRowData.id !== id);

    setTableState(filteredData);
  }


  const renderViewSwitch = () => (
    <span>
      <span>admin</span>
      <Switch checked={!isAdmin} onClick={() => setIsAdmin(!isAdmin)} />
      <span>user</span>
    </span>
  )

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

    console.log({ totalProducts, totalStoreValue, outOfStockCount, totalCategoryCount, tableState })

    return <div className={styles.inventoryOverViewContainer}>
      {renderInventoryOverViewItem(ShoppingCartIcon, 'Total Products', totalProducts)}
      {renderInventoryOverViewItem(AttachMoneyIcon, 'Total store value', totalStoreValue)}
      {renderInventoryOverViewItem(RemoveShoppingCartIcon, 'Out of stocks', outOfStockCount)}
      {renderInventoryOverViewItem(CategoryIcon, 'No of Category', totalCategoryCount)}
    </div>
  }

  if (isInventoryError) return <div>Oops! Something went Wrong</div>;


  return (
    <>
      <Head>
        <title>Homepage | Your Website</title>
      </Head>
      <div className={styles.viewSwitch}>{renderViewSwitch()}</div>

      <MyModal
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

export default Home;
