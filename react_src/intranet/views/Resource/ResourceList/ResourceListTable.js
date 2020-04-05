import React, { useDebugValue, useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { Link as RouterLink } from 'react-router-dom';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import axios from 'axios';

import CommonDialog from '../../../js/CommonDialog';
import ContentModal from '../component/ContentModal';
import { isEmpty, processErrCode } from '../../../js/util';

const headCells = [
  { id: 'res_no', label: '번호'},
  { id: 'res_code', label: '자원종류'},
  { id: 'model_nm', label: '모델명'},
  { id: 'mark_code', label: '제조사'},
  { id: 'product_mtn', label: '제조년월'},
  { id: 'purchase_mtn', label: '구입년월'},
  { id: 'display_size_code', label: '화면크기'},
  { id: 'serial_no', label: 'Serial번호'},
  { id: 'mac_addr', label: 'Mac주소'},
  { id: 'holder', label: '보유자'},
];
const columnsUp = [
      { id: 'res_no', label: '번호', minWidth: 100, align: 'center', paddingLeft : 50 },
      { id: 'res_code', label: '자원종류', minWidth: 100, align: 'center', paddingLeft : 50 },
      { id: 'model_nm', label: '모델명', minWidth: 100, align: 'center', paddingLeft : 50 },
      { id: 'mark_code', label: '제조사' , minWidth: 100, align: 'center', paddingLeft : 50},
      { id: 'product_mtn', label: '제조년월' , minWidth: 100, align: 'center', paddingLeft : 50},
      { id: 'purchase_mtn', label: '구입년월' , minWidth: 100, align: 'center', paddingLeft : 50},
      { id: 'display_size_code', label: '화면크기' , minWidth: 100, align: 'center', paddingLeft : 50},
      { id: 'serial_no', label: 'Serial번호' , minWidth: 100, align: 'center', paddingLeft : 50},
      { id: 'mac_addr', label: 'Mac주소' , minWidth: 100, align: 'center', paddingLeft : 50},
      { id: 'holder', label: '보유자' , minWidth: 100, align: 'center', paddingLeft : 50},
    ];

const columnsDown = [
      // { id: 'res_no', label: '번호' , minWidth: 100, align: 'center', paddingLeft : 50},
      { id: 'model_nm', label: '모델명' , minWidth: 100, align: 'center', paddingLeft : 50},
      { id: 'holder', label: '보유자' , minWidth: 100, align: 'center', paddingLeft : 50},
];

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  tableWeb: {
    minWidth: 750,
  },
  tableApp:{
    width:'100%'
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  margin: {
    // margin: theme.spacing(1),
  },
  overflowCon : {
		whiteSpace:"nowrap",
		overflow:"hidden",
		textOverflow:"ellipsis"
  },
  maxWidth : {
		maxWidth : "120px"
  },
}));

