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

import { Link as RouterLink } from 'react-router-dom';

import { LoadingBar } from './utils';

import axios from 'axios';
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
	
	const classes = useToolbarStyles();
	const {condition, updateCondition} = props;
	const [open, setOpen] = React.useState(false);
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
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
		updateCondition({
			searchType: document.getElementsByName("searchType")[0].value,
			searchKeyword:    (document.getElementsByName("searchKeyword")[0]).value,
		});
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
	const handleKeywordChange= event => {
		var selectedSearchType = document.getElementsByName("searchType")[0].value;

		if(!selectedSearchType || selectedSearchType === "0"){
			alert("검색조건을 선택해주세요");
			return;
		}

		setDialogState({
			...dialogState,
			searchKeyword: event.target.value
		});
	};


	
	//dummy add
	const handleClickDummyAdd = () => {
		console.log("startLoading");
		setShowLoadingBar(true);
		axios({
			url: '/intranet/login',
			method: 'post',
			data: {}
		}).then(response => {
			setShowLoadingBar(false);
			console.log('로그인 여부' + JSON.stringify(response));	
		}).catch(e => {
			setShowLoadingBar(false);
		});

	}

	return (
		<Fragment>
			<LoadingBar open={isShowLoadingBar}/>
			<Toolbar className={classes.root}>
				<Typography className={classes.title} color="secondary" variant="subtitle2">					
					코드 관리
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickOpen} className={classes.button}>
							검색
						</Button>
						<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickDummyAdd}>
							더미추가
						</Button>
						<RouterLink button="true" to="/admin/modifyCode/new">
							<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} >
								코드추가
							</Button>
						</RouterLink>	
					</Hidden>
					<Hidden mdUp>
						<IconButton color="primary" onClick={handleClickOpen} className={classes.button}>
							<FilterListIcon />
						</IconButton>
						<RouterLink button="true" to="/admin/modifyCode/new">
							<IconButton color="primary">
								<AddIcon />
							</IconButton>
						</RouterLink>
					</Hidden>
				</div>
			</Toolbar>
			
			<Divider />

			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="sm">
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
								select
								margin="dense"
								placeholder="검색조건"
								label="검색조건"
								value={dialogState.searchType}
								onChange={handleTypeChange}
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
								value={dialogState.searchKeyword}
								type="search"
								onChange={handleKeywordChange}
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
			</Dialog>
		</Fragment>
				
	);
}