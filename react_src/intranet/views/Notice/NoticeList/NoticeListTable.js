import React, { Fragment, useEffect, useState } from 'react';
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
import Paper from '@material-ui/core/Paper';
import { Link as RouterLink } from 'react-router-dom';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import CommonDialog from '../../../js/CommonDialog';
import ContentModal from '../component/ContentModal';
import { isEmpty } from '../../../js/util';
import Moment from "moment"

import axios from 'axios';

const headCells = [
  { id: 'board_no', label: '번호' },
  { id: 'title', label: '제목' },
  { id: 'reg_datetime', label: '작성일' },
  { id: 'writer', label: '작성자' },
];

const columnsUp = [
  { id: 'board_no', label: '번호' },
  { id: 'title', label: '제목' },
  { id: 'reg_datetime', label: '작성일' },
  { id: 'writer', label: '작성자' },
];

const columnsDown = [
  { id: 'title', label: '제목' },
  { id: 'writer', label: '작성자' },
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

function NoticeListTable(props) {
  const classes = useStyles();
  const {
          count,
          setCount,
          setNoticeData,
          noticeData,
          selectedNoticeNo,
          page,
          setPage,
          rowsPerPage,
          setRowsPerPage
  } = props;

  // Width에 따라 반응형으로 열이 보여지는 개수 조정
  let columns = columnsUp;
  if(isWidthUp('md', props.width)) {
    columns =columnsUp;
  } else {
    columns =columnsDown;
  }

  const [selected, setSelected] = React.useState([]);
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState(noticeData);

  const [deleteRow, setDeleteRow] = React.useState(0);
  const [confirm, setConfirm] = React.useState({});

  const [openModal, setOpenModal] = React.useState({title:'', content:'', openModal:false});

  // useEffect(()=>{
  //   console.log(`selected : ${selected}`);
  // }, [selected])

  useEffect(()=>{
    setRows(noticeData);
  },[noticeData]);

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.board_no);
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
  const handleDeleteClick = (board_no) => {
    setDeleteRow(board_no);
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
      axios({
				url: '/intranet/notice/delete',
				method : 'post',
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
        },
        data:{
          board_no : deleteRow
        },
				}).then(response => {
					console.log(response.data);
          setCount(count-1);
				}).catch(e => {
					console.log(e);
			});

			const upStreamData = noticeData.filter((row) => {
				return !(row.board_no === deleteRow);
			});
			setNoticeData(upStreamData);
		}
		return setDeleteRow(0);
	}


  const handleEditClick = (board_no) => {
    localStorage.setItem('noticeEditIndex', board_no);
  }

  const isSelected = board_no => selected.indexOf(board_no) !== -1;

  const openContentModal = (title, Content, writer, reg_datetime) => {
      return setOpenModal({title:title, content:Content, writer:writer, reg_datetime:reg_datetime, openModal:true});
  }

  const handleCloseModal = (trigger) => {
    return setOpenModal({title:'', content:'', openModal:trigger});
  }

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const nowDate = Moment(new Date()).format('YYYYMMDD');

	const dateStr = (date) => {
		return date.substr(0,4)+date.substr(5,2)+date.substr(8,2);
	}

  return (
     <div className={classes.root}>
      <CommonDialog props={confirm} closeCommonDialog={handleCloseConfirm}/>
      <ContentModal props={openModal} closeModal={handleCloseModal}/>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
        {!isEmpty(noticeData) &&
        <>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <Table
          // className={classes.table}
          aria-labelledby="tableTitle"
          // size='medium'
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && rows.length < selected.length}
                  checked={noticeData.length === selected.length && noticeData.length !== 0}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all desserts' }}
                  color="primary"
                />
              </TableCell>
              {isWidthUp('md', props.width) &&
                <>
                {columns.map(headCell => (
                  <TableCell
                    key={headCell.id}
                    align={'center'}
                    padding={'default'}
                  >
                      {headCell.label}
                  </TableCell>
                ))}
                <TableCell align={'center'}>수정 / 삭제</TableCell>
              </>
              }
              {!isWidthUp('md', props.width) &&
                <>
                {columns.map(headCell => (
                  <TableCell
                    key={headCell.id}
                    align={'center'}
                    padding={'none'}
                  >
                      {headCell.label}
                  </TableCell>
                ))}
                <TableCell align={'center'}>수정 / 삭제</TableCell>
              </>
              }
            </TableRow>
          </TableHead>
          <TableBody>
            { noticeData.length!==0 &&noticeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.board_no);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    // key={row.board_no}
                    key={`row${index}`}
                    // selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                        color="primary"
                        onClick={event => handleClick(event, row.board_no)}
                      />
                    </TableCell>
                    {isWidthUp('md', props.width) &&
                    <>
                    <TableCell align="center" component="th" id={labelId} scope="row" padding="none"
                                onClick={event => openContentModal(row.title, row.content, row.writer, row.reg_datetime)} >
                              {row.major_yn && eval(nowDate <= row.major_period_date) ? '[중요]' : row.board_no}
                    </TableCell>
                    </>
                    }
                    <TableCell align="center"  onClick={event => openContentModal(row.title, row.content, row.writer, row.reg_datetime)}>
                      {row.title}
                    </TableCell>
                    {isWidthUp('md', props.width) &&
                    <>
                    <TableCell align="center"  onClick={event => openContentModal(row.title, row.content, row.writer, row.reg_datetime)}>
                      {row.reg_datetime}
                    </TableCell>
                    </>
                    }
                    <TableCell align="center"  onClick={event => openContentModal(row.title, row.content, row.writer, row.reg_datetime)}>
                      {row.writer}
                    </TableCell>
                    {/* 관리자의 경우 */}
                    <TableCell align="center">
                      <IconButton aria-label="delete" className={classes.margin} onClick={()=>handleDeleteClick(row.board_no)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <RouterLink button="true" to={"/notice/regist/?id="+row.board_no}>
                        <IconButton aria-label="delete" className={classes.margin} onClick={()=>handleEditClick(row.board_no)}>
                          <CreateIcon fontSize="small" />
                        </IconButton>
                      </RouterLink>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
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
        }
        </TableContainer>
      </Paper>
    </div>
  );
}
export default withWidth()(NoticeListTable);