function ResourceListTable(props) {
  const classes = useStyles();

  const {
          isAdmin,
          memberNo,
          count,
          setCount, 
          resData, 
          selectedResNo, 
          setResData, 
          page, 
          setPage, 
          rowsPerPage, 
          setRowsPerPage
  } = props;

  const [selected, setSelected] = React.useState([]);
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState(resData);
  const [deleteRow, setDeleteRow] = React.useState(0);
  const [confirm, setConfirm] = React.useState({});
  const [openModal, setOpenModal] = React.useState({resData:{}, openModal:false});

  // Width에 따라 반응형으로 열이 보여지는 개수 조정
  let columns = columnsUp;
  if(isWidthUp('md', props.width)) {
    columns =columnsUp;
  } else {
    columns =columnsDown;
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = resData.map(n => n.res_no);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    selectedResNo(newSelected);
    // console.log(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    // console.log('newPage : '+newPage)
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // console.log("RowerPerPage : "+parseInt(event.target.value, 10));
  };

  //개별 삭제 handler
  const handleDeleteClick = (res_no) => {
    setDeleteRow(res_no);
    handleOpenConfirm('자원관리', '선택항목을 삭제하시겠습니까?', true);
  }
  // confirm Open Handler
	const handleOpenConfirm = (title, content, isConfirm) => {
		return setConfirm({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}
	// confirm Close Handler
	const handleCloseConfirm = (title, result) => {
		//엑셀, 선택삭제 처리
		setConfirm({title:'', content:'', onOff:false, isConfirm:false});
		return resDelete(result);
		
  }
  
  //localStorage resData  삭제 처리
	const resDelete = (result) => {
		if(result){
      axios({
				url: '/intranet/resource/delete',
				method : 'post',
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
        },
        data:{
          res_no : deleteRow
        },
				}).then(response => {
          // console.log(response.data);
          setCount(count-1);
				}).catch(e => {
					processErrCode(e);
      });
      
			const upStreamData = resData.filter((row) => {
				return !(row.res_no === deleteRow);
			});
			setResData(upStreamData);
		}
		return setDeleteRow(0);
	}

  const openContentModal = (row) => {
      return setOpenModal({resData:row, openModal:true});
  }

  const handleCloseModal = (trigger) => {
    return setOpenModal({resData:{}, openModal:trigger});
  }

  const handleEditClick = (res_no) => {
    // localStorage.setItem('resEditIndex', res_no);
  }

  const isSelected = res_no => selected.indexOf(res_no) !== -1;
  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <Fragment>
    <CommonDialog props={confirm} closeCommonDialog={handleCloseConfirm}/>
    <ContentModal props={openModal} closeModal={handleCloseModal}/>
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
       {!isEmpty(resData) ?
       <>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          // count={rows.length}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        {/* <TableContainer> */}
          <Table
            // className={isWidthUp('md', props.width) ? classes.tableWeb : classes.tableApp}
            aria-labelledby="tableTitle"
            // size='medium'
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <TableRow>
                {isAdmin &&
                <TableCell padding="checkbox">
                    <Checkbox
                      // indeterminate={selected.length > 0 && resData.length < selected.length}
                      checked={resData.length === selected.length && resData.length !== 0}
                      onChange={handleSelectAllClick}
                      inputProps={{ 'aria-label': 'select all desserts' }}
                      color="primary"
                      //  style={{minWidth:'10px'}}
                    />
                </TableCell>
                }
                {isWidthUp('md', props.width) &&
                  <>
                  {columns.map(headCell => (
                    <TableCell
                      key={headCell.id}
                      align={'center'}
                      padding={'default'}
                      // style={{minWidth:'50px'}}
                    >
                        {headCell.label}
                    </TableCell>
                  ))}
                  <TableCell align={'center'} width={'130px'}>수정 / 삭제</TableCell>
                  </>
                }
                {!isWidthUp('md', props.width) &&
                  <>
                    {columns.map(headCell => (
                      <TableCell
                        key={headCell.id}
                        align={'center'}
                        padding={'none'}
                        // style={{width:'5px'}}
                      >
                          {headCell.label}
                      </TableCell>
                    ))}
                    {/* {isAdmin && */}
                    <TableCell align={'center'} width={'130px'}>수정 / 삭제</TableCell> 
                    {/* } */}
                  </>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {resData.length > 0 && resData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.res_no);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      // key={row.res_no}
                      key={`row${index}`}
                      // selected={isItemSelected}
                    >
                      {isAdmin &&
                      <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                            color="primary"
                            onClick={event => handleClick(event, row.res_no)}
                          />
                      </TableCell>
                      }
                      {isWidthUp('md', props.width) &&
                      <>
                      <TableCell align="center" component="th" id={labelId} scope="row" padding="none" onClick={event=>openContentModal(row)}>
                        {/* {row.res_no} */}
                        {count-(index+page*rowsPerPage)}
                      </TableCell>
                      <TableCell align="center" onClick={event=>openContentModal(row)}>{row.res_code}</TableCell>
                      </>
                      }
                      <TableCell align="center" onClick={event=>openContentModal(row)} width={isWidthUp('md', props.width) ? '12%' : '30%'} 
                                className={`${classes.maxWidth}${classes.overflowCon}`}
                      >
                        {row.model_nm}
                      </TableCell>
                      {isWidthUp('md', props.width) &&
                      <>
                      <TableCell align="center" onClick={event=>openContentModal(row)}>{row.mark_code}</TableCell>
                      <TableCell align="center" onClick={event=>openContentModal(row)}>
                          {isEmpty(row.product_mtn)? "미설정" : row.product_mtn}
                      </TableCell>
                      <TableCell align="center" onClick={event=>openContentModal(row)}>
                          {isEmpty(row.purchase_mtn)? "미설정" : row.purchase_mtn}
                      </TableCell>
                      <TableCell align="center" onClick={event=>openContentModal(row)}>{row.display_size_code}</TableCell>
                      <TableCell align="center" onClick={event=>openContentModal(row)} width={'13%'} 
                                className={`${classes.maxWidth}${classes.overflowCon}`}
                      >
                        {row.serial_no}
                      </TableCell>
                      <TableCell align="center" onClick={event=>openContentModal(row)}>
                                          {isEmpty(row.mac_addr)? "미설정" : row.mac_addr}
                      </TableCell>
                      </>
                    }
                      <TableCell align="center" onClick={event=>openContentModal(row)}>{row.holder}</TableCell>
                      {/* 관리자의 경우 */}
                      <TableCell align="center">
                      {(isAdmin || memberNo === row.reg_id) &&
                      <>
                        <RouterLink button="true" to={"/resource/regist/?id="+row.res_no}>
                          <IconButton aria-label="delete" className={classes.margin} onClick={()=>handleEditClick(row.res_no)}>
                            <CreateIcon fontSize="small" />
                          </IconButton>
                        </RouterLink>
                        <IconButton aria-label="delete" className={classes.margin} onClick={()=>handleDeleteClick(row.res_no)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                      }
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        {/* </TableContainer> */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        </>
          :   (<Paper style={{minHeight : "300px", width:"100%", textAlign:"center"}} elevation={0} >
                  <h3 style={{paddingTop:"100px"}}> 
                      현재 자원 목록이 없습니다.
                  </h3>
              </Paper>)
      }
      </TableContainer>
      </Paper>
    </Fragment>
  );
}
export default withWidth()(ResourceListTable);