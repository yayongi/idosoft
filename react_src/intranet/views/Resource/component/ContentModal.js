import React,{Fragment} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';

import {isEmpty} from '../../../js/util';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles(theme => ({
  root: {
	  width:'100%',
  },
  tableRoot: {
    width: '80%',
    border: '1px'
  },
  tableCell: {
    borderBottom : '0px'
  }
}));

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    minWidth: '400px',
    minHeight: '500px',
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

//다이얼 로그
const ContentModal = ({props, closeModal}) => {
  const [open, setOpen] = React.useState(false);

  //클래스까지 설정
  const classes = useStyles();
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  const handleClose = () => {
    setOpen(false);
    closeModal(false);
  };

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.openModal}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          자원정보 상세보기
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer className={classes.container}>
          <Table className={classes.tableRoot} aria-label="sticky table">
            <TableBody>
              <TableRow hover>
                <TableCell className={classes.tableCell} align={"left"}>번호</TableCell>
                <TableCell className={classes.tableCell}> {props.resData.res_no}</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell className={classes.tableCell} align={"left"}>종류</TableCell>
                <TableCell className={classes.tableCell}> {props.resData.res_code}</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell className={classes.tableCell} align={"left"}>모델명</TableCell>
                <TableCell className={classes.tableCell}> {props.resData.model_nm} </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell className={classes.tableCell} align={"left"}>제조사</TableCell>
                <TableCell className={classes.tableCell}> {props.resData.mark_code}</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell className={classes.tableCell} align={"left"}>제조일</TableCell>
                <TableCell className={classes.tableCell}> {props.resData.product_mtn}</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell className={classes.tableCell} align={"left"}>구입일</TableCell>
                <TableCell className={classes.tableCell}> {props.resData.purchase_mtn}</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell className={classes.tableCell} align={"left"}>화면크기</TableCell>
                <TableCell className={classes.tableCell}> {props.resData.display_size_code}</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell className={classes.tableCell} align={"left"}>시리얼번호</TableCell>
                <TableCell className={classes.tableCell}> {props.resData.serial_no}</TableCell>
              </TableRow>
              <TableRow hover> 
                <TableCell className={classes.tableCell} align={"left"}>MAC주소</TableCell>
                <TableCell className={classes.tableCell}> {props.resData.mac_addr}</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell className={classes.tableCell} align={"left"}>보유자</TableCell>
                <TableCell className={classes.tableCell}> {props.resData.holder}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ContentModal;