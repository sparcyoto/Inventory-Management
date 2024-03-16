import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';

import styles from './editModal.module.scss'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  // boxShadow: 24,
  p: 2,
  borderRadius: 4,
};

export default function EditModal({ open, onClose, onSave, productItem }) {
  const [productDetails, setProductDetails] = useState(productItem);

  const handleClose = () => {
    onClose()
  };

  useEffect(() => {
    setProductDetails(productItem)
  }, [productItem])

  const handleSave = () => {
    onSave(productDetails)
    onClose()
  }

  console.log('modal', productDetails, productItem)

  const renderEditableSection = () => {
    return <div className={styles.editableSectionContainer}>
      <div className={styles.editableSectionRowContainer}>
        <div>
          <h5>category</h5>
          <input
            value={productDetails?.category}
            onChange={(e) => setProductDetails({ ...productDetails, category: e.target.value })}
            className={styles.inputContainer} />
        </div>
        <div>
          <h5>price</h5>
          <input
            value={productDetails?.price}
            onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
            className={styles.inputContainer} />
        </div>
      </div>
      <div className={styles.editableSectionRowContainer}>
        <div>
          <h5>quantity</h5>
          <input
            value={productDetails?.quantity}
            onChange={(e) => setProductDetails({ ...productDetails, quantity: e.target.value })}
            className={styles.inputContainer} />
        </div>
        <div>
          <h5>value</h5>
          <input
            value={productDetails?.value}
            onChange={(e) => setProductDetails({ ...productDetails, value: e.target.value })}
            className={styles.inputContainer} />
        </div>
      </div>
    </div>
  }



  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <div className={styles.headingSection}>
            <h2 className={styles.container}> Edit product</h2>
            <Button onClick={handleClose}>X</Button>
          </div>
          <h3>{productDetails?.name}</h3>
          {renderEditableSection()}
          <div className={styles.bottomButtonsContainer}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}