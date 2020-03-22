import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { Divider, Button, Grid, Hidden } from '@material-ui/core';

import { getSiteInfoDB } from '../../data';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';

import { Link as RouterLink } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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
	}
}));

/*
	경비관리목록 검색영역
*/
export default function ProjectSearchDiv(props) {
	
	const classes = useToolbarStyles();
	const [open, setOpen] = React.useState(false);
	const {condition, updateCondition} = props;
	
	const searchTypes = [
		{ value: "0", label: "전체"},
		{ value: "1", label: "연도"},
		{ value: "2", label: "기관"},
	]
	// Dialog 값 상위 컴포넌트의 state값으로 초기화
	const initDialogState = {
		searchType: searchTypes,
		searchDetailType: "",
		searchDetailTypes: []
	};
	const [dialogState, setDialogState] = React.useState(initDialogState);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
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
			searchType: 		document.getElementsByName("searchType")[0].value,
			searchDetailType:  (document.getElementsByName("searchDetailType")[0]).value,
		});
		handleClose();
	}

	
	// searchType change
	const handleTypeChange= event => {
		var searchDetailTypeList = [];
		switch(event.target.value){
			case "0" :
				break;
			case "1" :
				var projectInfoList = JSON.parse(localStorage.getItem("resProjData"));
				var start_year = projectInfoList[projectInfoList.length-1]["bgnde"].slice(0, 4);
				var end_year = projectInfoList[0]["bgnde"].slice(0, 4);

				for(var i = start_year; i <= end_year; i++){
					searchDetailTypeList.push({"value":i, "label":i});
				}
				break;
			case "2" :
				var siteInfo = getSiteInfoDB();
				for(var i=0; i < siteInfo.length; i++){
					searchDetailTypeList.push({"value":siteInfo[i]["instt_code"], "label": siteInfo[i]["instt_name"]})
				}
				break;
			default :
				break;
		}

		setDialogState({
			...dialogState,
			searchType:   event.target.value,
			searchDetailTypes:  searchDetailTypeList,
		});
	}

	//keyword change
	const handleDetailTypeChange= event => {
		setDialogState({
			...dialogState,
			searchDetailType: event.target.value
		});
	};

	return (
		<Fragment>
			<Toolbar className={classes.root}>
				<Typography className={classes.title} color="secondary" variant="subtitle2">					
					프로젝트 관리
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickOpen} className={classes.button}>
							검색
						</Button>
						<RouterLink button="true" to="/project/manage/new">
							<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} >
								프로젝트 등록
							</Button>
						</RouterLink>	
					</Hidden>
					<Hidden mdUp>
						<IconButton color="primary" onClick={handleClickOpen} className={classes.button}>
							<FilterListIcon />
						</IconButton>
						<RouterLink button="true" to="/project/manage/new">
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
								label="검색조건"
								id="searchDetailType"
								name="searchDetailType"
								placeholder="검색조건"
								margin="dense"
								InputLabelProps={{
									shrink: true,
								}}
								value={dialogState.searchDetailType}
								onChange={handleDetailTypeChange}
								select
								fullWidth>
								{(dialogState.searchDetailTypes).map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
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