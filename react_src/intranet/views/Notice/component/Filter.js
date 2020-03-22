import React, { Fragment } from 'react';
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

import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";

import Moment from "moment";

import CommonDialog from '../../../js/CommonDialog';

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

// 자원 유형 Select 값
const searchType = [
	{ value: '-1', label: '전체'  },
	{ value: 'title', label: '제목' },
	{ value: 'content', label: '내용' },
	{ value: 'regId', label: '작성자' },
];


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
		state, setState,setNoticeData
	} = props;
	const [open, setOpen] = React.useState(false);
	const [isDelete, setIsDelete] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const [confirm, setConfirm] = React.useState({});

	// confirm Open Handler
	const handleOpenConfirm = (title, content, isConfirm) => {
		return setConfirm({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}
	// confirm Close Handler
	const handleCloseConfirm = (result) => {
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

	//localStorage resData 선택요소 삭제 처리
	const selectDelete = (result) => {
		if(result){
			console.log(props.selected);
			const noticeData = JSON.parse(localStorage.noticeTestData);
			const upStreamData = noticeData.filter((row => {
				return !props.selected.includes((row.noticeNo));
			}));
			localStorage.setItem('noticeTestData',JSON.stringify(upStreamData));
			setNoticeData(upStreamData);
		}
		setIsDelete(false);
		return setIsDelete(false);
	}

	// Dialog 값 상위 컴포넌트의 state값으로 초기화
	const initDialogState = {
		searchType: '-1',
		search: "",
		stDt: null,
		edDt: null,
	};

	// 검색 버튼 클릭 전, 임시로 값 저장
	const [dialogState, setDialogState] = React.useState(
		initDialogState
	);

	// React.useEffect(()=>{
	// 	console.log(`검색조건 : ${JSON.stringify(dialogState)}`);
	// }, [dialogState])

	// Dialog 필드 값 변경 시, 임시로 값 저장
	const handleChange= event => {
		setDialogState({
			...dialogState,
			[event.target.name]: event.target.value
		});
		// console.log(dialogState);
	};
	// 시작년월 
	const handleChangeStDt = (date) => {
		console.log(date);
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
		setDialogState(initDialogState);
		handleClose();
	}
	// Dialog에서 검색버튼 클릭 시
	// 상위 컴포넌트의 state를 갱신 처리 해줌
	const handleClickSearch = () => {
		setState({
			search: document.getElementsByName("search")[0].value,
			searchType: document.getElementsByName("searchType")[0].value,
			stDt: Moment(document.getElementsByName("stDt")[0].value).format('YYYYMM'),
			edDt: Moment(document.getElementsByName("edDt")[0].value).format('YYYYMM')
		});
		handleClose();
	}

	return (
		<Fragment>

			<CommonDialog props={confirm} closeCommonDialog={handleCloseConfirm}/>

			<Toolbar className={classes.root}>
				<Typography className={classes.title} variant="h6" >					
					공지사항
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickOpen} className={classes.button}>
							검색
						</Button>
						
						<RouterLink button="true" to="/notice/regist">
						<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} className={classes.button}>
							공지사항 등록
						</Button>
						</RouterLink>
						<Button variant="contained" color="secondary" size="small" onClick={handleSelectDelete} startIcon={<DeleteIcon />}>
							공지사항 삭제
						</Button>
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
						<IconButton color="secondary" onClick={handleSelectDelete}>
							<DeleteIcon />
						</IconButton>
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
									<MenuItem key={option.value} value={option.value}>
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
								value={dialogState.name}
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
										locale='ko' 
										margin="normal"
										id="stDt"
										name="stDt"
										label="작성일 검색기간 시작"
										views={["year", "month"]}
										format="yyyy/MM" 
										maxDate={new Date()}
										value={	dialogState.stDt !== null 
												?new Date(dialogState.stDt.slice(0, 4), Number(dialogState.stDt.slice(4, 6))-1)
												:null
											  }
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
										locale='ko' 
										margin="normal"
										id="edDt"
										name="edDt"
										label="작성일 검색기간 종료"
										views={["year", "month"]}
										format="yyyy/MM" 
										maxDate={new Date()}
										value={	dialogState.edDt !== null 
												?new Date(dialogState.edDt.slice(0, 4), Number(dialogState.edDt.slice(4, 6))-1)
												:null
											  }
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