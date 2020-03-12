import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  center: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
  table: {
    minWidth: 100,
    //maxWidth: 300
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          - 등록자 정보
        </Grid>
        <Grid item xs={12} sm={2}>
                            등록자명
        </Grid>
        <Grid item xs={12} sm={10}>
          <Input defaultValue="김준선" disabled inputProps={{ 'aria-label': 'description' }} />
        </Grid>
        <Grid item xs={12} sm={2}>
                          연락처/이메일
        </Grid>
        <Grid item xs={12} sm={10}>
          <Input defaultValue="010-0000-0000" disabled inputProps={{ 'aria-label': 'description' }} /> 
          / <Input defaultValue="test@gmail.com" disabled inputProps={{ 'aria-label': 'description' }} />
        </Grid>
        <Grid item xs={12} sm={12}>
                         - 경비  정보
        </Grid>
        <Grid item xs={12} sm={2}>
                          경비 유형
        </Grid>
        <Grid item xs={12} sm={4}> 
          <Input defaultValue="야간경비" disabled inputProps={{ 'aria-label': 'description' }} /> 
        </Grid>
        <Grid item xs={12} sm={2}>
          1차결재일
        </Grid>
        <Grid item xs={12} sm={4}> 
          <Input defaultValue="2020-03-01" disabled inputProps={{ 'aria-label': 'description' }} /> 
        </Grid>
        <Grid item xs={12} sm={2}>
                         진행상태
        </Grid>
        <Grid item xs={12} sm={4}> 
          <Input defaultValue="1차 결재완료" disabled inputProps={{ 'aria-label': 'description' }} /> 
        </Grid>
        <Grid item xs={12} sm={2}>
          2차결재일
        </Grid>
        <Grid item xs={12} sm={4}> 
          <Input defaultValue="" disabled inputProps={{ 'aria-label': 'description' }} /> 
        </Grid>
        <Grid item xs={12} sm={2}>
                            금액
        </Grid>
        <Grid item xs={12} sm={10}>
          <Input defaultValue="15,000" disabled inputProps={{ 'aria-label': 'description' }} /> 원
        </Grid>
        <Grid item xs={12} sm={2}>
                         등록일
        </Grid>
        <Grid item xs={12} sm={4}> 
          <Input defaultValue="2020-03-01" disabled inputProps={{ 'aria-label': 'description' }} /> 
        </Grid>
        <Grid item xs={12} sm={2}>
                          결제일
        </Grid>
        <Grid item xs={12} sm={4}> 
          <Input defaultValue="2020-02-20" disabled inputProps={{ 'aria-label': 'description' }} /> 
        </Grid>
        <Grid item xs={12} sm={2}>
                          내용
        </Grid>
        <Grid item xs={12} sm={10}> 
          <TextField
            id="outlined-multiline-static"
            disabled
            multiline
            rows="4"
            defaultValue=""
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
                          사진
        </Grid>
        <Grid item xs={12} sm={4}> 
          <img src="http://cafefiles.naver.net/20091123_20/ippoom2_1258970814632O7W2g_jpg/i8mqtlp05mmg18_n00489_ippoom2.jpg" style={{width:200}} />
        </Grid>
        <Grid item xs={12} sm={2}>
                     
        </Grid>
        <Grid item xs={12} sm={4} className={classes.left}> 
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                  <TableCell align="center">1차 결재자</TableCell>
                  <TableCell align="center">2차 결재자</TableCell>
              </TableHead>
              <TableBody>
                    <TableCell align="center">조현철</TableCell>
                    <TableCell align="center"></TableCell>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        
      </Grid>
      <div style={{height:20}}/>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} className={classes.left}>
          <Button variant="contained">이전</Button>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.right}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
                            결제
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={handleClickOpen}
          >
                          반려
          </Button>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        {/* <DialogTitle id="form-dialog-title">반려 처리</DialogTitle> */}
        <DialogContent>
          <DialogContentText>
                               반려사유를 입력해주세요.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
                            취소
          </Button>
          <Button onClick={handleClose} color="primary">
                            반려
          </Button>
        </DialogActions>
      </Dialog>
    </div>);
}