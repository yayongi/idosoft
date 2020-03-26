import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import MenuItem from '@material-ui/core/MenuItem';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";
import Moment from "moment";

import { processErrCode, getUrlParams } from "../../../../js/util";

import axios from 'axios';

import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

import { getStepInfo } from 'views/Expense/data';
import PreviewFileUpload from 'common/PreviewFileUpload';
import Axios from 'axios';

const useStyles = makeStyles(theme => ({
	table: {
		minWidth: 650,
	},
	title: {
		flex: '1',
	},
	button: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	root: {
		width: '100%',
	},
	backButton: {
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	paper: {
		backgroundColor: '#efefef',
		color: 'black',
		padding: '5px 10px',
		borderRadius: '4px',
		fontSize: '13px',
		border: '1px solid black',
		marginTop: theme.spacing(1), 
	},
	
}));

const emptyData = {
	seq: "",
	name: "",
	expenseType: "ET0001",
	expenseTypeText: "야식비",
	payDate: Moment(new Date()).format('YYYY-MM-DD'),
	status: "-1",
	statusText: "진행",
};

/*
	state 변경에 Re-Rendering 수행
	state의 값이 이전과 동일해도 수행이 안됨.
	전역 변수는 호출 안됨.
*/
export default function  View(props) {
	console.log("call View Area");
	const [files, setFiles] = React.useState([]);

	const {routeProps, screenType } = props;
	const {history, location, match} = routeProps;

	//let dataList = JSON.parse(AnnualStorage.getItem("ANNUAL_LIST"));		// 데이터
	let data = emptyData;

	const [expenseTypes, setExpenseTypes] = React.useState([]);

	// state : 진행 상태
	const [activeStep, setActiveStep] = React.useState(1);

	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const [dataState, setDataState] = React.useState(emptyData);	// state : 수정을 위한 데이터 관리

	const isReadOnly = (data.status != undefined && data.status != '-1' && data.status != 'SS0000' && data.status != 'SS00003');				// 신규, 진행, 반려가 아니면 수정이 안되도록 설정

	const classes = useStyles();
	
	// 필드 값 변경 시, 임시로 값 저장
	const handleChange= event => {
		
		/** 임시 Code*/
		
		if(event.target.name == 'expenseType') {
			setDataState({
				...dataState,
				expenseType: event.target.value,
				expenseTypeText: expenseTypes.find(item => item.value == event.target.value).label
			});
		} else {
			if(event.target.name == 'pay') {	// 결제금액 특수문자 제거
				event.target.value = event.target.value.replace(/[^0-9]/g, '');
			}
			
			setDataState({
				...dataState,
				[event.target.name]: event.target.value
			});	
		}
		/** 임시 Code*/
	};

	// 결제일 변경 시, 임시로 값 저장
	const handleChangePayDate = date => {

		console.log(`date : ${date}`);

		setDataState({
			...dataState,
			payDate: Moment(date).format('YYYYMMDD')
		});
	}

	let stepInfo = getStepInfo(data);	// Re-Rendering 시점에는 호출 되지 않음.
	
	React.useEffect(() => {		// render 완료 후, 호출
		console.log("call useEffect");
		console.log(JSON.stringify(match));

		const params = match.params;

		console.log(params.id);

		Axios({
			url: '/intranet/getView.exp',
			method: 'post',
			data: {
				expense_no : params.id,
				screenType : screenType,
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			console.log(JSON.stringify(response.data));

			const exPenseTypeList 	= JSON.parse(response.data.expenseTypeList);
			const payTypeList 		= JSON.parse(response.data.payTypeList);
			
			setExpenseTypes(exPenseTypeList);
			setActiveStep(stepInfo.activeStep);
			if(!screenType != 'new'){ // 스크린 타입이 NEW가 아닐 경우,
				data = JSON.parse(response.data.result);
				setFiles([{preview : data.filePath, name: data.filePath}]);
				setDataState(data);
			}
		})
		.catch(e => {
			//processErrCode(e);
			console.log(e);
		});
	}, []);

	// 반려사유
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const heandleClickRejectMemo = event => {
		setAnchorEl(event.currentTarget);
		setOpen(!open);
	}

	// 값 체크 START
	const [stateOpen, setStateOpen] 		= React.useState(false);
	const [stateMessage, setStateMessage]	= React.useState("");
	const [isError, setIsError] 			= React.useState(false);

	const stateCloseClick = () => {
		setStateOpen(false);
	}

	const stateComfClick = () => {
		if(!isError){
			return history.goBack();
		}
		return setStateOpen(false);;
	}

	const stateOpenEvent = (msg) => {
		setStateMessage(msg);
		setIsError(false);
		setStateOpen(true);
	}
	
	const valuedationCheck = () => {

		console.log('dataState.pay : ' + dataState.pay);
		
		if(dataState.pay == '' || dataState.pay == undefined){
			setStateOpen(true);
			setStateMessage('금액을 입력해주세요.');
			setIsError(true);

			return false;
		} 

		if(dataState.memo == ''){
			setStateOpen(true);
			setStateMessage('내용을 입력해주세요.');
			setIsError(true);
			return false;
		}

		return true;
	}

	// 값 체크 END

	// 글 등록 후, 목록으로 이동
	const handleClickNew = () => {
		console.log("call handleClickNew");
		
		console.log("dataState : " + JSON.stringify(dataState));
		
		const formData = new FormData();
		formData.append('file',files[0]);
		formData.append('EXPENS_TY_CODE',dataState.expenseType);
		formData.append('USE_DATE',dataState.payDate);
		formData.append('USE_AMOUNT',dataState.pay);
		formData.append('USE_CN',dataState.memo); 

		if(!valuedationCheck()){ // valuedationCheck 실패시, return 
			return;
		}

		axios({
			url: '/intranet/resister.exp',
			method : 'post',
			data : formData,
			header : {
				'enctype': 'multipart/form-data'
			}
			}).then(response => {
				console.log(`${JSON.stringify(response)}`);
				
				stateOpenEvent("등록이 완료되었습니다.");
			}).catch(e => {
				processErrCode(e);
				console.log(e);
		});

	}

	// 글 삭제 후, 목록으로 이동
	const handleClickRemove = () => {
		console.log("call handleClickRemove");
		
		const formData = new FormData();

		console.log(`dataState.filePath : ${dataState.filePath} // files[0].filePath : ${files[0].filePath}`);

		const params = match.params;

		console.log(`params : ${JSON.stringify(params)}`)

		if(dataState.filePath != files[0].preview){
			formData.append('file',files[0]);
		}

		formData.append('prefilename',dataState.filePath);
		formData.append('EXPENS_NO',params.id);

		axios({
			url: '/intranet/delete.exp',
			method : 'post',
			data : formData,
			header : {
				'enctype': 'multipart/form-data'
			}
			}).then(response => {
				console.log(`${JSON.stringify(response)}`);
				
				stateOpenEvent("삭제  완료되었습니다.");
			}).catch(e => {
				processErrCode(e);
				console.log(e);
		});

	}
	// 수정처리
	const handleClickModify =() => {

		console.log("call handleClickModify");
		if(!valuedationCheck()){ // valuedationCheck 실패시, return 
			return;
		}

		console.log("dataState : " + JSON.stringify(dataState));
		
		const formData = new FormData();

		console.log(`dataState.filePath : ${dataState.filePath} // files[0].filePath : ${files[0].filePath}`);

		const params = match.params;

		console.log(`params : ${JSON.stringify(params)}`)

		if(dataState.filePath != files[0].preview){
			formData.append('file',files[0]);
		}

		formData.append('prefilename',dataState.filePath);
		formData.append('EXPENS_NO',params.id);
		formData.append('EXPENS_TY_CODE',dataState.expenseType);
		formData.append('USE_DATE',dataState.payDate);
		formData.append('USE_AMOUNT',dataState.pay);
		formData.append('USE_CN',dataState.memo); 

		axios({
			url: '/intranet/update.exp',
			method : 'post',
			data : formData,
			header : {
				'enctype': 'multipart/form-data'
			}
			}).then(response => {
				console.log(`${JSON.stringify(response)}`);
				
				stateOpenEvent("수정 완료되었습니다.");
				//history.goBack();
			}).catch(e => {
				processErrCode(e);
				console.log(e);
		});
		
	}
	// 반려건, 다시 진행
	const handleClickRetry = () => {

		console.log("call handleClickRetry");
		if(!valuedationCheck()){ // valuedationCheck 실패시, return 
			return;
		}

		/* const dataIdx = dataList.findIndex(item => item.seq === data.seq);
		data.status="0";
		data.statusText="진행";
		stepInfo = getStepInfo(data);
		setActiveStep(stepInfo.activeStep);

		if(dataIdx > -1) {
			dataList = [
				...dataList.slice(0, dataIdx),
				data,
				...dataList.slice(dataIdx+1)
			];
			AnnualStorage.setItem("ANNUAL_LIST", JSON.stringify(dataList));
			AnnualStorage.setItem("ANNUAL_VIEW", JSON.stringify(data));
			
			stateOpenEvent("다시 결재 진행합니다.");
		} */
	}
	return (
		<>
			<div className={classes.root}>
				<Stepper activeStep={activeStep}>
					{stepInfo.steps.map(row => (
						<Step key={row.label}>
							<StepLabel error={row.isError}>{row.label}</StepLabel>
						</Step>
					))}
				</Stepper>
			</div>
			<Divider/>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left" colSpan="2">
								<Toolbar>
									<Typography className={classes.title} color="inherit" variant="h6">					
										경비 정보
										{	
											(data.status == '3') &&
											<>
												<Button variant="contained" color="secondary" className={classes.button} size="small"  onClick={heandleClickRejectMemo}>
													반려사유
												</Button>
												<Popper open={open} anchorEl={anchorEl} placement="bottom-start" transition style={{test:'test'}}>
													{({ TransitionProps }) => (
														<Fade {...TransitionProps} timeout={350}>
															<div className={classes.paper}>{
																dataState.rejectMemo.split('\n').map( (line, idx) => {
																	return (<span key={idx}>{line}<br/></span>)
																})
															}</div>
														</Fade>
													)}
												</Popper>
											</>
										}
									</Typography>
								</Toolbar>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell align="left" component="th" scope="row" style={{minWidth: '100px'}}>경비유형</TableCell>
							<TableCell align="left">
								{expenseTypes.map((option, idx) => (
									(dataState.expenseType == option.value) && 
									<TextField
										id="expenseType"
										name="expenseType"
										select
										margin="dense"
										variant="outlined"
										defaultValue={option.value}
										onChange={handleChange}
										InputProps={{
											readOnly: isReadOnly,
										}}
										fullWidth>
										{expenseTypes.map((option, idx) => (
											<MenuItem key={option.value} value={option.value}>
												{option.label}
											</MenuItem>
										))}
									</TextField>
								))}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">결제일</TableCell>
							<TableCell align="left">
								<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
									<Grid container justify="space-around">
										<DatePicker
											locale='ko' 
											margin="dense"
											id="payDate"
											name="payDate"
											views={["year", "month", "date"]}
											format="yyyy-MM-dd" 
											maxDate={new Date()}
											value={dataState.payDate}
											onChange={handleChangePayDate}
											inputVariant="outlined"
											readOnly={isReadOnly}
											// InputAdornmentProps={{ position: "start" }}
											fullWidth
										/>
										</Grid>
									</MuiPickersUtilsProvider>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">금액</TableCell>
							<TableCell align="left">
								<CurrencyTextField
									id="pay"
									name="pay"
									currencySymbol="￦"
									minimumValue="0"
									value={dataState.pay}
									onChange={handleChange}
									InputProps={{
									 	 readOnly: isReadOnly,
									}}
									variant="outlined"
									decimalPlaces={0}
									size="small"
									textAlign="right"
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">내용</TableCell>
							<TableCell align="left">
								<TextField
									id="memo"
									name="memo"
									onChange={handleChange}
									rows="5"
									defaultValue={dataState.memo}
									variant="outlined"
									InputProps={{
									 	 readOnly: isReadOnly,
									}}
									multiline
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">첨부파일</TableCell>
							<TableCell align="left">
								<PreviewFileUpload files={files} setFiles={setFiles}/>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<Toolbar>
				<Typography className={classes.title} color="secondary" variant="subtitle2">					
				</Typography>
				<div>
					<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={() => history.goBack()}>
						목록
					</Button>
					{	
						(dataState.status == '-1') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickNew}>
								등록
							</Button>
						)
					}
					{	
						(dataState.status == 'SS0000' || dataState.status == 'SS00003') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickModify}>
								수정
							</Button>
						)
					}
					{	
						(dataState.status == 'SS0000' || dataState.status == 'SS00003') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickRemove}>
								삭제
							</Button>
						)
					}
					{	
						(dataState.status == 'SS00003') &&
						(
							<Button variant="contained" color="secondary" size="small"  className={classes.button} onClick={handleClickRetry}>
								진행
							</Button>
						)
					}
				</div>
			</Toolbar>
			<Dialog
				open={stateOpen}
				onClose={stateCloseClick}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{stateMessage}
				</DialogContentText>
				</DialogContent>
				<DialogActions>
				<Button onClick={stateComfClick} color="primary" autoFocus>
					확인
				</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}