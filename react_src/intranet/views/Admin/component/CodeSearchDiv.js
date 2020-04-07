import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { Divider, Button, Grid, Hidden } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

import { Link as RouterLink } from 'react-router-dom';

const useToolbarStyles = makeStyles(theme => ({
	root: {
		// justifyContent: 'flex-end',
		 '& > *': {
			margin: theme.spacing(1),
		},
		flexGrow: 1,
	},
	title: {
		flex: '1',
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	button: {
		marginRight: '10px',
	},
	loadingBar: {
		display: 'flex',
		'& > * + *': {
		marginLeft: theme.spacing(2),
		},
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
}));

export default function CodeSearchDiv(props) {
	console.log("codeSearchDiv");
	const classes = useToolbarStyles();
	const {condition, updateCondition, rootCodeAdd} = props;
	const [open, setOpen] = React.useState(false, []);

	const handleClickOpenSearch = (event) => {
		console.log("handleClickOpenSearch");
		setOpen(true);
	};
	const handleClose = () => {
		console.log("handleClose");
		setOpen(false);
	};

	const searchTypes = [
		{ value: "0", label: "전체"},
		{ value: "1", label: "코드ID"},
		{ value: "2", label: "코드명"},
		{ value: "3", label: "레벨"},
		{ value: "4", label: "상위코드"},
		{ value: "5", label: "최상위코드목록"},
	]

	// Dialog 값 상위 컴포넌트의 state값으로 초기화
	const initDialogState = {
		searchType: condition.searchType,
    	searchKeyword:    condition.searchKeyword,
	};
	// Dialog에서 취소버튼 클릭 시
	const handleClickCancel = () => {
		setDialogState(initDialogState);
		handleClose();
	}
	// Dialog에서 검색버튼 클릭 시
	// 상위 컴포넌트의 state를 갱신 처리 해줌
	const handleClickSearch = () => {
		var selectedSearchType = document.getElementsByName("searchType")[0].value;
		var inputkeyword = document.getElementsByName("searchKeyword")[0].value;
		
		//검색 조건이 전체 혹은 최상위 코드인 경우 키워드를 입력받지 않는다.
		if(!inputkeyword && (selectedSearchType !== "0" && selectedSearchType !== "5")){
			document.getElementsByName("searchKeyword")[0].focus();
			return;
		}

		updateCondition({
			searchType: 	document.getElementsByName("searchType")[0].value,
			searchKeyword:  document.getElementsByName("searchKeyword")[0].value,
		});
		
		
		
		var list = ["전체","코드ID","코드명","레벨","상위코드","최상위코드목록"];
		var txt = "검색 조건 : " + list[selectedSearchType] + ", 키워드 : " + document.getElementsByName("searchKeyword")[0].value;
		setSnackBarMessage(txt);
		setOpenSnackBar(true);
		handleClose();
	}

	
	// 검색 버튼 클릭 전, 임시로 값 저장
	const [dialogState, setDialogState] = React.useState(initDialogState);
	// searchType change
	const handleTypeChange= event => {
		setDialogState({
			...dialogState,
			searchType: event.target.value,
			searchKeyword: ""
		});
	};

	//keyword change
	const handleKeywordChange= (event) => {
		setDialogState({
			...dialogState,
			searchKeyword: event.target.value
		});
	};

	const handleClickAddCode = () => {
		rootCodeAdd();
	}
	
	const [openSnackBar, setOpenSnackBar] = React.useState(false);
	const [snackBarMessage , setSnackBarMessage] = React.useState('');

	const snackBarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnackBar(false);
	};

	return (
		<Fragment>
			<Snackbar
				anchorOrigin={{vertical: 'top',horizontal: 'center',}}
				onClose={snackBarClose}
				open={openSnackBar}
				message={snackBarMessage}
				action={
					<React.Fragment>
						<IconButton size="small" aria-label="close" color="inherit" onClick={snackBarClose}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</React.Fragment>
				}/>
		
		
			<Toolbar className={classes.root}>
				<Typography className={classes.title} color="secondary" variant="subtitle2">					
					코드 관리
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickOpenSearch} className={classes.button}>
							검색
						</Button>
					</Hidden>
					<Hidden mdUp>
						<IconButton color="primary" onClick={handleClickOpenSearch} className={classes.button}>
							<FilterListIcon />
						</IconButton>
					</Hidden>
				</div>
			</Toolbar>
			
			<Divider />

			{open && <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="sm">
				<DialogTitle id="form-dialog-title">검색</DialogTitle>
				<DialogContent>
					<DialogContentText>
						조건을 선택 및 입력 후, 하단의 검색버튼을 클릭해주세요.
					</DialogContentText>
					<Grid container justify="flex-start">
						<Grid item xs={6} style={{paddingRight: 10}}>
							<TextField
								id="searchType"
								name="searchType"
								margin="dense"
								placeholder="검색조건"
								label="검색조건"
								value={dialogState.searchType}
								onChange={handleTypeChange}
								select
								fullWidth>
								{searchTypes.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={6} style={{paddingRight: 10}}>
							<TextField
								label="검색어"
								id="searchKeyword"
								name="searchKeyword"
								placeholder="검색어"
								margin="dense"
								InputLabelProps={{
									shrink: true,
								}}
								InputProps={{
									readOnly: dialogState.searchType == "0" || dialogState.searchType == "5",
								}}
								value={dialogState.searchKeyword}
								type="search"
								onChange={handleKeywordChange}
								autoComplete="off"
								fullWidth
								// helperText="직책을 포함하여 넣어주세요."
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClickCancel} color="primary">
						취소
					</Button>
					<Button onClick={handleClickSearch} color="primary">
						검색
					</Button>
				</DialogActions>
			</Dialog> }
		</Fragment>
				
	);
}