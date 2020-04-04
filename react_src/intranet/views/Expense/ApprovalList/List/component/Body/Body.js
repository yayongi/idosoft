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
import {EnhancedTableHead, stableSort, getComparator} from 'common/EnhancedTableHead';
import Checkbox from '@material-ui/core/Checkbox';

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

    const loginSession = JSON.parse(sessionStorage.getItem("loginSession")); // 세션 정보

    // 정렬
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const handleRequestSort = (event, property) => {
      console.log(`order : ${order} property : ${property}`);
      const isAsc = orderBy === property && order === 'asc';

      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
    // 데이터, Router 속성
    const { rows, setRows, routeProps
            , paging, setPaging, state, setState
            , holdUp, setHoldUp 
            , page, setPage, rowsPerPage, setRowsPerPage
            , isAdmin, setIsAdmin, setShowLoadingBar
            , firSelected ,setFirSelected
						,	selected ,setSelected} = props;

    const handleChangePage = (event, newPage) => {
       // 페이징내용 세션스토리지 저장
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
      
       setSessionStrogy("EXPENSE_APP",data);
      
      if(holdUp < newPage){ // 이미 가지고 있는 페이지를 다시 호출하는 것을 막기 위해 사용
        setShowLoadingBar(true);
        Axios({
          url: '/intranet/getApprovalList.exp',
          method: 'post',
          data: data,
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(response => {
          setRows(rows.concat(JSON.parse(response.data.list))); // JSONARRAY 이어 붙이기
          
          const result = JSON.parse(response.data.result);

          setIsAdmin(response.data.isAdmin);
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
      setSessionStrogy("EXPENSE_APP",data);

      Axios({
        url: '/intranet/getApprovalList.exp',
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(response => {
        setRows(JSON.parse(response.data.list));
        setPaging(JSON.parse(response.data.result));
        
        const result = JSON.parse(response.data.result);
        
        setIsAdmin(response.data.isAdmin);
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
      routeProps.history.push(`${routeProps.match.url}/view/${row.seq}`);
    };
    
    // 선택 항목 배열
    const handleSelectClick = (e, seq, status) => {
      
      console.log(`seq : ${seq} status : ${status}`);

      let selecteds = [];

      if(status === 'SS0000'){
        selecteds = [...firSelected];
      } else { // status === 'SS0001'
        selecteds = [...selected];
      }
      
      console.log(`e.target.checked : ${e.target.checked}`);

      if (e.target.checked) {
        selecteds.push(seq);
      } else {
        const idx = selecteds.indexOf(seq);
        selecteds.splice(idx, 1);
      }

      if(status ==='SS0000'){
        
        setFirSelected(selecteds);
        
      } else { // status === 'SS0001'
        setSelected(selecteds);  
    }
    };
    
    // 버튼 여부  활성화
    const giveAuthorization = (status, prevAuthPersonNO, authPersonNO) => {
      let isAuth = false;
      const mno = loginSession.member_NO;

      switch (status) {
      case 'SS0000':
        if(mno == prevAuthPersonNO || isAdmin == "1"){ 
          isAuth = true;
        } else {
          isAuth = false;
        }
        break;
      case 'SS0001':
        if(mno == authPersonNO || isAdmin == "1"){  
          isAuth = true;
        } else {
          isAuth = false;
        }
        break;
      default:
        isAuth = false;
        break;
      }

      return isAuth;
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
                          giveAuthorization(row.status, row.prevAuthPersonNO, row.authPersonNO) &&
                          <>
                            <Checkbox 
                              inputProps={{ 'aria-labelledby': labelId }}
                              onChange={(e) => handleSelectClick(e, row.seq, row.status)}
                            />
                          </>
                        }
                      </TableCell>
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={row.rnum + column.id} 
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