import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { columnsUp, columnsDown } from './data';
import { AnnualStorage } from 'views/Expense/data';
import {EnhancedTableHead, stableSort, getComparator} from 'common/EnhancedTableHead';

const useStyles = makeStyles({
  root: {
    width: '100%',
    textDecoration: 'none',
  },
});

function Body(props) {
    const classes = useStyles();
     // 정렬
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
    // 데이터, Router 속성
    const { rows, routeProps } = props;

    // 페이징
    const [ page, setPage ] = React.useState(0);
    const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
    const handleChangeRowsPerPage = event => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    // 상세페이지로 이동
    const handleClickView = (event, row) => {
      console.log("call handleClickView");      
      AnnualStorage.setItem("ANNUAL_VIEW", JSON.stringify(row));  // 세션 스토리지에 선택한 Row Data 저장
      routeProps.history.push(`${routeProps.match.url}/view/${row.seq}`);
    };

    // Width에 따라 반응형으로 열이 보여지는 개수 조정
    let columns = columnsUp;
    if(isWidthUp('md', props.width)) {
      columns =columnsUp;
    } else {
      columns =columnsDown;
    }

    return (
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <Table stickyHeader aria-label="sticky table">
            <EnhancedTableHead
              headCells={columns}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => {
                return (
                  <TableRow hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={row.seq} 
                      onClick={() => handleClickView(event, row)} // react router의 상세
                  >
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={row.seq + column.id} align={column.align} className={column.className}>
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

export default withWidth()(Body);