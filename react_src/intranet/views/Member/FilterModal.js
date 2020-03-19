import React from 'react';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    minWidth: '400px',
    minHeight: '500px',
  },
}))(MuiDialogContent);

//다이얼 로그
const FilterModal = ({props,closeModal}) => {
  const [open, setOpen] = React.useState(false);

  console.log("test : " + JSON.stringify(props));

  const handleClose = () => {
    setOpen(false);
    closeModal(false);
  };
  
  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.openModal}>
        <DialogTitle id="form-dialog-title" onClose={handleClose}>
		      직원검색
        </DialogTitle>
        <DialogContent dividers>
          
        </DialogContent>
        
      </Dialog>
    </div>
  );
}

export default FilterModal;
