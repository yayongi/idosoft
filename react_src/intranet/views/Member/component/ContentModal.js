import React from 'react';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import { Button, Hidden } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import { getRootPath } from '../../../js/util';

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
    //minWidth: '400px',
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

  // 상세화면 이돋하기
	const goDetail = (member_no,manager_yn) => {
    const {routeProps} = props;
		let url = "";
		if(manager_yn == 1){
			url = "/member/membermod/admin/";
		}else{
			url = "/member/membermod/user/";
		}

		routeProps.history.push(url + member_no);
	}

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.openModal}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
		      {props.name} {props.position_name}의 정보
        </DialogTitle>
        <DialogContent dividers>
          <Toolbar>
            <div className={classes.container}>
              <Hidden smDown>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <div style={{textAlign:'-webkit-center'}}>
                      <img id="profileImg" src={props.photo_path != null ? getRootPath() + "/resources/profile/" + props.photo_path : getRootPath() + "/resources/img/noImg.jpg"} className={classes.large} style={{borderRadius: "70%"}}/>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            {props.phone_num}
                        </Grid>
                        <Grid item xs={12}>
                            {props.email}
                        </Grid>
                        <Grid item xs={12}>
                            {props.address_1}
                        </Grid>
                        <Grid item xs={12}>
                            {props.address_2}
                        </Grid>
                        <Grid item xs={12}>
                                                        입사일 : {props.entry_date}
                        </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Hidden>
              <Hidden mdUp>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <div style={{textAlign:'-webkit-center'}}>
                      <img id="profileImg" src={props.photo_path != null ? getRootPath() + "/resources/profile/" + props.photo_path : getRootPath() + "/resources/img/noImg.jpg"} className={classes.large} style={{borderRadius: "70%"}}/>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    {props.phone_num}
                  </Grid>
                  <Grid item xs={12}>
                    {props.email}
                  </Grid>
                  <Grid item xs={12}>
                    {props.address_1}
                  </Grid>
                  <Grid item xs={12}>
                    {props.address_2}
                  </Grid>
                  <Grid item xs={12}>
                                        입사일 : {props.entry_date}
                  </Grid>
                </Grid>
              </Hidden>
            </div>
          </Toolbar>
        </DialogContent>
        <DialogActions>
          {props.buttonName !== "" && (
          <Button autoFocus color="primary" onClick={() => goDetail(props.member_no,props.manager_yn)}>
            {props.buttonName}
          </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ContentModal;
