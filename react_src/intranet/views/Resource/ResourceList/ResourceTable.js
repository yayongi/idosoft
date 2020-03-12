import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';


import SelectType from '../component/SelectType';
import InputSearch from '../component/InputSearch';

function createData(ResNo, ResType, ModelName, Production, ProductYm, PurchaseYm, DisplaySize, SerialNo, MacAddr, Holder) {
  return { ResNo, ResType, ModelName, Production, ProductYm, PurchaseYm, DisplaySize, SerialNo, MacAddr, Holder };
}

const rows = [
  createData(1, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '김준선'),
  createData(2, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '유기환'),
  createData(3, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '유기환'),
  createData(4, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '유기환'),
  createData(5, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '김준선'),
  createData(6, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '유기환'),
  createData(7, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '유기환'),
  createData(8, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '유기환'),
  createData(9, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '김준선'),
  createData(10, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '유기환'),
  createData(11, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '유기환'),
  createData(12, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '유기환'),
  createData(13, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '김준선'),
  createData(14, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '유기환'),
  createData(15, '모니터', 'sdfsdf120g-asf', 'LG', '2001-03', '2005-06', '24인치', 'SDFS4412FDS', 'ADFSDF11124DSF', '김준선'),
];

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
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const headCells = [
  { id: 'ResNo', numeric: true, disablePadding: false, label: '번호' },
  { id: 'ResType', numeric: false, disablePadding: false, label: '자원종류' },
  { id: 'ModelName', numeric: false, disablePadding: false, label: '모델명' },
  { id: 'Production', numeric: false, disablePadding: false, label: '제조사' },
  { id: 'ProductYm', numeric: false, disablePadding: false, label: '제조년월' },
  { id: 'PurchaseYm', numeric: false, disablePadding: false, label: '구입년월' },
  { id: 'DisplaySize', numeric: false, disablePadding: false, label: '화면크기' },
  { id: 'SerialNo', numeric: false, disablePadding: false, label: '시리얼번호주소' },
  { id: 'MacAddr', numeric: false, disablePadding: false, label: 'Mac' },
  { id: 'Holder', numeric: false, disablePadding: false, label: '보유자' },
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
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
			      // align={headCell.numeric ? 'right' : 'left'}
			      align="center"
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
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

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
	<div>
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
			    자원관리
        </Typography>
      )}
      {numSelected > 0 ? (
      <div>
          <Tooltip title="Delete" color="white">
            <IconButton aria-label="delete" color="secondary" size="large">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" color="primary">
            엑셀 내보내기
          </Button>
      </div>
      ) : (
        <Tooltip title="Add" aria-label="add">
          <Fab color="primary">
            <AddIcon />
          </Fab>
		    </Tooltip>
      )}
    </Toolbar>
    <Toolbar>
    </Toolbar>
	  <Toolbar>
		  <SelectType/>
		  <InputSearch/>
    </Toolbar>
	</div>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
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
}));

export default function ResourceTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('ResType');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.ResNo);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, ResNo) => {
    const selectedIndex = selected.indexOf(ResNo);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, ResNo);
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
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };

  const isSelected = ResNo => selected.indexOf(ResNo) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
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
              {stableSort(rows, getComparator(order, orderBy))
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.ResNo);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.ResNo)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.ResNo}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell align="center" component="th" id={labelId} scope="row" padding="none">
                        {row.ResNo}
                      </TableCell>
                      <TableCell align="center">{row.ResType}</TableCell>
                      <TableCell align="center">{row.ModelName}</TableCell>
                      <TableCell align="center">{row.Production}</TableCell>
                      <TableCell align="center">{row.ProductYm}</TableCell>
                      <TableCell align="center">{row.PurchaseYm}</TableCell>
                      <TableCell align="center">{row.DisplaySize}</TableCell>
                      <TableCell align="center">{row.SerialNo}</TableCell>
                      <TableCell align="center">{row.MacAddr}</TableCell>
                      <TableCell align="center">{row.Holder}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
      </Paper>
      
    </div>
  );
}