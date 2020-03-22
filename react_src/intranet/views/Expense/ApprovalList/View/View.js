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

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Moment from "moment";
Moment.locale('ko'); // 한국 시간

import { AnnualStorage, expenseTypes, getStepInfo } from 'views/Expense/data';

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
	console.log("call View Area");

	const {routeProps } = props;
	const {history, location, match} = routeProps;

	let dataList = JSON.parse(AnnualStorage.getItem("ANNUAL_LIST"));		// 데이터
	let data = JSON.parse(AnnualStorage.getItem("ANNUAL_VIEW"));		// 목록에서 선택한 데이터

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

	// 진행 상태 관리
	const [activeStep, setActiveStep] = React.useState(1);

	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const [dataState, setDataState] = React.useState(data);	// state : 수정을 위한 데이터 관리

	const classes = useStyles();
	
	let stepInfo = getStepInfo(data);	// Re-Rendering 시점에는 호출 되지 않음.
	
	React.useEffect(() => {		// render 완료 후, 호출
		console.log("call useEffect");
		
		setActiveStep(stepInfo.activeStep);
	}, []);

	// 결재처리
	const handleClickApprove =() => {

		console.log("call handleClickApprove");
		const dataIdx = dataList.findIndex(item => item.seq === data.seq);
		if(data.status == '0'){ // 진행 - 1차 결재 수행
			data.status = "1";
			data.statusText = "1차결재완료";
			data.prevAuthDate = Moment().format('YYYY-MM-DD'); 
		} else { // data.status == '1' // 1차결재완료 - 2차 결재 수행
			data.status = "2";
			data.statusText = "완료";
			data.authDate = Moment().format('YYYY-MM-DD'); 
		}
		stepInfo = getStepInfo(data);

		setActiveStep(stepInfo.activeStep)

		if(dataIdx > -1) {
			dataList = [
				...dataList.slice(0, dataIdx),
				data,
				...dataList.slice(dataIdx+1)
			];
			AnnualStorage.setItem("ANNUAL_LIST", JSON.stringify(dataList));
			AnnualStorage.setItem("ANNUAL_VIEW", JSON.stringify(data));
			// history.goBack();
			setDataState(data);
		}
		
		return setAppOpen(false);
	}

	// 이미지 영역 인쇄
	const printImageArea = () => {
		let container = document.getElementsByName("image");
		
		//console.log('container : ' + JSON.stringify(container));
		/** 팝업 */
		let innerHtml = container[0].innerHTML
		let popupWindow = window.open("", "_blank", "width=700,height=800");
		
		popupWindow.document.write("<!DOCTYPE html>"+
		"<html>"+
			"<head>"+
			"</head>"+
			"<body>"+innerHtml+"</body>"+
		"</html>")
	
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
		console.log("call handleClickReject");
		const dataIdx = dataList.findIndex(item => item.seq === data.seq);
		data.status="3";
		data.statusText="반려";
		data.rejectMemo=rejReason; // 반려사유 등록

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
			// history.goBack();
		}

		return setRejOpen(false);
	}

	const txtChangeHandle = (e) => {
		setRejReason(e.target.value);
	}

	return (
		<>
			<div className={classes.root} style={{marginBottom:'10px'}}>
				<Stepper activeStep={activeStep}>
					{stepInfo.steps.map(row => (
						<Step key={row.label}>
							<StepLabel error={row.isError}>{row.label}</StepLabel>
						</Step>
					))}
				</Stepper>
			</div>
			<Divider/>

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
									defaultValue={dataState.register}
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
									defaultValue="연락처"
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
									defaultValue="이메일"
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
			<Divider/>
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
								<TextField
									id="expenseType"
									name="expenseType"
									select
									margin="dense"
									variant="outlined"
									value={dataState.expenseType}
									InputProps={{
									 	 readOnly: true,
									}}
								>
									{expenseTypes.map((option, idx) => (
										idx != 0 && 
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">결제일</TableCell>
							<TableCell align="left">
								<TextField
									id="regDate"
									name="regDate"
									margin="dense"
									defaultValue={dataState.payDate}
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
									defaultValue={dataState.pay}
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
									defaultValue={dataState.memo}
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
												src="http://cafefiles.naver.net/20091123_20/ippoom2_1258970814632O7W2g_jpg/i8mqtlp05mmg18_n00489_ippoom2.jpg"
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
													{dataState.prevAuthDate}
													<br/>
												</TableCell>
												<TableCell align="center">
													{dataState.authDate}
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
						(data.status == '0' || data.status == '1') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={() => handleClickOpen('app')}>
								결재
							</Button>
						)
					}
					{	
						(data.status == '0') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={() => handleClickOpen('rej')}>
								반려
							</Button>
						)
					}
				</div>
			</Toolbar>
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