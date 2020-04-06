import React from 'react';
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
// import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import Viewer from '../../../../common/Viewer/Viewer';


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
  appRoot: {
    width:'100%',
  },
  webRoot: {
    minWidth:'600px'
  },
  tableRoot: {
    width: '100%',
  },
  tableCell: {
    borderBottom : '0px'
  },
}));

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography style={{width:'90%'}} variant="h6">{children}</Typography>
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

// const DialogActions = withStyles(theme => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(1),
//   },
// }))(MuiDialogActions);

//다이얼 로그
const ContentModal = ({props, closeModal}) => {
  const [open, setOpen] = React.useState(false);

  //클래스까지 설정
  const classes = useStyles();
 
  const handleClose = () => {
    setOpen(false);
    closeModal(false);
  };

  return (
    <div>
     
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.openModal}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {props.title}
        </DialogTitle>
        <DialogContent dividers>
          {`작성자 : ${props.writer}`} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {`작성일 : ${props.reg_datetime}`}
          <div className={classes.appRoot}>
            <Viewer defaultValue={props.content}/>
          </div>
        </DialogContent>
        
      </Dialog>
    </div>
  );
}

export default ContentModal;