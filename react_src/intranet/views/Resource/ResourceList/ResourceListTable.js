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
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import axios from 'axios';

import CommonDialog from '../../../js/CommonDialog';

const headCells = [
  { id: 'res_no', label: '번호' },
  { id: 'res_code', label: '자원종류' },
  { id: 'model_nm', label: '모델명' },
  { id: 'mark_code', label: '제조사' },
  { id: 'product_mtn', label: '제조년월' },
  { id: 'purchase_mtn', label: '구입년월' },
  { id: 'display_size_code', label: '화면크기' },
  { id: 'serial_no', label: 'Serial번호' },
  { id: 'mac_addr', label: 'Mac주소' },
  { id: 'holder', label: '보유자' },
];
const columnsUp = [
      { id: 'res_no', label: '번호' },
      { id: 'res_code', label: '자원종류' },
      { id: 'model_nm', label: '모델명' },
      { id: 'mark_code', label: '제조사' },
      { id: 'product_mtn', label: '제조년월' },
      { id: 'purchase_mtn', label: '구입년월' },
      { id: 'display_size_code', label: '화면크기' },
      { id: 'serial_no', label: 'Serial번호' },
      { id: 'mac_addr', label: 'Mac주소' },
      { id: 'holder', label: '보유자' },
    ];

const columnsDown = [
      { id: 'res_no', label: '번호' },
      { id: 'model_nm', label: '모델명' },
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

function ResourceListTable({resData, selectedResNo, setResData}, props) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState(resData);
  const [deleteRow, setDeleteRow] = React.useState(0);
  const [confirm, setConfirm] = React.useState({});

  // Width에 따라 반응형으로 열이 보여지는 개수 조정
  let columns = columnsUp;
  // if(isWidthUp('md', props.width)) {
  //   columns =columnsUp;
  // } else {
  //   columns =columnsDown;
  // }

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
      const newSelecteds = rows.map(n => n.res_no);
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
  const handleDeleteClick = (res_no) => {
    setDeleteRow(res_no);
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
					console.log(response);
					console.log(JSON.stringify(response));
				}).catch(e => {
					console.log(e);
			});
			const upStreamData = resData.filter((row) => {
				return !(row.res_no === deleteRow);
			});
			setResData(upStreamData);
		}
		return setDeleteRow(0);
	}

  const handleEditClick = (res_no) => {
    localStorage.setItem('resEditIndex', res_no);
  }

  const isSelected = res_no => selected.indexOf(res_no) !== -1;
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
                {columns.map(headCell => (
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
                      <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                            color="primary"
                            onClick={event => handleClick(event, row.res_no)}
                          />
                      </TableCell>
                      <TableCell align="center" component="th" id={labelId} scope="row" padding="none">
                        {row.res_no}
                      </TableCell>
                      <TableCell align="center">{row.res_code}</TableCell>
                      <TableCell align="center">{row.model_nm}</TableCell>
                      <TableCell align="center">{row.mark_code}</TableCell>
                      <TableCell align="center">
                          {row.product_mtn !== undefined && row.product_mtn !== null ? row.product_mtn.substr(0,4)+'-'+row.product_mtn.substr(4,6) : "미설정"}
                      </TableCell>
                      <TableCell align="center">
                          {row.purchase_mtn !== undefined && row.purchase_mtn !== null ? row.purchase_mtn.substr(0,4)+'-'+row.purchase_mtn.substr(4,6) : "미설정"}
                      </TableCell>
                      <TableCell align="center">{row.display_size_code}</TableCell>
                      <TableCell align="center">{row.serial_no}</TableCell>
                      <TableCell align="center">{row.mac_addr}</TableCell>
                      <TableCell align="center">{row.holder}</TableCell>
                      {/* 관리자의 경우 */}
                      <TableCell align="center">
                        <IconButton aria-label="delete" className={classes.margin} onClick={()=>handleDeleteClick(row.res_no)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <RouterLink button="true" to={"/resource/regist/?id="+row.res_no}>
                          <IconButton aria-label="delete" className={classes.margin} onClick={()=>handleEditClick(row.res_no)}>
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
export default withWidth()(ResourceListTable);