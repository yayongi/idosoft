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
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';

import TextField from '@material-ui/core/TextField';

import {isEmpty} from '../../../js/util';

const styles = theme => ({
  root: {
    margin: 0,
    // padding: theme.spacing(2),
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
    width: '100%',
    border: '1px'
  },
  tableCell: {
    maxWidth: '120px',
    width: '33%',
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
    // minWidth: '400px',
    // minHeight: '500px',
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    // padding: theme.spacing(1),
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
            <Table className={classes.tableRoot} aria-label="simple table" stickyHeader key={"1"}>
              <TableHead>
                  <TableCell  align={"center"} className={classes.tableCell}>종류</TableCell>
                  <TableCell  align={"center"} className={classes.tableCell}>모델명</TableCell>
                  <TableCell  align={"center"} className={classes.tableCell}>제조사</TableCell>
              </TableHead>
              <TableBody>
                  <TableCell align={"center"}> {props.resData.res_code}</TableCell>
                  <TableCell align={"center"}> {props.resData.model_nm} </TableCell>
                  <TableCell align={"center"}> {props.resData.mark_code}</TableCell>
              </TableBody>
            </Table>
            <br/>
            <br/>
            <Table className={classes.tableRoot} aria-label="simple table" stickyHeader key={"2"}>
              <TableHead>
                  <TableCell  align={"center"} className={classes.tableCell}>제조년월</TableCell>
                  <TableCell  align={"center"} className={classes.tableCell}>구입년월</TableCell>
                  <TableCell  align={"center"} className={classes.tableCell}>화면크기</TableCell>
              </TableHead>
              <TableBody>
                  <TableCell align={"center"}> {props.resData.product_mtn === null ? "미등록" : props.resData.product_mtn}</TableCell>
                  <TableCell align={"center"}> {props.resData.purchase_mtn === null ? "미등록" : props.resData.purchase_mtn} </TableCell>
                  <TableCell align={"center"}> {props.resData.display_size_code}</TableCell>
              </TableBody>
            </Table>
            <br/>
            <br/>
            <Table className={classes.tableRoot} aria-label="simple table" stickyHeader key={"3"}>
              <TableHead>
                  <TableCell  align={"center"} style={{maxWidth:'120px'}} >시리얼번호</TableCell>
                  <TableCell  align={"center"} style={{maxWidth:'120px'}} className={classes.tableCell}>MAC주소</TableCell>
                  <TableCell  align={"center"} className={classes.tableCell}>보유자</TableCell>
              </TableHead>
              <TableBody>
                  <TableCell align={"center"} > {props.resData.serial_no}</TableCell>
                  <TableCell align={"center"} > {props.resData.mac_addr === "" ? "미등록" : props.resData.mac_addr} </TableCell>
                  <TableCell align={"center"}> {props.resData.holder}</TableCell>
              </TableBody>
            </Table>
            </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ContentModal;