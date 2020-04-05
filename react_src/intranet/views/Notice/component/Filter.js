import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { Divider, Button, Grid, Hidden } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";

import Moment from "moment";

import CommonDialog from '../../../js/CommonDialog';
import {processErrCode } from '../../../js/util';
import axios from 'axios';

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
	},
	router_link: {
		textDecoration: 'none',
	},
}));

// 자원 유형 Select 값
const searchType = [
	{ id: '1', label: '전체'  },
	{ id: 'TITLE', label: '제목' },
	{ id: 'CONTENT', label: '내용' },
	{ id: 'WRITER', label: '작성자' },
];

// Dialog 값 상위 컴포넌트의 state값으로 초기화
const initDialogState = {
	searchType: '1',
	search: "",
	stDt : Moment().format('YYYY')+'01',
	edDt : Moment().format('YYYYMM'),
	// stDt: null,
	// edDt: null,
};

// Select로 구성할 년월 목록
const getListYyyyMm = (period) => {
	const d = new Date();
	d.setMonth(d.getMonth() + 1);

	const arr = new Array(period);
	return arr.fill(0).map( () => {
		d.setMonth(d.getMonth() - 1);
		let yyyy = d.getFullYear();
		let mm = d.getMonth()+1;
		mm = (mm.toString().length == 1)? "0" + mm: mm;

		const yyyymm = `${yyyy}${mm}`;		
		return {value: yyyymm, label: yyyymm};
	});
}

