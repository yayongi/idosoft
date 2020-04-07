import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import SaveIcon from '@material-ui/icons/Save';
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

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import {excelExport, processErrCode} from '../../../js/util';

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
	router_link: {
		textDecoration: 'none',
	},
}));

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

	// Dialog 값 상위 컴포넌트의 state값으로 초기화
	const initDialogState = {
		holder: null,
		resType: '1',
		stDt: Moment().format('YYYY')+'01',
		edDt: Moment().format('YYYYMM'),
	};
	
	const classes = useToolbarStyles();
	const {
			isAdmin,
			resData, 
			state, 
			setState,
			setResData, 
			setPage, 
			count, 
			setCount, 
			selected,
			setSelected
	} = props;
	const [open, setOpen] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [confirm, setConfirm] = useState({});
	const [resType, setResType] = useState([{ id: '1', label: '전체'  }]);
	const [dialogState, setDialogState] = useState(initDialogState);			// 검색 버튼 클릭 전, 임시로 값 저장
	const [resTypeLabel, setResTypeLabel] = useState("전체");

	useEffect(()=>{
		axios({
			url: '/intranet/resource/get-restype-code',
			method : 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			data:{
			},
		}).then(response=>{
			setResType([...resType, ...response.data]);
		}).catch(e=>{
			processErrCode(e);
		});
	},[]);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	const handleExcelClick = () => {
		axios({
			url: '/intranet/resource/exportexcel',
			method: 'post',
			data : {
				searchState : state,
				title : 'resourceData.xls'
			},
			responseType: 'blob',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(response => {
			// console.log("positionResult : " + JSON.stringify(response));
			const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'resourceData.xls');
			document.body.appendChild(link);
			link.click();
		}).catch(e => {
			processErrCode(e);
		});

		// alert("엑셀 내보내기");
	}
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
		handleOpenConfirm('자원관리', '선택항목을 삭제하시겠습니까?', true);
	}

	//localStorage resData 선택요소 삭제 처리
	const selectDelete = (result) => {
		if(result){
			axios({
				url: '/intranet/resource/deletelist',
				method : 'post',
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
				},
				data:{
					res_no : selected
				},
				}).then(response => {
					// console.log(response.data);
					setCount(count-(selected.length));
					setSelected([]);
				}).catch(e => {
					processErrCode(e);
			});
			const upStreamData = resData.filter((row => {
				return !selected.includes((row.res_no));
			}));
			setResData(upStreamData);
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

	//검색 초기화
	const handleClickReset = () => {
		setState(initDialogState);
		setDialogState(initDialogState);
		handleClose();

		setOpenSnackBar(true);
		setSnackBarMessage(`검색조건이 초기화 되었습니다.`);
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
			holder: document.getElementsByName("holder")[0].value === ""
					 ?null:(document.getElementsByName("holder")[0].value).replace(/(\s*)/g, ""),
			resType: document.getElementsByName("resType")[0].value,
			stDt: Moment(document.getElementsByName("stDt")[0].value).format('YYYYMM') === "Invalid date"
					?null:Moment(document.getElementsByName("stDt")[0].value).format('YYYYMM'),
			edDt: Moment(document.getElementsByName("edDt")[0].value).format('YYYYMM') === "Invalid date"
					?null:Moment(document.getElementsByName("edDt")[0].value).format('YYYYMM')
		});
		setPage(0);
		handleClose();

		// resType.filter((item)=>{
		// 	if(item['id'] === dialogState.resType){
		// 		setResTypeLabel(item.label);
		// 		return;
		// 	} 
		// });

		// setSnackBarMessage(`검색타입 : ${resTypeLabel}
		// 				, 구입년월 : ${Moment(state.stDt+'01').format('YYYY년 MM월')} ~ ${Moment(state.edDt+'01').format('YYYY년 MM월')}
		// 				, 보유자 : ${state.holder === null ? "" : state.holder.replace(/(\s*)/g, "")}`);

		setSnackBarMessage(
			`검색타입 : ${document.getElementById('resType').innerText}
			, 구입년월 : ${Moment(document.getElementsByName("stDt")[0].value+'/01').format('YYYY년 MM월')} ~ 
			${Moment(document.getElementsByName("edDt")[0].value+'/01').format('YYYY년 MM월')}
			${document.getElementsByName("holder")[0].value !== '' ? (", 보유자 : "+(document.getElementsByName("holder")[0].value).replace(/(\s*)/g, "")):''}`

		);
		setOpenSnackBar(true);
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

			<CommonDialog props={confirm} closeCommonDialog={handleCloseConfirm}/>

			<Snackbar
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			onClose={snackBarClose}
			open={openSnackBar}
			// autoHideDuration={6000}
			message={snackBarMessage}
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
					자원관리
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickOpen} className={classes.button}>
							검색
						</Button>
						<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} onClick={handleExcelClick} className={classes.button}>
							엑셀 내보내기
						</Button>
						<RouterLink button="true" to="/resource/regist" className={classes.router_link}>
							<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} className={classes.button}>
								자원등록
							</Button>
						</RouterLink>
						{isAdmin &&
						<>
						<Button variant="contained" color="secondary" size="small" onClick={handleSelectDelete} startIcon={<DeleteIcon />}>
							자원삭제
						</Button>
						</>
						}
					</Hidden>
					<Hidden mdUp>
						<IconButton color="primary" onClick={handleClickOpen} className={classes.button}>
							<FilterListIcon />
						</IconButton>
						<IconButton color="primary" onClick={handleExcelClick} className={classes.button}>
							<SaveIcon />
						</IconButton>
						<RouterLink button="true" to="/resource/regist">
							<IconButton color="primary" className={classes.button}>
								<AddIcon />
							</IconButton>
						</RouterLink>
						{isAdmin &&
						<>
						<IconButton color="secondary" onClick={handleSelectDelete}>
							<DeleteIcon />
						</IconButton>
						</>
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
								id="resType"
								name="resType"
								select
								margin="dense"
								label="자원종류"
								value={dialogState.resType}
								onChange={handleChange}
								fullWidth>
								{resType.map(option => (
									<MenuItem key={option.id} value={option.id}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={6} style={{paddingRight: 10}}>
							<TextField
								label="보유자"
								id="holder"
								name="holder"
								placeholder="김OO"
								margin="dense"
								InputLabelProps={{
									shrink: true,
								}}
								value={dialogState.holder}
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
										label="구입년월 시작"
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
										InputProps={{
            								readOnly: true,
          								}}
										locale='ko' 
										margin="normal"
										id="edDt"
										name="edDt"
										label="구입년월 종료"
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
					<Button onClick={handleClickReset} color="primary">
						초기화
					</Button>
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