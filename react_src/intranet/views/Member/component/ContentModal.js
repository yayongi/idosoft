import React from 'react';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { Link as RouterLink, } from 'react-router-dom';
import { positionFormatter } from '../../../js/util';

const pathProfile = "C:\\Users\\SeongwooKang\\git\\idosoft_br\\react_src\\intranet\\img\\profile\\";

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
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  large: {
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
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

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    closeModal(false);
  };

  const setLocalstorage = (datum) => {
		//기존 스토리지에 있는 데이터 삭제.
		localStorage.removeItem('savedData');
		//수정 페이지로 이동할 때 필요한 데이터 함께 이동 
		localStorage.setItem('savedData', JSON.stringify(datum));
  }

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.openModal}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
		      {props.name} {positionFormatter(props.position)}의 정보
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={6}>
               <div style={{textAlign:'-webkit-center'}}>
                  <Avatar src={props.photo_path != undefined ? pathProfile + props.photo_path : ""} className={classes.large} />
                </div>
            </Grid>
            <Grid item xs={6}>
               <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {props.email}
                  </Grid>
                  <Grid item xs={12}>
                      {props.address1}
                  </Grid>
                  <Grid item xs={12}>
                      {props.address2}
                  </Grid>
               </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {props.buttonName !== "" && (
            <RouterLink button="true" to={props.manager_yn? "/member/membermod/admin":"/member/membermod/user"}>
              <Button autoFocus color="primary" onClick={() => setLocalstorage(props.datum)}>
                {props.buttonName}
              </Button>
            </RouterLink>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ContentModal;
