
import React, { Fragment } from 'react';

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
import Typography from '@material-ui/core/Typography';
import { Divider, Button, Hidden } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";

import {excelExport, processErrCode, isEmpty} from '../../../js/util';

import Moment from "moment";
Moment.locale('ko'); // 한국 시간

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

//Server
import Axios from 'axios';

import {useStyles} from './styles';

	const Transition = React.forwardRef(function Transition(props, ref) {
		return <Slide direction="up" ref={ref} {...props} />;
	});
	
	export default function MonthlystatMemberSelectView(props) {
		const classes = useStyles();				// styles.js에 상수로 선언되어 있음. 
	
	const {routeProps} = props;
	const {history} = routeProps;
	
	const [members, setMembers] = React.useState([]);
	const [totalAmount, setTotalAmount] = React.useState(0);
	const [indiExpenseInfo, setIndiExpenseInfo] = React.useState([]);
	const [indiTotalAmount, setIndiTotalAmount] = React.useState(0);

	const [open, setOpen] = React.useState(false);

	const [selectedDate, setSelectedDate] = React.useState(new Date());
	
	React.useEffect(() => {
	console.log("call useEffect");

		console.log(` YYYYMM : ${String(Moment(new Date()).format('YYYYMM'))}`);

		Axios({
			url: '/intranet/getMonthlyExpense.exp',
			method: 'post',
			data: {
				regDate : String(Moment(new Date()).format('YYYYMM'))
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			console.log(JSON.stringify(response.data));
			console.log(JSON.stringify(response.data.isError));

			if(response.data.isError == "true"){
				return alert(response.data.errorMessage , history.goBack());
			}

			const list = JSON.parse(response.data.list);
			const total_amount = response.data.totalAmount;

			setMembers(list);
			setTotalAmount(total_amount);
			
		}).catch(e => {
			//processErrCode(e);
			console.log(e);
		});
		
	}, []);

	const handleDateChange = (date) => {
		
		setSelectedDate(date);
		
		console.log(`선택 날짜 : ${Moment(date).format('YYYYMM')}`);
		const regDate = Moment(date).format('YYYYMM');
		
		Axios({
			url: '/intranet/getMonthlyExpense.exp',
			method: 'post',
			data: {
				regDate : regDate
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			const list = JSON.parse(response.data.list);
			const total_amount = response.data.totalAmount;

			setMembers(list);
			setTotalAmount(total_amount);
			
		}).catch(e => {
			processErrCode(e);
			console.log(e);
		});

	}

	const handleClickOpen = (MEMBER_NO) => {
		console.log('open');
		
		Axios({
			url: '/intranet/getMonthlyExpenseView.exp',
			method: 'post',
			data: {
				regDate : Moment(selectedDate).format('YYYYMM'),
				MEMBER_NO : MEMBER_NO
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			const list = JSON.parse(response.data.list);
			const total_amount = response.data.totalAmount;
			
			setIndiExpenseInfo(list);
			setIndiTotalAmount(total_amount);
			setOpen(true);
			
		}).catch(e => {
			processErrCode(e);
			console.log(e);
		});
		
	};

	const handleClose = () => {
		console.log('close');
		setOpen(false);
	};
	
	const excelDownload = (e) => {
		console.log('엑셀다운로드 실행');
		console.log(`excel export member : ${typeof(JSON.stringify(data_2020_01.members))}`)
		
		excelExport(data_2020_01.members);
	};

	
	const indiExcelDownload = (e) => {
		console.log(`excel export member : ${typeof(JSON.stringify(data_2020_01.members))}`)
		excelExport(data_2020_01.members);
	};

	return (
		<Fragment>
			{!isEmpty(members) &&
			<>
				<Toolbar className={classes.root}>
					<Typography className={classes.title} color="secondary" variant="subtitle2">					
					</Typography>
					<div className={classes.container}>
						<Hidden smDown>
							<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} onClick={excelExport} className={classes.button}>
								엑셀 내보내기
							</Button>
						</Hidden>
						<Hidden mdUp>
							<IconButton color="primary" onClick={excelExport} className={classes.button}>
								<SaveIcon />
							</IconButton>
						</Hidden>
					</div>
				</Toolbar>
				
				<Divider />
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
								<Typography className={classes.title} color="secondary" variant="subtitle2">					
									총금액 : {Number(totalAmount).toLocaleString()} 원
								</Typography>
							</Grid>
						</Grid>
						<div style={{height : 20}}/>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TableContainer component={Paper}>
									<Table className={classes.table} aria-label="simple table">
										<TableHead>
										<TableRow>
											<TableCell align="center">성명</TableCell>
											<TableCell align="center">직급</TableCell>
											<TableCell align="center">총 합계</TableCell>
										</TableRow>
										</TableHead>
										<TableBody>
										{members.map(row => (
											<TableRow key={row.MEMBER_NO} onClick={() => handleClickOpen(row.MEMBER_NO)}>
											<TableCell align="center">{row.NAME}</TableCell>
											<TableCell align="center">{row.POSITION}</TableCell>
											<TableCell align="center">{Number(row.TOTAL_AMOUNT).toLocaleString()} 원</TableCell>
											</TableRow>
										))}
										</TableBody>
									</Table>
								</TableContainer>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</>
			}

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
						<Toolbar className={classes.root}>
							<Typography className={classes.title} color="secondary" variant="subtitle2">					
								총금액 : {Number(indiTotalAmount).toLocaleString()} 원
							</Typography>
							<div className={classes.container}>
								<Hidden smDown>
									<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon  />} onClick={excelExport} className={classes.button}>
										엑셀 내보내기
									</Button>
								</Hidden>
								<Hidden mdUp>
									<IconButton color="primary" onClick={excelExport} className={classes.button}>
										<SaveIcon />
									</IconButton>
								</Hidden>
							</div>
						</Toolbar>
					</Grid>
					<div style={{height : 20}}></div>
					<TableContainer component={Paper}>
						<Table className={classes.table} aria-label="simple table">
							<TableHead>
							<TableRow>
								<TableCell align="center">경비<br/>번호</TableCell>
								<TableCell align="center">경비<br/>유형</TableCell>
								<TableCell align="center">내용</TableCell>
								<TableCell align="center">금액</TableCell>
								<TableCell align="center">결제일</TableCell>
							</TableRow>
							</TableHead>
							<TableBody>
							{indiExpenseInfo.map(row => (
								<TableRow key={row.EXPENSE_NO}>
									<TableCell component="th" scope="row" align="center">
										{row.EXPENSE_NO}
									</TableCell>
									<TableCell align="center">{row.CODE_NAME}</TableCell>
									<TableCell align="center">{row.USE_CN}</TableCell>
									<TableCell align="center">{(Number)(row.AMOUNT).toLocaleString()}</TableCell>
									<TableCell align="center">{row.USE_DATE}</TableCell>
								</TableRow>
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
