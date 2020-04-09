
import React, { Fragment } from 'react';

import SaveIcon from '@material-ui/icons/Save';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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

import PrintIcon from '@material-ui/icons/Print';

import ko from "date-fns/locale/ko";

import {processErrCode, isEmpty, pathtoFileName} from '../../../js/util';

import { LoadingBar } from '../../../common/LoadingBar/LoadingBar';

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

	const [indiNo, setIndiNo] = React.useState("");
	const [indiName, setIndiName] = React.useState(""); 
	const [indiPosition, setIndiiPosition] 	= React.useState("");

	const [open, setOpen] = React.useState(false);
	const [errOpen, setErrOpen] = React.useState(false);
	const [errMessage, setErrMessage] = React.useState("");
	const [nonHistoryBack, setNonHistoryBack] = React.useState(false); 
	const [contextPath, setContextPath] = React.useState("");
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(false); 

	const [selectedDate, setSelectedDate] = React.useState(new Date());
	
	React.useEffect(() => {

		setShowLoadingBar(true);

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

			if(response.data.isError == "true"){
				return openHandleClick(response.data.errorMessage);
			}

			const list 			= JSON.parse(response.data.list);
			const total_amount 	= response.data.totalAmount;
			const contextPath	= response.data.contextPath;

			setMembers(list);
			setTotalAmount(total_amount);
			setContextPath(contextPath);

			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
			console.log(e);
		});
		
	}, []);

	const handleDateChange = (date) => {
		
		setShowLoadingBar(true)

		setSelectedDate(date);
		
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
			
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
			console.log(e);
		});

	}

	const handleClickOpen = (row) => {
		
		setShowLoadingBar(true);

		Axios({
			url: '/intranet/getMonthlyExpenseView.exp',
			method: 'post',
			data: {
				regDate : Moment(selectedDate).format('YYYYMM'),
				MEMBER_NO : row.MEMBER_NO
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			const list 			= JSON.parse(response.data.list);
			const total_amount 	= response.data.totalAmount;
			
			//POSITION
			setIndiExpenseInfo(list);
			setIndiTotalAmount(total_amount);

			setIndiNo(row.MEMBER_NO);
			setIndiName(row.NAME);
			setIndiiPosition(row.POSITION);
			
			setOpen(true);
			
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
			console.log(e);
		});
		
	};

	const excelExport = (fileCode) => {

		if(!isEmpty(members)){
			let fileName = "";
			let searchData = {};

			if(fileCode == "EXCEL0001"){
				fileName = "EXPENSE";
				searchData = {
							regDate : Moment(selectedDate).format('YYYYMM'),
							MEMBER_NO : indiNo
						}
			} else { // EXCEL0002
				fileName = "EXPENSE";
				searchData = {
							regDate : Moment(selectedDate).format('YYYYMM'),
						}
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
			openHandleClick("목록이 없으면 엑셀을 내보내실 수 없습니다.");
		}
		
	}
	
	// 이미지 영역 인쇄
	const printImageArea = (filePath) => {

		console.log(`filePath : ${filePath}`);
		console.log(`contextPath : ${contextPath}`);
		setShowLoadingBar(true);

		const src = contextPath + pathtoFileName(filePath);

		let innerHtml = `<div name='image'><img src=${src} title='image' style='max-width: 200px;'/></div>`;
		
		/** 팝업 */
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
			setShowLoadingBar(false);
		}, 1000)
	}

	const handleClose = () => {
		setOpen(false);
	};

	const openHandleClick = (msg) => {
		setErrMessage(msg);
		setErrOpen(true);
	}

	const closeHandleClick = () => {
		setErrOpen(false);
		if(!nonHistoryBack){
			history.goBack();
		}
		setNonHistoryBack(false);
	}

	const confHandleClick = () => {
		setErrOpen(false);
		if(!nonHistoryBack){
			history.goBack();
		}
		setNonHistoryBack(false);
	}
	
	return (
		<Fragment>
			<LoadingBar openLoading={isShowLoadingBar}/>
				<Toolbar className={classes.root}>
					<Typography className={classes.title} color="secondary" variant="subtitle2">					
					</Typography>
					<div className={classes.container}>
						<Hidden smDown>
							<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} onClick={() => excelExport("EXCEL0002")} className={classes.button}>
								엑셀 내보내기
							</Button>
						</Hidden>
						<Hidden mdUp>
							<IconButton color="primary" onClick={() => excelExport("EXCEL0002")} className={classes.button}>
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
						{!isEmpty(members) ?
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
											<TableRow key={row.MEMBER_NO} onClick={() => handleClickOpen(row)}>
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
						: 
						<Paper style={{minHeight : "300px", width:"100%", textAlign:"center"}} elevation={0} ><h3 style={{paddingTop:"100px"}}> 월 경비 목록이 없습니다.</h3></Paper>
						}
					</CardContent>
				</Card>

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
						<Typography className={classes.title} variant="h3">					
							{indiName}({indiPosition})
						</Typography>
					</Grid>
					<Grid container spacing={3}>
						<Toolbar className={classes.root}>
							<Typography className={classes.title} color="secondary" variant="subtitle2">					
								총금액 : {Number(indiTotalAmount).toLocaleString()} 원
							</Typography>
							<div className={classes.container}>
								<Hidden smDown>
									<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon  />} onClick={() => excelExport('EXCEL0001')} className={classes.button}>
										엑셀 내보내기
									</Button>
								</Hidden>
								<Hidden mdUp>
									<IconButton color="primary" onClick={() => excelExport('EXCEL0001')} className={classes.button}>
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
									<TableCell align="center" style={{
										maxWidth : 80
									}}>인쇄</TableCell>
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
									<TableCell align="center" style={{
										maxWidth : 80
									}}>
										<IconButton aria-label="delete" className={classes.iconPadding} onClick={() => printImageArea(row.FILEPATH)}>
											<PrintIcon fontSize="small" />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
							</TableBody>
						</Table>
					</TableContainer> 
				</div>
			</Dialog>
			{/* Diallog Area END */}

			<Dialog
				open={errOpen}
				onClose={() => closeHandleClick()}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{errMessage}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => confHandleClick()} color="primary" autoFocus>
						확인
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
