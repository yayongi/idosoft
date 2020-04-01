import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import MenuItem from '@material-ui/core/MenuItem';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Axios from 'axios';

import Moment from "moment";
Moment.locale('ko'); // 한국 시간

import {processErrCode, phoneFormatter, isEmpty} from "../../../../js/util"; 

import { LoadingBar } from "../../../../common/LoadingBar/LoadingBar";

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
	media: {
		height: 0,
		paddingTop: '100%', // 16:9
	},
	
}));

/*
	state 변경에 Re-Rendering 수행
	state의 값이 이전과 동일해도 수행이 안됨.
	전역 변수는 호출 안됨.
*/
export default function  View(props) {
	const {routeProps } = props;
	const {history, location, match} = routeProps;
	const [expenseTypes, setExpenseTypes] = React.useState([]);

	// 진행 상태 관리
	const [activeStep, setActiveStep] = React.useState(1);

	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const [dataState, setDataState] = React.useState(data);	// state : 수정을 위한 데이터 관리
	const [isAdmin, setIsAdmin] = React.useState("0");
	const classes = useStyles();
	
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(false); // 로딩바

	// step 처리 
	const getStepInfo = (row) => {
		
		let stepInfo = {
			activeStep : 0,
			steps : [
				{label: '진행', isError: false},
				{label: '1차결재완료', isError: false},
				{label: '완료', isError: false},
			]
		}
		
		if(isEmpty(row)){
			return stepInfo;
		}

		if(row.status == 'SS0001') {
			stepInfo.activeStep = 2;
		} else if(row.status == 'SS0002') {
			stepInfo.activeStep = 3;
		} else if(row.status == 'SS0003') {
			stepInfo.activeStep = 0;
			stepInfo.steps[0].label = '반려';
			stepInfo.steps[0].isError = true;
		} else { // 'SS0000' else
		stepInfo.activeStep = 1; // activeStep 1
		stepInfo.steps[0].label = '진행';
		stepInfo.steps[0].isError = false;
		}
		
		return stepInfo;
	}
	
	let stepInfo 	= getStepInfo(dataState);	

	let data 		= {}; // 목록에서 선택한 데이터
	
	const loginSession = JSON.parse(sessionStorage.getItem("loginSession"));

	React.useEffect(() => { // render 완료 후, 호출
		setShowLoadingBar(true);
		
		const params = match.params;

		Axios({
			url: '/intranet/getAppView.exp',
			method: 'post',
			data: {
				expense_no : params.id,
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {

			const exPenseTypeList 	= JSON.parse(response.data.expenseTypeList);
			const payTypeList 		= JSON.parse(response.data.payTypeList);

			setExpenseTypes(exPenseTypeList);
			setActiveStep(stepInfo.activeStep);
			setIsAdmin(response.data.isAdmin);
			const isNoN = response.data.isNoN;

			if(isNoN == "false"){
				data = JSON.parse(response.data.result);
				setDataState(data);
				stepInfo = getStepInfo(data);
				setActiveStep(stepInfo.activeStep);
			} else {
				alert("접근 권한이 없는 직원입니다.", history.back());
			}
			
			setShowLoadingBar(false);
		})
		.catch(e => {
			processErrCode(e);
			console.log(e);
			setShowLoadingBar(false);
		});
	}, []);

	// 버튼 여부  활성화
	const giveAuthorization = () => {
		let isAuth = false;
		const mno = loginSession.member_NO;

		switch (dataState.status) {
		case 'SS0000':
			if(mno == dataState.prevAuthPersonNO || isAdmin == "1"){
				isAuth = true;
			} else {
				isAuth = false;
			}
			break;
		case 'SS0001':
			if(mno == dataState.authPersonNO || isAdmin == "1"){  
				isAuth = true;
			} else {
				isAuth = false;
			}
			break;
		default:
			isAuth = false;
			break;
		}

		return isAuth;
	};

	const [appOpen, setAppOpen] = React.useState(false);
	const [rejOpen, setRejOpen] = React.useState(false);
	const [rejReason, setRejReason] = React.useState('');
	const handleClickOpen = (att) => {
		
		if(att == 'rej'){
			setRejOpen(true);
		} else { // app
			setAppOpen(true);
		}

	};

	const handleClose = (att) => {

		if(att == 'rej'){
			setRejOpen(false);
		} else { // app
			setAppOpen(false);
		}
	};

	// 결재처리
	const handleClickApprove =() => {

		setShowLoadingBar(true);

		let isRequest = "";

		if(dataState.status == 'SS0000'){
			isRequest = "FIR_APP";
		} else {
			isRequest = "APP";
		}

		const params = match.params;


		Axios({
			url: '/intranet/processApproval.exp',
			method: 'post',
			data: {
				expenseNo : params.id, // 경비 번호
				isRequest : isRequest, // 1차결재  : FIR_APP 2차결재  : APP 반려 : REG
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			
			const isError = response.data.isError;
			if(isError == "false"){
				if(dataState.status == 'SS0000'){
					setDataState({
						...dataState,
						status : 'SS0001',
						statusText : '1차결재완료',
						prevAuthDate : Moment().format('YYYY-MM-DD'),
					})
				} else { // dataState.status == 'SS0001' 2차 결재
					setDataState({
						...dataState,
						status : 'SS0002',
						statusText : '완료',
						authDate : Moment().format('YYYY-MM-DD'),
					})
				}
			}

			stepInfo = getStepInfo(dataState);

			setActiveStep(stepInfo.activeStep);
			setAppOpen(false);
			setShowLoadingBar(false);
		})
		.catch(e => {
			processErrCode(e);
			console.log(e);
			setShowLoadingBar(false);
		});
	}

	// 이미지 영역 인쇄
	const printImageArea = () => {
		let container = document.getElementsByName("image");
		
		/** 팝업 */
		let innerHtml = container[0].innerHTML
		let popupWindow = window.open("", "_blank", "width=700,height=800");
		
		popupWindow.document.write(
			"<!DOCTYPE html>"+
			"<html>"+
				"<head>"+
				"</head>"+
				"<body>"+innerHtml+"</body>"+
			"</html>"
		)
	
		popupWindow.document.close()
		popupWindow.focus()

		/** 1초 지연 */
		setTimeout(() => {
			popupWindow.print()         // 팝업의 프린트 도구 시작
			popupWindow.close()         // 프린트 도구 닫혔을 경우 팝업 닫기
		}, 1000)
	}

	// 반려 처리
	const handleClickReject = () => {

		setShowLoadingBar(true);

		let isRequest = "REG";

		const params = match.params;

		Axios({
			url: '/intranet/processApproval.exp',
			method: 'post',
			data: {
				expenseNo : params.id, // 경비 번호
				isRequest : isRequest, // 1차결재  : FIR_APP 2차결재  : APP 반려 : REG
				rejReason : rejReason, // 반려 사유
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			
			const isError = response.data.isError;
			if(isError == "false"){
				setDataState({
					...dataState,
					status : 'SS0003',
					statusText : '반려',
					prevAuthDate : '',
					authDate : '',
				})
			}

			stepInfo = getStepInfo(dataState);
			setActiveStep(stepInfo.activeStep);

			
			setRejOpen(false);
			setShowLoadingBar(false);
		})
		.catch(e => {
			processErrCode(e);
			console.log(e);
			setShowLoadingBar(false);
		});
	}

	const txtChangeHandle = (e) => {
		setRejReason(e.target.value);
	}

	return (
		<>	
			<LoadingBar openLoading={isShowLoadingBar}/>
			{!isEmpty(dataState) &&
			<>
				<div className={classes.root} style={{marginBottom:'10px'}}>
					<Stepper activeStep={activeStep}>
					{!isEmpty(stepInfo) &&
						stepInfo.steps.map(row => (
							<Step key={row.label}>
								<StepLabel error={row.isError}>{row.label}</StepLabel>
							</Step>
						))
					}
					</Stepper>
				</div>
				<Divider/>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<TableContainer component={Paper} style={{marginBottom:'10px'}}>
							<Table aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell align="left" colSpan="2">
											<Typography className={classes.title} color="inherit" variant="h6">					
												등록자 정보
											</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell align="left" component="th" scope="row" style={{width: '120px'}}>등록자</TableCell>
										<TableCell align="left">
											<TextField
												id="register"
												name="register"
												margin="dense"
												value={dataState.name}
												InputProps={{
													readOnly: true,
												}}
												variant="outlined"
												
											/>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="left" component="th" scope="row">연락처</TableCell>
										<TableCell align="left">
											<TextField
												id="tel"
												name="tel"
												margin="dense"
												value={phoneFormatter(dataState.phone)}
												variant="outlined"
												InputProps={{
													readOnly: true,
												}}
											/>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="left" component="th" scope="row">이메일</TableCell>
										<TableCell align="left">
											<TextField
												id="email"
												name="email"
												margin="dense"
												value={dataState.email}
												variant="outlined"
												InputProps={{
													readOnly: true,
												}}
											/>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
					<Grid item xs={12} sm={6}>
					<TableContainer component={Paper} style={{marginBottom:'10px'}}>
						<Table aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell align="left" colSpan="2">
										<Typography className={classes.title} color="inherit" variant="h6" >
											경비 정보
										</Typography>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell align="left" component="th" scope="row" style={{width: '120px'}}>경비유형</TableCell>
									<TableCell align="left">
										{expenseTypes.map((option, idx) => (
											(dataState.expenseType == option.value) && 
											<TextField
												id="expenseType"
												name="expenseType"
												select
												margin="dense"
												variant="outlined"
												value={option.value}
												InputProps={{
													readOnly: true,
												}}
											>
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
										<TextField
											id="regDate"
											name="regDate"
											margin="dense"
											value={dataState.payDate}
											InputProps={{
												readOnly: true,
											}}
											variant="outlined"
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell align="left" component="th" scope="row">금액</TableCell>
									<TableCell align="left">
										<TextField
											id="pay"
											name="pay"
											margin="dense"
											value={Number(dataState.pay).toLocaleString()}
											InputProps={{
												readOnly: true,
											}}
											variant="outlined"
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell align="left" component="th" scope="row">내용</TableCell>
									<TableCell align="left">
										<TextField
											id="memo"
											name="memo"
											rows="5"
											value={dataState.memo}
											variant="outlined"
											InputProps={{
												readOnly: true,
											}}
											multiline
											fullWidth
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell align="left" component="th" scope="row">영수증</TableCell>
									<TableCell align="left">
										<Card className={classes.root}>
											<CardContent>
												<div name="image">
													<img
														src={dataState.filePath}
														title="image"
														id="image"
													/>
												</div>
											</CardContent>
											<CardActions>
												<Button size="small" onClick={printImageArea}>인쇄</Button>
											</CardActions>
											</Card>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
					</Grid>
				</Grid>
				
				<Divider/>
				<TableContainer component={Paper} style={{marginBottom:'10px'}}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="left" colSpan="2">
									<Typography className={classes.title} color="inherit" variant="h6">					
										결재 정보
									</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell align="left" component="th" scope="row">결재란</TableCell>
								<TableCell align="left">
									<TableContainer component={Paper} style={{marginBottom:'10px', width:300, Align:'center'}}>
										<Table aria-label="simple table">
											<TableBody>
												<TableRow>
													<TableCell align="center">1차 결재자<br/>({dataState.prevAuthPerson})</TableCell>
													<TableCell align="center">2차 결재자<br/>({dataState.authPerson})</TableCell>
												</TableRow>
												<TableRow>
													<TableCell align="center">
														{!isEmpty(dataState.prevAuthDate) && Moment(dataState.prevAuthDate).format('YYYY-MM-DD')}
														<br/>
													</TableCell>
													<TableCell align="center">
														{!isEmpty(dataState.authDate) && Moment(dataState.authDate).format('YYYY-MM-DD')}
														<br/>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
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
							// 진행상태와 (1차 결재자 or 2차 결재자) 여부에 따라 조건 분기 처리 필요
							(giveAuthorization()) &&
							(
								<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={() => handleClickOpen('app')}>
									결재
								</Button>
							)
						}
						{	
							(giveAuthorization()) &&
							(
								<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={() => handleClickOpen('rej')}>
									반려
								</Button>
							)
						}
					</div>
				</Toolbar>
			</>
			}
			<div>
				<Dialog open={rejOpen} onClose={() => handleClose('rej')} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">반려 사유</DialogTitle>
					<DialogContent>
					<DialogContentText>
						반려사유를 입력해주세요.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="사유"
						type="text"
						fullWidth
						onChange={txtChangeHandle}
					/>
					</DialogContent>
					<DialogActions>
					<Button onClick={() => handleClose('rej')} color="primary">
						취소
					</Button>
					<Button onClick={handleClickReject} color="primary">
						확인
					</Button>
					</DialogActions>
				</Dialog>
			</div>

			<div>
				<Dialog
					open={appOpen}
					onClose={() => handleClose('app')}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogContent>
					<DialogContentText id="alert-dialog-description">
						결재하시겠습니까?
					</DialogContentText>
					</DialogContent>
					<DialogActions>
					<Button onClick={() => handleClose('app')} color="primary">
						취소
					</Button>
					<Button onClick={handleClickApprove} color="primary" autoFocus>
						확인
					</Button>
					</DialogActions>
				</Dialog>
			</div>
		</>
	);
}