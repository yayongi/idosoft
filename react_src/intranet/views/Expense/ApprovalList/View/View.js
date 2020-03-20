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
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";

import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

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
		
	}
	// 반려 처리
	const handleClickReject = () => {
		console.log("call handleClickReject");
		
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
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left" colSpan="2">
								<Typography className={classes.title} color="inherit" variant="h6">					
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
									id="pay"
									name="pay"
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
								{/*영수증 이미지*/}
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
						(data.status == '0') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickApprove}>
								결재
							</Button>
						)
					}
					{	
						(data.status == '0') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickReject}>
								반려
							</Button>
						)
					}
				</div>
			</Toolbar>
		</>
	);
}