import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    height:'300px'
  },
});

function createData(name, calories, fat, carbs, protein, name2) {
  return { name, calories, fat, carbs, protein, name2 };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, "dd"),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, "dd"),
  createData('Eclair', 262, 16.0, 24, 6.0, "dd"),
  createData('Cupcake', 305, 3.7, 67, 4.3, "dd"),
  createData('Gingerbread', 356, 16.0, 49, 3.9, "dd"),
];

export default function DenseTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>번호</TableCell>
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">Level</TableCell>
            <TableCell align="right">CODE NAME</TableCell>
            <TableCell align="right">UPPER CODE</TableCell>
            <TableCell align="right">UPPER NAME</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}