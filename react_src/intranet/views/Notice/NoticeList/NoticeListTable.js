import React, { useDebugValue, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
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

import CommonDialog from '../../../js/CommonDialog';
import ContentModal from '../component/ContentModal';

function createData(noticeNo, ResType, ModelName, Production, ProductYm, PurchaseYm, DisplaySize, SerialNo, MacAddr, Holder) {
    return { noticeNo, ResType, ModelName, Production, ProductYm, PurchaseYm, DisplaySize, SerialNo, MacAddr, Holder };
}
const headCells = [
  { id: 'noticeNo', label: '번호' },
  { id: 'title', label: '제목' },
  { id: 'regDatetime', label: '작성일' },
  { id: 'regId', label: '작성자' },
];

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
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
    margin: theme.spacing(1),
  },
}));

export default function NoticeListTable({resData, selectedNoticeNo, setNoticeData}) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState(resData);

  const [deleteRow, setDeleteRow] = React.useState(0);
  const [confirm, setConfirm] = React.useState({});

  const [openModal, setOpenModal] = React.useState({title:'', content:'', openModal:false});

  useEffect(()=>{
    console.log(`selected : ${selected}`);
  }, [selected])

  useEffect(()=>{
    // console.log(resData);
    setRows(resData);
  },[resData]);

  useEffect(()=>{
    localStorage.removeItem('noticeEditIndex');
  },[]);

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.noticeNo);
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
    selectedNoticeNo(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //개별 삭제 handler
  const handleDeleteClick = (noticeNo) => {
    // const index = rows.findIndex(res => res.noticeNo === noticeNo);
    // const newRows = [...rows];

    // if(index !== undefined){
    //   newRows.splice(index, 1);
    //   localStorage.setItem('noticeTestData', JSON.stringify(newRows));
    // }
    // setRows(newRows);

    setDeleteRow(noticeNo);
    handleOpenConfirm('공지사항', '선택항목을 삭제하시겠습니까?', true);
  }
  // confirm Open Handler
	const handleOpenConfirm = (title, content, isConfirm) => {
		return setConfirm({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}
	// confirm Close Handler
	const handleCloseConfirm = (result) => {
	  //삭제 처리
		setConfirm({title:'', content:'', onOff:false, isConfirm:false});
		return noticeDelete(result);
	}
  //localStorage resData  삭제 처리
	const noticeDelete = (result) => {
		if(result){
			const noticeData = JSON.parse(localStorage.noticeTestData);
			const upStreamData = noticeData.filter((row) => {
				return !(row.noticeNo === deleteRow);
			});
			localStorage.setItem('noticeTestData',JSON.stringify(upStreamData));
			setNoticeData(upStreamData);
		}
		return setDeleteRow(0);
	}


  const handleEditClick = (noticeNo) => {
    localStorage.setItem('noticeEditIndex', noticeNo);
  }

  const isSelected = noticeNo => selected.indexOf(noticeNo) !== -1;

   const openContentModal = (Title, Content) => {
      return setOpenModal({title:Title, content:Content, openModal:true});
  }


  const handleCloseModal = (trigger) => {
    return setOpenModal({title:'', content:'', openModal:trigger});
  }

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <CommonDialog props={confirm} closeCommonDialog={handleCloseConfirm}/>
	  {/* <ResourceListTool props={selected} /> */}
      <ContentModal props={openModal} closeModal={handleCloseModal}/>
      <CardContent className={classes.paper}>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size='medium'
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && rows.length < selected.length}
                    checked={rows.length === selected.length && rows.length !== 0}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all desserts' }}
                    color="primary"
                  />
                </TableCell>
                {headCells.map(headCell => (
                  <TableCell
                    key={headCell.id}
                    align={'center'}
                    padding={'default'}
                    // style={{minWidth:'100px'}}
                  >
                      {headCell.label}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { rows.length!==0 &&rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.noticeNo);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      // key={row.noticeNo}
                      key={`row${index}`}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          color="primary"
                          onClick={event => handleClick(event, row.noticeNo)}
                        />
                      </TableCell>
                      <TableCell align="center" component="th" id={labelId} scope="row" padding="none"
                                  onClick={event => openContentModal(row.title, row.content)} >
                        {row.majorYn ? '[중요]' : row.noticeNo}
                      </TableCell>
                      <TableCell align="center"  onClick={event => openContentModal(row.title, row.content)}>{row.title}</TableCell>
                      <TableCell align="center"  onClick={event => openContentModal(row.title, row.content)}>{row.regDatetime}</TableCell>
                      <TableCell align="center"  onClick={event => openContentModal(row.title, row.content)}>{row.regId}</TableCell>
                      {/* 관리자의 경우 */}
                      <TableCell align="center" style={{maxWidth:'80px'}}>
                        <IconButton aria-label="delete" className={classes.margin} onClick={()=>handleDeleteClick(row.noticeNo)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <RouterLink button="true" to="/notice/regist">
                          <IconButton aria-label="delete" className={classes.margin} onClick={()=>handleEditClick(row.noticeNo)}>
                            <CreateIcon fontSize="small" />
                          </IconButton>
                        </RouterLink>
                      </TableCell>
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
      </CardContent>
    </div>
  );
}
