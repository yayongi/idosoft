import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
/* import ApprovalListArea from './component/ApprovalListTableArea';
 */
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";

import Moment from "moment";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import {useStyles} from './styles';
/* import TypeInputSelectBox from './TypeInputSelectBox';
import SearchBtn from './SearchBtn';
import NameInputSelectBox from './NameInputSelectBox';
import StateInputSelectBox from './StateInputSelectBox';
import ContTxtBox from './ContTxtBox';
import ExcelExportBtn from './ExcelExportBtn';
import ExpRegBtn from './ExpRegBtn';
import SortInputSelectBox from './SortInputSelectBox'; */

export default function MonthlystatMemberSelectView(props) {
	
	const classes = useStyles();

	// The first commit of Material-UI
	const [selectedDate1, setSelectedDate1] = React.useState(new Date());
	const [selectedDate2, setSelectedDate2] = React.useState(new Date());

	const handleDateChange1 = (date) => {
		setSelectedDate1(date);
		console.log(`선택 날자 : ${Moment(date).format('YYYYMM')}`);
	}

	const handleDateChange2 = (date) => {
		setSelectedDate2(date);
		console.log(`선택 날자 : ${Moment(date).format('YYYYMM')}`);
	}

	return (
		<Card>
			<CardContent>
				<div className={classes.root}>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={10}>
						</Grid>
						<Grid item xs={12} sm={2}>
							<Paper className={classes.center}>{/* <ExpRegBtn/> */}</Paper>
						</Grid>
						<Grid item xs={6} sm={2}>
							<Paper className={classes.paper}>경비 유형</Paper>
						</Grid>
						<Grid item xs={6} sm={4}>
							{/* <TypeInputSelectBox/> */}
						</Grid>
						<Grid item xs={6} sm={2}>
							<Paper className={classes.paper}>성명</Paper>
						</Grid>
						<Grid item xs={6} sm={4}>
							{/* <NameInputSelectBox/> */}
						</Grid>
						<Grid item xs={12} sm={2}>
							<Paper className={classes.paper}>결제 기간</Paper>
						</Grid>
						<Grid item xs={12} sm={4}>
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
									value={selectedDate1}
									onChange={handleDateChange1}
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
									/>
								</Grid>
							</MuiPickersUtilsProvider>
						</Grid>
						<Grid item xs={12} sm={2}>
							<div className={classes.paper}>-</div>
						</Grid>
						<Grid item xs={12} sm={4}>
							<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
								<Grid container justify="space-around">
									<KeyboardDatePicker
									locale='ko' 
									margin="normal"
									id="date-picker-dialog2"
									label={props.label}
									views={["year", "month"]}
									format="yyyy/MM" 
									maxDate={new Date()}
									value={selectedDate2}
									onChange={handleDateChange2}
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
									/>
								</Grid>
							</MuiPickersUtilsProvider>
						</Grid>
						<Grid item xs={6} sm={2}>
							<Paper className={classes.paper}>진행상태</Paper>
						</Grid>
						<Grid item xs={6} sm={4}>
							{/* <StateInputSelectBox/> */}
						</Grid>
						<Grid item xs={6} sm={2}>
							<Paper className={classes.paper}>정렬 기준</Paper>
						</Grid>
						<Grid item xs={6} sm={4}>
							{/* <SortInputSelectBox/> */}
						</Grid>
						<Grid item xs={12} sm={2}>
						<Paper className={classes.paper}>내용</Paper>
						</Grid>
						<Grid item xs={12} sm={8}>
							{/* <ContTxtBox/> */}
						</Grid>
						<Grid item xs={12} sm={2}>
							<Paper className={classes.center}>{/* <SearchBtn/> */}</Paper>
						</Grid>
					</Grid>
					<div style={{height : 20}}/>
					<Grid container spacing={3}>
					<Grid item xs={12} sm={5} className={classes.left}>
									<h4>총금액 :500,000 원 </h4> 
					</Grid>
					<Grid item xs={12} sm={4}>
					</Grid>
					<Grid item xs={12} sm={3} className={classes.right}>
						{/* <ExcelExportBtn/> */}
					</Grid>
					</Grid>
				</div>
				<div style={{height : 20}} />
				{/* <ApprovalListArea/> */}
			</CardContent>
		</Card>
	);
} 