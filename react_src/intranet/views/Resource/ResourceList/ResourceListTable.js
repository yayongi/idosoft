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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { Link as RouterLink } from 'react-router-dom';

// import ResourceListTool from './ResourceListTool';

function createData(ResNo, ResType, ModelName, Production, ProductYm, PurchaseYm, DisplaySize, SerialNo, MacAddr, Holder) {
  return { ResNo, ResType, ModelName, Production, ProductYm, PurchaseYm, DisplaySize, SerialNo, MacAddr, Holder };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  if(array.length > 0){
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }
}

const headCells = [
  { id: 'resNo', numeric: true, disablePadding: false, label: '번호' },
  { id: 'resCode', numeric: false, disablePadding: false, label: '자원종류' },
  { id: 'modelNm', numeric: false, disablePadding: false, label: '모델명' },
  { id: 'markCode', numeric: false, disablePadding: false, label: '제조사' },
  { id: 'productMtn', numeric: false, disablePadding: false, label: '제조년월' },
  { id: 'purchaseMtn', numeric: false, disablePadding: false, label: '구입년월' },
  { id: 'displaySizeCode', numeric: false, disablePadding: false, label: '화면크기' },
  { id: 'serialNo', numeric: false, disablePadding: false, label: '시리얼번호주소' },
  { id: 'macAddr', numeric: false, disablePadding: false, label: 'Mac' },
  { id: 'holder', numeric: false, disablePadding: false, label: '보유자' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
            color="primary"
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            // style={{minWidth:'120px'}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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

export default function ResourceListTable({resData, selectedResNo}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('resNo');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const [rows, setRows] = React.useState(JSON.parse(localStorage.getItem('resData')));
  const [rows, setRows] = React.useState(resData);

  useEffect(()=>{
    setRows(resData);
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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
    const index = rows.findIndex(res => res.resNo === resNo);
    const newRows = [...rows];

    if(index !== undefined){
      newRows.splice(index, 1);
      localStorage.setItem('resData', JSON.stringify(newRows));
    }
    setRows(newRows);
  }

  const handleEditClick = (resNo) => {
    localStorage.setItem('resEditIndex', resNo);
  }

  const isSelected = resNo => selected.indexOf(resNo) !== -1;

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
	  {/* <ResourceListTool props={selected} /> */}
      <CardContent className={classes.paper}>
        {/* <CardContent > */}
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size='medium'
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.length > 0 && stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.resNo);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.resNo}
                      selected={isItemSelected}
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
