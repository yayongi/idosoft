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
import {EnhancedTableHead, stableSort, getComparator} from 'common/EnhancedTableHead';

import Axios from 'axios';

import {setSessionStrogy} from '../../../../../../js/util';

const useStyles = makeStyles({
  root: {
    width: '100%',
    textDecoration: 'none',
  },
});

function Body(props) {
    const classes = useStyles();

    const columnsUp = [
      { id: 'rnum', label: '번호', minWidth: 100, align: 'center', paddingLeft : 50},
      { id: 'expenseTypeText', label: '경비유형', minWidth: 100, align: 'center', paddingLeft : 50 },
      { id: 'memo', label: '내용', minWidth: 100, align: 'center', paddingLeft : 50 },
      { id: 'statusText', label: '진행상태', minWidth: 100, align: 'center', paddingLeft : 50 },
      { id: 'register', label: '등록자', minWidth: 100, align: 'center', paddingLeft : 50 },
      { id: 'payDate', label: '결제일', minWidth: 100, align: 'center', paddingLeft : 50 },
    ];

    const columnsDown = [
      { id: 'expenseTypeText', label: '경비유형', minWidth: 100, align: 'center', paddingLeft : 50 },
      { id: 'statusText', label: '진행상태', minWidth: 100, align: 'center', paddingLeft : 50 },
      { id: 'payDate', label: '결제일', minWidth: 100, align: 'center', paddingLeft : 50 },
    ];


     // 정렬
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
    // 데이터, Router 속성
    const { rows, setRows, routeProps
            , paging, setPaging, state
            , holdUp, setHoldUp 
            , page, setPage, rowsPerPage, setRowsPerPage
            , setShowLoadingBar} = props;

    const handleChangePage = (event, newPage) => {
      
      const data = {
        currentPage : String(Number(newPage)+1),
          limit : String(rowsPerPage),
          name: state.name,
          expenseType: state.expenseType,
          payStDt: state.payStDt,
          payEdDt: state.payEdDt,
          status: state.status,
          memo: state.memo,
      }

      // 페이징내용 세션스토리지 저장
      setSessionStrogy("EXPENSE_ANN",data);
      
      if(holdUp < newPage){ // 이미 가지고 있는 페이지를 다시 호출하는 것을 막기 위해 사용
        setShowLoadingBar(true);
        Axios({
          url: '/intranet/getAnnaualList.exp',
          method: 'post',
          data: data,
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(response => {
          setRows(rows.concat(JSON.parse(response.data.list))); // JSONARRAY 이어 붙이기
          
          const result = JSON.parse(response.data.result);

          setRowsPerPage(Number(result.limit));
          setPage(Number(result.currentPage)-1);
          setHoldUp(Number(result.currentPage)-1);
          setShowLoadingBar(false);
        }).catch(e => {
          setShowLoadingBar(false);
          processErrCode(e);
          console.log(e);
        });
      } else {
        setRowsPerPage(rowsPerPage);
        setPage(newPage);
      }
    };

    const handleChangeRowsPerPage = event => {
      setShowLoadingBar(true);

      const data = {
        currentPage : '1',
        limit : String(event.target.value),
        name: state.name,
        expenseType: state.expenseType,
        payStDt: state.payStDt,
        payEdDt: state.payEdDt,
        status: state.status,
        memo: state.memo,
      }

      // 페이징내용 세션스토리지 저장
      setSessionStrogy("EXPENSE_ANN",data);

      Axios({
        url: '/intranet/getAnnaualList.exp',
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(response => {
        setRows(JSON.parse(response.data.list));
        setPaging(JSON.parse(response.data.result));
        
        const result = JSON.parse(response.data.result);
        
        setRowsPerPage(Number(result.limit));
        setPage(Number(result.currentPage)-1);
        setHoldUp(Number(result.currentPage)-1);

        setShowLoadingBar(false);
      }).catch(e => {
        setShowLoadingBar(false);
        processErrCode(e);
        console.log(e);
      });
    };

    // 상세페이지로 이동
    const handleClickView = (event, row) => {
      console.log("call handleClickView");      
      
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
            count={paging.listCount}
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
                      key={row.rnum} 
                      onClick={() => handleClickView(event, row)} // react router의 상세
                  >
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={row.rnum + column.id} align={column.align} className={column.className}>
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
          count={paging.listCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    );
}

export default withWidth()(Body);