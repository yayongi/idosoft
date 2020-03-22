import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { columnsUp, checkColumnsDown } from './data';
import { AnnualStorage } from 'views/Expense/data'
import {EnhancedTableHead, stableSort, getComparator} from 'common/EnhancedTableHead';
import Checkbox from '@material-ui/core/Checkbox';

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
    const { rows, routeProps, state, setState } = props;
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
    
    // 선택 항목 배열
    const handleSelectClick = (e, seq) => {

      let selecteds = [...state.selected];
      
      if (e.target.checked) {
        selecteds.push(seq);
      } else {
        const idx = selecteds.indexOf(seq);
        selecteds.splice(idx, 1);
      }

      return setState({
        ...state,
        selected : selecteds
      });
    };
    
    // Width에 따라 반응형으로 열이 보여지는 개수 조정
    let columns = columnsUp;
    if(isWidthUp('md', props.width)) {
      columns =columnsUp;
    } else {
      columns =checkColumnsDown;
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
              isCheckBox={true}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => {

                const labelId = `enhanced-table-checkbox-${row.seq}`;

                return (
                  
                  <TableRow hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={row.seq} 
                  > 
                      <TableCell padding="checkbox">
                        {
                        (row.status ==='0'|| row.status === '1') && 
                          <>
                            <Checkbox 
                              inputProps={{ 'aria-labelledby': labelId }}
                              onChange={(e) => handleSelectClick(e, row.seq)}
                            />
                          </>}
                      </TableCell>
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={row.seq + column.id} 
                            id={labelId}
                            align={column.align} 
                            className={column.className} 
                            onClick={() => handleClickView(event, row)}>{/* react router의 상세 */} 
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