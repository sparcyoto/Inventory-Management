import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";

import styles from './table.module.scss'



export default function SimpleTable({ tableData = [], isAdmin, onEdit, onDisable, onDelete }) {


  const renderActionButtons = (rowData) => {
    const { disable } = rowData || {};



    return <div>
      <CreateIcon onClick={() => { onEdit(rowData) }} className={disable || !isAdmin ? '' : styles.editIcon} />
      {disable ?
        <VisibilityOffIcon onClick={() => { onDisable(rowData, false) }} className={!isAdmin ? '' : styles.disableIcon} />
        : <RemoveRedEyeIcon onClick={() => { onDisable(rowData, true) }} className={disable || !isAdmin ? '' : styles.disableIcon} />}
      <DeleteIcon onClick={() => { onDelete(rowData) }} className={!isAdmin ? '' : styles.deleteIcon} />
    </div >
  }

  return (
    <TableContainer component={Paper}>
      <Table className={styles.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quality</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.category}</TableCell>
              <TableCell align="right">{row.value}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{renderActionButtons(row)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
