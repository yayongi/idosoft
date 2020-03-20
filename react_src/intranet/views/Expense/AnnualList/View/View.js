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
import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";
import Moment from "moment";

import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

import { AnnualStorage, expenseTypes, getStepInfo } from 'views/Expense/data';
import PreviewFileUpload from 'common/PreviewFileUpload';


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
	expenseType: "0",
	expenseTypeText: "야간경비",
	payDate: Moment(new Date()).format('YYYY-MM-DD'),
	status: "-1",
	statusText: "진행",
	memo: "",
	rejectMemo: "",
	register: "오경섭"
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

	let dataList = JSON.parse(AnnualStorage.getItem("ANNUAL_LIST"));		// 데이터
	let data = JSON.parse(AnnualStorage.getItem("ANNUAL_VIEW"));		// 목록에서 선택한 데이터
	if(screenType == 'new') {
		data = emptyData
	}

	// state : 진행 상태
	const [activeStep, setActiveStep] = React.useState(1);

	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const [dataState, setDataState] = React.useState(data);	// state : 수정을 위한 데이터 관리

	const isReadOnly = (data.status != undefined && data.status != '-1' && data.status != '0' && data.status != '3');				// 신규, 진행, 반려가 아니면 수정이 안되도록 설정

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
		setDataState({
			...dataState,
			payDate: Moment(date).format('YYYY-MM-DD')
		});
	}

	let stepInfo = getStepInfo(data);	// Re-Rendering 시점에는 호출 되지 않음.
	
	React.useEffect(() => {		// render 완료 후, 호출
		console.log("call useEffect");
		setActiveStep(stepInfo.activeStep);
	}, []);

	// 반려사유
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const heandleClickRejectMemo = event => {
		setAnchorEl(event.currentTarget);
		setOpen(!open);
	}
	// 글 등록 후, 목록으로 이동
	const handleClickNew = () => {
		console.log("call handleClickNew");
		let max = 0;
		dataList.map(item => {
			Number(item.seq) > max ? max = Number(item.seq) : max  
		})
		const next = max + 1;
		dataState.seq = next.toString();
		
		dataList = [
			dataState,
			...dataList
		];
		AnnualStorage.setItem("ANNUAL_LIST", JSON.stringify(dataList));
		history.goBack();
	}

	// 글 삭제 후, 목록으로 이동
	const handleClickRemove = () => {
		console.log("call handleClickRemove");
		const dataIdx = dataList.findIndex(item => item.seq === data.seq);
		
		if(dataIdx > -1) {
			dataList = [
				...dataList.slice(0, dataIdx),
				...dataList.slice(dataIdx+1)
			];
			AnnualStorage.setItem("ANNUAL_LIST", JSON.stringify(dataList));
			alert("삭제 완료 후, 목록으로 이동합니다.");
			history.goBack();
		}
	}
	// 수정처리
	const handleClickModify =() => {
		console.log("call handleClickModify");
		const dataIdx = dataList.findIndex(item => item.seq === data.seq);

		if(dataIdx > -1) {
			dataList = [
				...dataList.slice(0, dataIdx),
				dataState,
				...dataList.slice(dataIdx+1)
			];
			AnnualStorage.setItem("ANNUAL_LIST", JSON.stringify(dataList));
			AnnualStorage.setItem("ANNUAL_VIEW", JSON.stringify(dataState));
			alert("수정 완료되었습니다.");
			history.goBack();
		}
	}
	// 반려건, 다시 진행
	const handleClickRetry = () => {
		console.log("call handleClickRetry");
		const dataIdx = dataList.findIndex(item => item.seq === data.seq);
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
			alert("다시 결재 진행합니다.");
			// history.goBack();
		}
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
								<TextField
									id="expenseType"
									name="expenseType"
									select
									margin="dense"
									variant="outlined"
									value={dataState.expenseType}
									onChange={handleChange}
									InputProps={{
									 	 readOnly: isReadOnly,
									}}
									fullWidth>
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
											value={new Date(Number(dataState.payDate.slice(0, 4)), Number(dataState.payDate.slice(5, 7))-1, Number(dataState.payDate.slice(8, 10)))}
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
									defaultValue={dataState.pay}
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
						(data.status == '-1') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickNew}>
								등록
							</Button>
						)
					}
					{	
						(data.status == '0' || data.status == '3') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickModify}>
								수정
							</Button>
						)
					}
					{	
						(data.status == '0' || data.status == '3') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickRemove}>
								삭제
							</Button>
						)
					}
					{	
						(data.status == '3') &&
						(
							<Button variant="contained" color="secondary" size="small"  className={classes.button} onClick={handleClickRetry}>
								진행
							</Button>
						)
					}
				</div>
			</Toolbar>
		</>
	);
}