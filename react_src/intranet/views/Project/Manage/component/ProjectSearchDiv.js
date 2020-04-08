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

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

import { Link as RouterLink } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";
import Moment from "moment";
import {
	  MuiPickersUtilsProvider,
	  DatePicker,
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
	},
	routerLink : {
		textDecoration: 'none',
	}
}));

/*
	경비관리목록 검색영역
*/
export default function ProjectSearchDiv(props) {
	
	const classes = useToolbarStyles();
	const [open, setOpen] = React.useState(false);
	const {condition, updateCondition, minYear, maxYear} = props;
	const {member_list, instt_list} = props;
	
	const searchTypes = [
		{ value: "0", label: "전체"},
		{ value: "1", label: "날짜"},
		{ value: "2", label: "연도"},
		{ value: "3", label: "발주처"},
		{ value: "4", label: "PM"},
	]
	// Dialog 값 상위 컴포넌트의 state값으로 초기화
	const initDialogState = {
		searchType: "1",
		select_date: Moment(new Date()).format("YYYY-MM-DD"),
		select_detail : "",
	};
	const [dialogState, setDialogState] = React.useState(initDialogState);
	const [detailList, setDetailList] = React.useState([]);
	
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	
	const handleChange = (event) => {
		var tmpList = [];
		
		if(event.target.value == "0" || event.target.value == "1"){
			setDialogState({
				[event.target.name]: event.target.value,
			});
		}else if(event.target.value == "2"){
			for(var i=minYear; i < maxYear; i++){
				tmpList.push(i);
			}
			setDetailList(tmpList);
			setDialogState({
				[event.target.name]: event.target.value,
				select_detail:minYear
			});
		}
		
		else if(event.target.value == "3"){
			setDetailList(instt_list);
			setDialogState({
				[event.target.name]: event.target.value,
			});
		}
		
		else if(event.target.value == "4"){
			setDetailList(member_list);
			setDialogState({
				[event.target.name]: event.target.value,
			});
		}
	}
	
	const handleChangeDate = (event) => {
		setDialogState({
			...dialogState,
			select_date: Moment(event).format("YYYY-MM-DD"),
		});
	}
	
	const handleDetailChange = (event) => {
		setDialogState({
			...dialogState,
			select_detail: event.target.value,
		});
	}
	
	const handleClickSearch = () => {
		
		
		var detailCondition = "";
		var tmpDialogState = JSON.parse(JSON.stringify(dialogState));
		if(dialogState.searchType == "0"){
			detailCondition = "";
		}else if(dialogState.searchType == "1"){
			detailCondition = dialogState.select_date
			
			//날짜의 경우 포맷을 변경해줘야한다.
			tmpDialogState["select_date"] = Moment(dialogState.select_date).format("YYYYMMDD");
		}else if(dialogState.searchType == "2"){
			detailCondition = dialogState.select_detail;
		}else if(dialogState.searchType == "3"){
			detailCondition = instt_list.filter((info) => info.CODE_ID == dialogState.select_detail)[0]["CODE_NAME"];
		}else if(dialogState.searchType == "4"){
			var tmp = member_list.filter((info) => info.member_no == dialogState.select_detail)[0];
			detailCondition = tmp["name"] + tmp["code_name"] + "님 입니다.";
		}
		
		updateCondition(tmpDialogState);
		var list = ["전체","날짜","연도","발주처","사원명"];
		var txt = "검색 조건 : " + list[Number(dialogState.searchType)] + ", 키워드 : " + detailCondition;
			+ dialogState.searchType == "0" ? "" : dialogState.searchType == "1" ? dialogState.select_date : detailCondition;
		setSnackBarMessage(txt);
		setOpenSnackBar(true);
		handleClose();
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
					프로젝트 관리
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickOpen} className={classes.button}>
							검색
						</Button>
						<RouterLink button="true" className={classes.routerLink} to="/project/manage/new">
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
								margin="dense"
								placeholder="검색조건"
								label="검색조건"
								value={dialogState.searchType}
								onChange={handleChange}
								fullWidth
								select>
								{searchTypes.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						{dialogState.searchType == "1" &&  
							<Grid item xs={6} style={{paddingRight: 10}}>
								<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
									<Grid container justify="space-around">
										<DatePicker
											locale='ko'
											margin="dense"
											id="select_date"
											name="select_date"
											views={["year", "month", "date"]}
											format="yyyy-MM-dd"
											value={dialogState.select_date}
											onChange={handleChangeDate}
											inputVariant="outlined"
											readOnly={false}
											fullWidth
										/>
									</Grid>
								</MuiPickersUtilsProvider>
							</Grid>
						}
						{dialogState.searchType == "2" && 
							<Grid item xs={6} style={{paddingRight: 10}}>
								<TextField
									id="select_detail"
									name="select_detail"
									margin="dense"
									placeholder="상세조건"
									label="상세조건"
									value={dialogState.select_detail}
									onChange={handleDetailChange}
									fullWidth
									select>
									{detailList.map((info) => (
										<MenuItem key={info} value={info}>
											{info}
										</MenuItem>
									))}
								</TextField>
							</Grid>
						}
						{dialogState.searchType == "3" && 
							<Grid item xs={6} style={{paddingRight: 10}}>
								<TextField
									id="select_detail"
									name="select_detail"
									margin="dense"
									placeholder="상세조건"
									label="상세조건"
									value={dialogState.select_detail}
									onChange={handleDetailChange}
									fullWidth
									select>
									{detailList.map((info) => (
										<MenuItem key={info.CODE_ID} value={info.CODE_ID}>
											{info.CODE_NAME}
										</MenuItem>
									))}
								</TextField>
							</Grid>
						}
						{dialogState.searchType == "4" && 
							<Grid item xs={6} style={{paddingRight: 10}}>
								<TextField
									id="select_detail"
									name="select_detail"
									margin="dense"
									placeholder="상세조건"
									label="상세조건"
									value={dialogState.select_detail}
									onChange={handleDetailChange}
									fullWidth
									select>
									{detailList.map((info) => (
										<MenuItem key={info.member_no} value={info.member_no}>
											{info.name}
										</MenuItem>
									))}
								</TextField>
							</Grid>
						}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
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