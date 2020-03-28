import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const CommonDialog = ({props, closeCommonDialog}) => {

	const handleClose = (title,result) => {
		closeCommonDialog(title,result);
	};

	return (
		<div>
		<Dialog
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			open={props.onOff===undefined?false:props.onOff}
		>
			<DialogTitle id="alert-dialog-title" style={{minWidth:'300px'}}>{props.title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{props.content}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				{props.isConfirm===undefined?false:props.isConfirm
					&&
					(<Button onClick={()=>handleClose(props.title,false)} color="primary">
						취소
					</Button>)
				}
				<Button onClick={()=>handleClose(props.title,true)} color="primary" autoFocus>
					확인
				</Button>
			</DialogActions>
		</Dialog>
		</div>
	);
}

export default CommonDialog
