import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 't0', label: '번호', minWidth: 170 },
  { id: 't1', label: '경비유형', minWidth: 100 },
  {
    id: 't2',
    label: '내용',
    minWidth: 170,
    align: 'right',
    format: value => value.toLocaleString(),
  },
  {
    id: 't3',
    label: '진행상태',
    minWidth: 170,
    align: 'right',
    format: value => value.toLocaleString(),
  },
  {
    id: 't4',
    label: '등록자',
    minWidth: 170,
    align: 'right',
    format: value => value.toFixed(2),
  },
  {
    id: 't5',
    label: '결제일',
    minWidth: 170,
    align: 'right',
    format: value => value.toFixed(2),
  },
];

function createData(t0, t1, t2, t3, t4, t5) {
  return {t0, t1, t2, t3, t4, t5};
}

const rows = [
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
  createData('10', '야간경비', '택시비', '진행', '김준선', '2020-03-04'),
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    console.log("handleChangePage");
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    console.log("handleChangeRowsPerPage");
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code} component={RouterLink} to="/expense/approvalDetail">
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}