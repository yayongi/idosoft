
import React, { Fragment } from 'react';

import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";

import Moment from "moment";
Moment.locale('ko'); // 한국 시간

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

//Server
import axios from 'axios';

import {useStyles} from './styles';
import {data_2020_03, data_2020_01,data_2019_12, data_2019_11
	, data_2019_10, data_2019_09, data_2019_08
	, data_2019_07, nondata} from './data';


	const Transition = React.forwardRef(function Transition(props, ref) {
		return <Slide direction="up" ref={ref} {...props} />;
	});
	
	export default function MonthlystatMemberSelectView(props) {
		const classes = useStyles();				// styles.js에 상수로 선언되어 있음. 
		
	const [state, setState] = React.useState({	// state 생성 (hooks 구조임)
		members : data_2020_03.members,
		totalExpense : data_2020_03.totalExpense,
		expenseInfo : data_2020_03.expenseInfo,
		empno : '',
		indiTotalExpense : 0
	});
	
	const [selectedDate, setSelectedDate] = React.useState(new Date());
	
	const handleDateChange = (date) => {
		
		setSelectedDate(date);
		
		console.log(`선택 날짜 : ${Moment(date).format('YYYYMM')}`);

		let memberData = {};
		let expenseInfo = {};
		let totalExpense = {};

		let year = Moment(date).format('YYYY');
		let month = Moment(date).format('MM');
		
		console.log(` year : ${year}`);
		console.log(` month : ${month}`);

		if(year == 2020) {	
			switch(month){
				case '01' :
					memberData = data_2020_01.members;
					expenseInfo = data_2020_01.expenseInfo;
					totalExpense = data_2020_01.totalExpense;
					break;
				default : 
					memberData = nondata.members;
					expenseInfo = nondata.expenseInfo;
					totalExpense = nondata.totalExpense;
					break;
			}
		} else if(year == 2019) {
			switch(month){
				case '07' :
					memberData = data_2019_07.members;
					expenseInfo = data_2019_07.expenseInfo;
					totalExpense = data_2019_07.totalExpense;
					break;
				case '08' : 
					memberData = data_2019_08.members;
					expenseInfo = data_2019_08.expenseInfo;
					totalExpense = data_2019_08.totalExpense;
					break;
				case '09' : 
					memberData = data_2019_09.members;
					expenseInfo = data_2019_09.expenseInfo;
					totalExpense = data_2019_09.totalExpense;
					break;
				case '10' : 
					memberData = data_2019_10.members;
					expenseInfo = data_2019_10.expenseInfo;
					totalExpense = data_2019_10.totalExpense;
					break;
				case '11' : 
					memberData = data_2019_11.members;
					expenseInfo = data_2019_11.expenseInfo;
					totalExpense = data_2019_11.totalExpense;
					break;
				case '12' : 
					memberData = data_2019_12.members;
					expenseInfo = data_2019_12.expenseInfo;
					totalExpense = data_2019_12.totalExpense;
					break;
				default : 
					memberData = nondata.members;
					expenseInfo = nondata.expenseInfo;
					totalExpense = nondata.totalExpense;
					break;
			}
		} else {
			memberData = nondata.members;
			expenseInfo = nondata.expenseInfo;
			totalExpense = nondata.totalExpense;
		}

		if(memberData === undefined || memberData.length ==0) {
			memberData = nondata.members;
			expenseInfo = nondata.expenseInfo;
			totalExpense = nondata.totalExpense;
		}
		
		setState({
			...state,
			[name]: event.target.value,
			members: memberData,
			totalExpense: totalExpense,
			expenseInfo : expenseInfo,
		});

	}

	const {members, totalExpense, year, month, expenseInfo, empno, indiTotalExpense} = state;
	const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; 

	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		//console.log( `open : ${open}`);
		//console.log(`memberData : ${state.memberData}`);
	});

	const handleClickOpen = (e) => {
		console.log('open');
		console.log(`empno : ${e.target.dataset.empno}`);
		
		let empno = e.target.dataset.empno;
		let indiTotalExpense = 0;
		
		expenseInfo.map((value) => {
			console.log(`expenseInfo.empno : ${value.empno}`);
			console.log(`empno : ${empno}`);
			console.log(`value : ${value.ExpenseAmount}`);

			if(value.empno == empno){
				indiTotalExpense += Number(value.ExpenseAmount);
			}
		});


		setState({
			...state,
			empno : empno,
			indiTotalExpense : indiTotalExpense
		});
		
		setOpen(true);
	};

	const handleClose = () => {
		console.log('close');
		setOpen(false);
	};

	const excelDownload = (e) => {
		console.log('엑셀다운로드 실행');
		console.log(`excel export member : ${typeof(JSON.stringify(data_2020_01.members))}`)
		
		axios({
			url: '/intranet/downloadExcelFile',
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				title : 'TEST',
				jsonArrData : JSON.stringify(data_2020_01.members)
			}
		}).then(response => {
			console.log('Excel Export Success' + JSON.stringify(response));	
		}).catch(e => {
			console.log(e);
		});
	};
	
	const indiExcelDownload = (e) => {
		console.log('엑셀다운로드 실행');
		console.log(`excel export member : ${typeof(JSON.stringify(data_2020_01.members))}`)
		
		axios({
			url: '/intranet/downloadExcelFile',
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				title : 'TEST',
				jsonArrData : JSON.stringify(data_2020_01.members)
			}
		}).then(response => {
			console.log('Excel Export Success' + JSON.stringify(response));	
		}).catch(e => {
			console.log(e);
		});
	};

	return (
		<Fragment>
			<Card>
				<CardContent>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
								<Grid container justify="space-around">
									<KeyboardDatePicker
									locale='ko' 
									margin="normal"
									id="date-picker-dialog1"
									label={props.label}
									views={["year", "month"]}
									format="yyyy/MM" 
									maxDate={new Date()}
									value={selectedDate}
									onChange={handleDateChange}
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
									/>
								</Grid>
							</MuiPickersUtilsProvider>
						</Grid>
					</Grid>
					<div style={{height : 20}}/>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							총금액 : {(Number)(totalExpense).toLocaleString()} 원
						</Grid>
					</Grid>
					<div style={{height : 20}}/>
					<Grid container spacing={3}>
						{state.members.map((value, idx) => (
							<Grid item xs={12} key={idx}>
								<Paper className={classes.paper} onClick={handleClickOpen} data-empno={value.empno}>{`${value.name} / ${value.position} / ${(Number)(value.totalExpense).toLocaleString()} 원`} </Paper>
							</Grid>
						))}
					</Grid>
				</CardContent>
			</Card>
			<Fab variant="extended" color="primary" aria-label="add" className={classes.fab} onClick={excelDownload}>
				<SaveIcon className={classes.saveIcon} />
				엑셀다운로드
			</Fab>

			{/* Diallog Area START */}

			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
						<CloseIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<div className={classes.margin_1}>
					<div style={{height : 20}}></div>
					<Grid container spacing={3}>
						<Grid item xs={6}>
							<h4>총 금액 : {(Number)(indiTotalExpense).toLocaleString()} 원</h4> 
						</Grid>
						<Grid item xs={6} className={classes.right}>
							<Fab variant="extended" color="primary" aria-label="add" className={classes.fab} onClick={indiExcelDownload}>
								<SaveIcon className={classes.saveIcon} />
								엑셀다운로드
							</Fab>
						</Grid>
					</Grid>
					<div style={{height : 20}}></div>
					<TableContainer component={Paper}>
						<Table className={classes.table} aria-label="simple table">
							<TableHead>
							<TableRow>
								<TableCell align="center">경비번호</TableCell>
								<TableCell align="center">경비유형</TableCell>
								<TableCell align="center">내용</TableCell>
								<TableCell align="center">금액</TableCell>
								<TableCell align="center">결제일</TableCell>
							</TableRow>
							</TableHead>
							<TableBody>
							{expenseInfo.map(row => (
								(empno == row.empno) && ( // 직원번호 비교 후, 출력
									<TableRow key={row.no}>
									<TableCell component="th" scope="row" align="right">
										{row.no}
									</TableCell>
									<TableCell align="left">{row.expType}</TableCell>
									<TableCell align="left">{row.contents}</TableCell>
									<TableCell align="right">{(Number)(row.ExpenseAmount).toLocaleString()}</TableCell>
									<TableCell align="right">{Moment(row.payDate).format('LL')}</TableCell>
									</TableRow>
								)
							))}
							</TableBody>
						</Table>
					</TableContainer> 
				</div>
			</Dialog>

			{/* Diallog Area END */}
		</Fragment>
	);
}