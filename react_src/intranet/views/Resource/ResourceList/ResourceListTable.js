import React, { useDebugValue, useEffect, useState } from 'react';
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

function createData(ResNo, ResType, ModelName, Production, ProductYm, PurchaseYm, DisplaySize, SerialNo, MacAddr, Holder) {
    return { ResNo, ResType, ModelName, Production, ProductYm, PurchaseYm, DisplaySize, SerialNo, MacAddr, Holder };
}
const headCells = [
  { id: 'resNo', label: '번호' },
  { id: 'resCode', label: '자원종류' },
  { id: 'modelNm', label: '모델명' },
  { id: 'markCode', label: '제조사' },
  { id: 'productMtn', label: '제조년월' },
  { id: 'purchaseMtn', label: '구입년월' },
  { id: 'displaySizeCode', label: '화면크기' },
  { id: 'serialNo', label: '시리얼번호주소' },
  { id: 'macAddr', label: 'Mac' },
  { id: 'holder', label: '보유자' },
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

export default function ResourceListTable({resData, selectedResNo, setResData}) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState(resData);
  const [deleteRow, setDeleteRow] = React.useState(0);
  const [confirm, setConfirm] = React.useState({});

  useEffect(()=>{
    console.log(`selected : ${selected}`);
  }, [selected])

  useEffect(()=>{
    setRows(resData);
    setSelected([]);
  },[resData]);

  useEffect(()=>{
    localStorage.removeItem('resEditIndex');
  },[]);

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.resNo);
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
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //개별 삭제 handler
  const handleDeleteClick = (resNo) => {
    setDeleteRow(resNo);
    handleOpenConfirm('자원관리', '선택항목을 삭제하시겠습니까?', true);
  }
  // confirm Open Handler
	const handleOpenConfirm = (title, content, isConfirm) => {
		return setConfirm({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}
	// confirm Close Handler
	const handleCloseConfirm = (result) => {
		//엑셀, 선택삭제 처리
		setConfirm({title:'', content:'', onOff:false, isConfirm:false});
		return resDelete(result);
		
	}
  //localStorage resData  삭제 처리
	const resDelete = (result) => {
		if(result){
			const resData = JSON.parse(localStorage.resData);
			const upStreamData = resData.filter((row) => {
				return !(row.resNo === deleteRow);
			});
			localStorage.setItem('resData',JSON.stringify(upStreamData));
			setResData(upStreamData);
		}
		return setDeleteRow(0);
	}

  const handleEditClick = (resNo) => {
    localStorage.setItem('resEditIndex', resNo);
  }

  const isSelected = resNo => selected.indexOf(resNo) !== -1;
  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <CommonDialog props={confirm} closeCommonDialog={handleCloseConfirm}/>
	  {/* <ResourceListTool props={selected} /> */}
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
                    checked={rows.length === selected.length}
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
                    style={{minWidth:'100px'}}
                  >
                      {headCell.label}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.resNo);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      // key={row.resNo}
                      key={`row${index}`}
                      // selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          color="primary"
                          onClick={event => handleClick(event, row.resNo)}
                        />
                      </TableCell>
                      <TableCell align="center" component="th" id={labelId} scope="row" padding="none">
                        {row.resNo}
                      </TableCell>
                      <TableCell align="center">{row.resCode}</TableCell>
                      <TableCell align="center">{row.modelNm}</TableCell>
                      <TableCell align="center">{row.markCode}</TableCell>
                      <TableCell align="center">{row.productMtn}</TableCell>
                      <TableCell align="center">{row.purchaseMtn}</TableCell>
                      <TableCell align="center">{row.displaySizeCode}</TableCell>
                      <TableCell align="center">{row.serialNo}</TableCell>
                      <TableCell align="center">{row.macAddr}</TableCell>
                      <TableCell align="center">{row.holder}</TableCell>
                      {/* 관리자의 경우 */}
                      <TableCell align="center">
                        <IconButton aria-label="delete" className={classes.margin} onClick={()=>handleDeleteClick(row.resNo)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <RouterLink button="true" to="/resource/regist">
                          <IconButton aria-label="delete" className={classes.margin} onClick={()=>handleEditClick(row.resNo)}>
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