export default function  Filter(props) {
	
	const classes = useToolbarStyles();
	const {
			// noticeData, 
			// state, 
			// setState,
			// setNoticeData
			isAdmin,
			state,
			setState,
			selected,
			setSelected,
			setNoticeData,
			noticeData,
			setPage,
			count,
			setCount
	} = props;
	const [open, setOpen] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [confirm, setConfirm] = useState({});
	const [dialogState, setDialogState] = useState(initDialogState); // 검색 버튼 클릭 전, 임시로 값 저장
	const [searchTypeLabel, setSearchTypeLabel] = useState("전체");


	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};


	// confirm Open Handler
	const handleOpenConfirm = (title, content, isConfirm) => {
		return setConfirm({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}
	// confirm Close Handler
	const handleCloseConfirm = (title, result) => {
		//엑셀, 선택삭제 처리

		setConfirm({title:'', content:'', onOff:false, isConfirm:false});
		if(isDelete){
			return selectDelete(result);
		}else{
			return excelExport(result);
		}
	}
	
	//삭제버튼 클릭 Handler
	const handleSelectDelete = () => {
		setIsDelete(true);
		handleOpenConfirm('공지사항', '선택항목을 삭제하시겠습니까?', true);
	}

	//noticeData 선택요소 삭제 처리
	const selectDelete = (result) => {
		if(result){

			axios({
				url: '/intranet/notice/deletelist',
				method : 'post',
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
				},
				data:{
					board_no : selected
				},
				}).then(response => {
					setCount(count-(selected.length));
					setSelected([]);
				}).catch(e => {
					processErrCode(e);
			});

			const upStreamData = noticeData.filter((row => {
				return !selected.includes((row.board_no));
			}));
			setNoticeData(upStreamData);
		}
		setIsDelete(false);
		return setIsDelete(false);
	}

	// Dialog 필드 값 변경 시, 임시로 값 저장
	const handleChange= event => {
		setDialogState({
			...dialogState,
			[event.target.name]: event.target.value
		});
	};
	// 시작년월 
	const handleChangeStDt = (date) => {
		// console.log(date);
		setDialogState({
			...dialogState,
			stDt: Moment(date).format('YYYYMM')
		});
	}
	// 종료년월
	const handleChangeEdDt = (date) => {
		setDialogState({
			...dialogState,
			edDt: Moment(date).format('YYYYMM')
		});
	}
	// Dialog에서 취소버튼 클릭 시
	const handleClickCancel = () => {
		//검색조건 초기화, 스낵바 닫아줌.
		setDialogState(initDialogState);
		handleClose();
		setOpenSnackBar(false);
	}
	// Dialog에서 검색버튼 클릭 시
	// 상위 컴포넌트의 state를 갱신 처리 해줌
	const handleClickSearch = () => {
		setState({
			search: document.getElementsByName("search")[0].value,
			searchType: document.getElementsByName("searchType")[0].value,
			stDt: Moment(document.getElementsByName("stDt")[0].value).format('YYYYMM') === "Invalid date"
					?null:Moment(document.getElementsByName("stDt")[0].value).format('YYYYMM'),
			edDt: Moment(document.getElementsByName("edDt")[0].value).format('YYYYMM') === "Invalid date"
					?null:Moment(document.getElementsByName("edDt")[0].value).format('YYYYMM')
		});
		handleClose();
		setOpenSnackBar(true);

		searchType.filter((item)=>{
			if(item['id'] === dialogState.searchType){
				setSearchTypeLabel(item.label);
				return;
			} 
		});

		// console.log(state);
	}

	const [openSnackBar, setOpenSnackBar] = React.useState(false);
	const snackBarClose = (event, reason) => {
		if (reason === 'clickaway') {
		return;
		}

		setOpenSnackBar(false);
	};

	return (
		<Fragment>

			<CommonDialog props={confirm} closeCommonDialog={handleCloseConfirm}/>

			<Snackbar
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			onClose={snackBarClose}
			open={openSnackBar}
			// autoHideDuration={6000}
			message={
						`검색타입 : ${searchTypeLabel}
						, 검색기간 : ${Moment(state.stDt+'01').format('YYYY년 MM월')} ~ ${Moment(state.edDt+'01').format('YYYY년 MM월')}
						, 검색어 : ${state.search}`
					}
			action={
				<React.Fragment>
					<IconButton size="small" aria-label="close" color="inherit" onClick={snackBarClose}>
						<CloseIcon fontSize="small" />
					</IconButton>
				</React.Fragment>
			}
			/>

			<Toolbar className={classes.root}>
				<Typography className={classes.title} variant="h6" >					
					공지사항
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickOpen} className={classes.button}>
							검색
						</Button>
						<RouterLink button="true" to="/notice/regist" className={classes.router_link}>
							<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} className={classes.button}>
								공지사항 등록
							</Button>
						</RouterLink>
						{isAdmin&&
						<Button variant="contained" color="secondary" size="small" onClick={handleSelectDelete} startIcon={<DeleteIcon />}>
							공지사항 삭제
						</Button>
						}
					</Hidden>
					<Hidden mdUp>
						<IconButton color="primary" onClick={handleClickOpen} className={classes.button}>
							<FilterListIcon />
						</IconButton>
						
						<RouterLink button="true" to="/notice/regist">
							<IconButton color="primary" className={classes.button}>
								<AddIcon />
							</IconButton>
						</RouterLink>
						{isAdmin&&
						<IconButton color="secondary" onClick={handleSelectDelete}>
							<DeleteIcon />
						</IconButton>
						}
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
								label="검색타입"
								value={dialogState.searchType}
								onChange={handleChange}
								fullWidth
							>
								{searchType.map(option => (
									<MenuItem key={option.id} value={option.id}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={6} style={{paddingRight: 10}}>
							<TextField
								label="검색어"
								id="search"
								name="search"
								placeholder="검색어를 입력하세요."
								margin="dense"
								InputLabelProps={{
									shrink: true,
								}}
								value={dialogState.search}
								type="search"
								onChange={handleChange}
								fullWidth
								// helperText="직책을 포함하여 넣어주세요."
							/>
						</Grid>

						<Grid item xs={6}>
							<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
								<Grid container justify="space-around">
									<KeyboardDatePicker
										InputProps={{
            								readOnly: true,
          								}}
										locale='ko' 
										margin="normal"
										id="stDt"
										name="stDt"
										label="작성일 검색기간 시작"
										views={["year", "month"]}
										format="yyyy/MM" 
										maxDate={new Date()}
										// value={	dialogState.stDt !== null 
										// 		?new Date(dialogState.stDt.slice(0, 4), Number(dialogState.stDt.slice(4, 6))-1)
										// 		:null
										// 	  }
										value= { new Date(dialogState.stDt.slice(0,4), Number(dialogState.stDt.slice(4,6))-1) } 
										onChange={handleChangeStDt}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
										fullWidth
									/>
									</Grid>
								</MuiPickersUtilsProvider>
						</Grid>
						<Grid item xs={6}>
							<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
								<Grid container justify="space-around">
									<KeyboardDatePicker
										InputProps={{
            								readOnly: true,
          								}}
										locale='ko' 
										margin="normal"
										id="edDt"
										name="edDt"
										label="작성일 검색기간 종료"
										views={["year", "month"]}
										format="yyyy/MM" 
										maxDate={new Date()}
										// value={	dialogState.edDt !== null 
										// 		?new Date(dialogState.edDt.slice(0, 4), Number(dialogState.edDt.slice(4, 6))-1)
										// 		:null
										// 	  }
										value = { new Date(dialogState.edDt.slice(0,4), Number(dialogState.edDt.slice(4,6))-1) } 
										onChange={handleChangeEdDt}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
										fullWidth
									/>
									</Grid>
								</MuiPickersUtilsProvider>
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