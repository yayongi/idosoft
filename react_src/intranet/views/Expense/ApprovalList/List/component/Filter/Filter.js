import React, { useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import SaveIcon from '@material-ui/icons/Save';
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

import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";

import Moment from "moment";

import Axios from 'axios';



import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { processErrCode, isEmpty, expectedDevelopment, setSessionStrogy, getSessionStrogy, resetSessionStrogy} from '../../../../../../js/util';
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
export default function  Filter(props) {
	
	const classes = useToolbarStyles();
	const {
		filterRows, filterSetRows,
		state, setState,
		paging, setPaging,

		totalProgAmount, totalFirAmount,
		totalCompAmount,totalReturnAmount, 
		setTotalProgAmount, setTotalFirAmount,
		setTotalCompAmount, setTotalReturnAmount,

		routeProps, setHoldUp,
		setPage ,setRowsPerPage,
		setShowLoadingBar,
		isNoN ,setIsNoN, 
		setEmptyMessage,
		setOpenSnackBar, setSnackBarMessage,
		firSelected ,setFirSelected,
		selected ,setSelected,

		setIsOpen, setErrMessage, setNonHistoryBack
	} = props;

	const [expenseTypes, setExpenseTypes] 	= React.useState([]);
	const [statuses, setStatuses] 			= React.useState([]);

	// 세션스토리지 검색 정보 가져오기(EXPENSE_APP)
	const sessionData = getSessionStrogy("EXPENSE_APP");

	let data = {};

	const initData = {
		expenseType: "-1",
			payStDt: Moment().format('YYYY')+'01',
			payEdDt: Moment().format('YYYYMM'),
			status: "-1",
			memo: "",
	}

	// 세션스토리지 공백 여부 확인
	if(sessionData == ""){
		
		data = initData;
	} else {
		data = sessionData;
	}

	// 검색 버튼 클릭 전, 임시로 값 저장

	const [dialogState, setDialogState] = React.useState(data);

	useEffect(() => {
		setShowLoadingBar(true);
		Axios({
			url: '/intranet/getCode.exp',
			method: 'post',
			data: {
				currentPage : '1',
				limit : '10'
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			
			const exPenseTypeList 	= JSON.parse(response.data.expenseTypeList);
			const payTypeList 		= JSON.parse(response.data.payTypeList);

			setExpenseTypes(exPenseTypeList);
			setStatuses(payTypeList);

			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
			console.log(e);
		});
		
	}, []);

	const [open, setOpen] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const excelExport = () => {
		
		if(isNoN == "false"){

			const fileName = "EXPENSE";
			const fileCode = "EXCEL0004";
			const searchData = {
							...state
			}
			
			Axios({
				url: '/intranet/downloadExcelFile',
				method: 'post',
				data : {
					fileCode : fileCode,
					fileName : fileName,
					searchData : searchData,
				},
				responseType: 'blob',
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(response => {

				console.log(JSON.stringify(response));

				const fileName = response.headers.filename;

				const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', fileName);
				document.body.appendChild(link);
				link.click();
			}).catch(e => {
				console.log(e);
			});
		} else {
			setNonHistoryBack(true);
			setIsOpen(true);
			setErrMessage("목록이 없으면 엑셀을 내보내실 수 없습니다.");
		}
		
	}

	// Dialog 값 상위 컴포넌트의 state값으로 초기화
	const initDialogState = {
		name: state.name,
		expenseType: state.expenseType,
		payStDt: state.payStDt,
		payEdDt: state.payEdDt,
		status: state.status,
		memo: state.memo,
	};
	// Dialog에서 취소버튼 클릭 시
	const handleClickCancel = () => {
		setDialogState(initDialogState);
		handleClose();
	}
	// Dialog에서 검색버튼 클릭 시
	// 상위 컴포넌트의 state를 갱신 처리 해줌
	const handleClickSearch = () => {

		setShowLoadingBar(true);

		const name 			= document.getElementsByName("name")[0].value;
		const expenseType 	= document.getElementsByName("expenseType")[0].value;
		const payStDt 		= document.getElementsByName("payStDt")[0].value.replace(/[^0-9]/g, "");
		const payEdDt 		= document.getElementsByName("payEdDt")[0].value.replace(/[^0-9]/g, "");
		const status 		= document.getElementsByName("status")[0].value;
		const memo 			= document.getElementsByName("memo")[0].value;

		const searchData = {
			currentPage : '1',
			limit : '10',
			name: name,
			expenseType: expenseType,
			payStDt: payStDt,
			payEdDt: payEdDt,
			status: status,
			memo: memo
		}

		Axios({
			url: '/intranet/getAnnaualList.exp',
			method: 'post',
			data: searchData,
			headers: {
				'Content-Type': 'application/json'
			},

		}).then(response => {
			// 검색내용 세션스토리지 저장
			setSessionStrogy("EXPENSE_APP",searchData);

			const isNoN = response.data.isNoN;
			setIsNoN(isNoN);
			if(isNoN == "false"){
				filterSetRows(JSON.parse(response.data.list));
				
				setTotalProgAmount(response.data.totalProgAmount);
				setTotalFirAmount(response.data.totalFirAmount);
				setTotalCompAmount(response.data.totalCompAmount);
				setTotalReturnAmount(response.data.totalReturnAmount);

				const result = JSON.parse(response.data.result);

				/* 페이징 관련 state */
				setPaging(result);
				setHoldUp(0);
				setRowsPerPage(Number(result.limit));
				setPage(Number(result.currentPage)-1);

				setState(searchData);
			} else { // true
				setEmptyMessage("검색 목록이 없습니다.");
			}

			// 검색어 화면에 띄어주기 위한 로직 처리 START /////////////////////////////

			let expLabel = ""; 
			let statLabel = "";

			if(expenseType != "-1"){
				expenseTypes.map(option => {
				if(option.value == expenseType) expLabel = option.label;
				});
			} else {
				expLabel = "전체";
			}

			if(status != "-1"){
				statuses.map(option => {
				if(option.value == status) statLabel = option.label;
				});
			} else {
				statLabel = "전체";
			}
			
			// 검색어 화면에 띄어주기 위한 로직 처리 END //////////////////////////////

			setOpenSnackBar(true);
			setSnackBarMessage(`${name.trim() != "" ? " 이름 : " + name.trim() +", " : ""} 
								경비유형 : ${expLabel} ,등록기간 : ${Moment(payStDt+'01').format('YYYY년 MM월')} ~ ${Moment(payEdDt+'01').format('YYYY년 MM월')}
								,진행상태 : ${statLabel} ${memo.trim() != "" ? " ,내용 : " + memo.trim() : ""}`);
			
			/* setSnackBarMessage(`검색 조건으로 ${name.trim() != "" ? " 이름은 \'" + name.trim() +"\'" : ""} 
				경비유형은(는) \'${expLabel}\' 등록기간은 \'${Moment(payStDt+'01').format('YYYY년 MM월')} ~ ${Moment(payEdDt+'01').format('YYYY년 MM월')}\' 
				진행상태은(는) \'${statLabel}\' ${memo.trim() != "" ? " 내용은 \'" + memo.trim() +"\'" : ""} (으)로 검색하셨습니다.`); */

			handleClose();
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
			console.log(e);
		});

		
	}

	// 검색기록 초기화 
	const handleClickResat = () => {
		resetSessionStrogy("EXPENSE_APP");

		// 내용 초기화
		setDialogState(initData);
		
		// state 초기화
		setState(initData);

		handleClose();
		setOpenSnackBar(true);
		setSnackBarMessage(`검색조건이 초기화 되었습니다.`);
			
	}

	// 다중 결재 처리 

	const [appOpen, setAppOpen] = React.useState(false);
	const [errOpen, setErrOpen] = React.useState(false);
	const [errMsg, setErrMsg]	= React.useState('');

	const appHandleClickOpen = () => {
		if(!isEmpty(selected) || !isEmpty(firSelected)){ // Object 비었을 경우 true
			return setAppOpen(true);
		} else{
			setErrMsg('결재할 항목이 없습니다.');
			return setErrOpen(true);
		}
	};

	const appHandleClickClose = (att) => {
		if(att === 'err'){
			setErrOpen(false)
		} else {
			setAppOpen(false);
		}
	};

	const handleClickApprove =() => {
		
		setShowLoadingBar(true);

		Axios({
			url: '/intranet/multiplexApproval.exp',
			method: 'post',
			data: {
				firAppMembers : firSelected, // 경비 번호 
				appMembers : selected, // 경비 번호
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			
			const isError = response.data.isError;
			if(isError == "false"){
				
				const members = [...selected, ...firSelected];
				let dataList = filterRows;

				members.map((data) => {

					const dataIdx = dataList.findIndex(item => item.seq === data);

					if(dataList[dataIdx].status == 'SS0000'){ // 진행 - 1차 결재 수행
						dataList[dataIdx].status = "SS0001";
						dataList[dataIdx].statusText = "1차결재완료";
					} else { // data.status == '1' // 1차결재완료 - 2차 결재 수행
						dataList[dataIdx].status = "SS0002";
						dataList[dataIdx].statusText = "완료";
					}

					if(dataIdx > -1) {
						dataList = [
							...dataList.slice(0, dataIdx),
							dataList[dataIdx],
							...dataList.slice(dataIdx+1)
						];

					}
				});
				filterSetRows(dataList);

				setSelected([]);
				setFirSelected([]);
				
				setAppOpen(false);

				setShowLoadingBar(false);
			}
		})
		.catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
			console.log(e);
		});
	}

	// Dialog 필드 값 변경 시, 임시로 값 저장
	const handleChange= event => {
		setDialogState({
			...dialogState,
			[event.target.name]: event.target.value
		});
	};
	// 시작년월 
	const handleChangePayStDt = date => {
		setDialogState({
			...dialogState,
			payStDt: Moment(date).format('YYYYMM')
		});
	}
	// 종료년월
	const handleChangePayEdDt = date => {
		setDialogState({
			...dialogState,
			payEdDt: Moment(date).format('YYYYMM')
		});
	}

	return (
		<Fragment>
			<Toolbar className={classes.root}>
				<Typography className={classes.title} color="secondary" variant="subtitle2">
					총 금액(진행) : {Number(totalProgAmount).toLocaleString()} 원 <br/>
					총 금액(1차결재) : {Number(totalFirAmount).toLocaleString()} 원 <br/>
					총 금액(완료) : {Number(totalCompAmount).toLocaleString()} 원 <br/>
					총 금액(반려) : {Number(totalReturnAmount).toLocaleString()} 원 <br/>
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickOpen} className={classes.button}>
							검색
						</Button>
						<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon  />} onClick={excelExport} className={classes.button}>
							엑셀 내보내기
						</Button>
						<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} onClick={appHandleClickOpen} className={classes.button}>
							경비 결재
						</Button>
					</Hidden>
					<Hidden mdUp>
						<IconButton color="primary" onClick={handleClickOpen} className={classes.button}>
							<FilterListIcon />
						</IconButton>
						<IconButton color="primary" onClick={excelExport} className={classes.button}>
							<SaveIcon />
						</IconButton>
						<IconButton color="primary" onClick={appHandleClickOpen} className={classes.button}>
							<AddIcon />
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
								id="expenseType"
								name="expenseType"
								select
								margin="dense"
								label="경비유형"
								value={dialogState.expenseType}
								onChange={handleChange}
								fullWidth>
								<MenuItem key='-1' value='-1'>
									전체
								</MenuItem>
								{expenseTypes.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={6} style={{paddingRight: 10}}>
							<TextField
								label="사원명"
								id="name"
								name="name"
								placeholder="오OO"
								margin="dense"
								InputLabelProps={{
									shrink: true,
									maxLength: 10,
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
										id="payStDt"
										name="payStDt"
										label="시작년월"
										views={["year", "month"]}
										format="yyyy/MM" 
										maxDate={new Date()}
										value={new Date(dialogState.payStDt.slice(0, 4), Number(dialogState.payStDt.slice(4, 6))-1)}
										onChange={handleChangePayStDt}
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
										id="payEdDt"
										name="payEdDt"
										label="종료년월"
										views={["year", "month"]}
										format="yyyy/MM" 
										maxDate={new Date()}
										value={new Date(dialogState.payEdDt.slice(0, 4), Number(dialogState.payEdDt.slice(4, 6))-1)}
										onChange={handleChangePayEdDt}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
										fullWidth
									/>
									</Grid>
								</MuiPickersUtilsProvider>
						</Grid>

						<Grid item xs={12} style={{paddingRight: 10}}>
							<TextField
								id="status"
								name="status"
								select
								margin="dense"
								label="진행상태"
								value={dialogState.status}
								onChange={handleChange}
								fullWidth>
								<MenuItem key='-1' value='-1'>
								전체
								</MenuItem>
								{statuses.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>

						<Grid item xs={12}>
							<TextField
								label="내용"
								id="memo"
								name="memo"
								placeholder=""
								margin="dense"
								type="search"
								inputProps={{
									maxLength: 20,
								}}
								value={dialogState.memo}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>

						
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClickResat} color="primary">
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

			{/* 다중 결재 Alert */}
			<Dialog
				open={appOpen}
				onClose={() => appHandleClickClose('')}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
				<DialogContentText id="alert-dialog-description">
					결재하시겠습니까?
				</DialogContentText>
				</DialogContent>
				<DialogActions>
				<Button onClick={() => appHandleClickClose('')} color="primary">
					취소
				</Button>
				<Button onClick={handleClickApprove} color="primary" autoFocus>
					확인
				</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={errOpen}
				onClose={() => appHandleClickClose('err')}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{errMsg}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
				<Button onClick={() => appHandleClickClose('err')} color="primary" autoFocus>
					확인
				</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
				
	);
}