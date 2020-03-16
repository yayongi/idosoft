

import React, { Fragment } from 'react';
import moment from 'moment';

import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
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
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {useStyles} from './styles';
import {data_2020_01, data_2019_12, data_2019_11
	, data_2019_10, data_2019_09, data_2019_08
	, data_2019_07, nondata} from './data';

export default function MonthlystatMemberSelectView() {
	const classes = useStyles();				// styles.js에 상수로 선언되어 있음. 

	const [state, setState] = React.useState({	// state 생성 (hooks 구조임)
		members : data_2020_01.members,
		totalExpense : data_2020_01.totalExpense,
		year : '',
		month : '',
	});
	
	//Dialog
	function createData(name, calories, fat, carbs, protein) {
	return { name, calories, fat, carbs, protein };
	}
	
	const rows = [
		createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
		createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
		createData('Eclair', 262, 16.0, 24, 6.0),
		createData('Cupcake', 305, 3.7, 67, 4.3),
		createData('Gingerbread', 356, 16.0, 49, 3.9),
	];

	const members	= state.members;
	const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; 

	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		//console.log( `open : ${open}`);
		console.log(`memberData : ${state.memberData}`);
	});

	const handleClickOpen = () => {
		console.log('open');
		setOpen(true);
	};

	const handleClose = () => {
		console.log('close');
		setOpen(false);
	};

	const Transition = React.forwardRef(function Transition(props, ref) {
		return <Slide direction="up" ref={ref} {...props} />;
	});

	// Select로 구성할 년도 목록
	const getYearList = (period) => {
		const d = new Date();
		const yearArr = new Array(period);
		return yearArr.fill(0).map( (value, idx) => {
			return d.getFullYear() - idx;
		});
	};

	const excelDownload = (e) => {
		alert('엑셀다운로드 실행');
	};
	/*
	 * 년도 변경 시, 호출
	 * data.js에 더미 데이터 생성하여 로드
	*/
	const YearSelectBoxChange = name => event => {

		let memberData = {};
		let totalExpense = {};
		let month = Number(state.month);
		let year = Number(event.target.value);
		
		console.log(` year : ${year}`);
		console.log(` month : ${month}`);

		if(year == 2020) {	
			switch(month){
				case 1 :
					memberData = data_2020_01.members;
					totalExpense = data_2020_01.totalExpense;
					break;
				default : 
					memberData = nondata.members;
					totalExpense = nondata.totalExpense;
					break;
			}
		} else if(year == 2019) {
			switch(month){
				case 7 :
					memberData = data_2019_07.members;
					totalExpense = data_2019_07.totalExpense;
					break;
				case 8 : 
					memberData = data_2019_08.members;
					totalExpense = data_2019_08.totalExpense;
					break;
				case 9 : 
					memberData = data_2019_09.members;
					totalExpense = data_2019_09.totalExpense;
					break;
				case 10 : 
					memberData = data_2019_10.members;
					totalExpense = data_2019_10.totalExpense;
					break;
				case 11 : 
					memberData = data_2019_11.members;
					totalExpense = data_2019_11.totalExpense;
					break;
				case 12 : 
					memberData = data_2019_12.members;
					totalExpense = data_2019_12.totalExpense;
					break;
				default : 
					memberData = nondata.members;
					totalExpense = nondata.totalExpense;
					break;
			}
		} else {
			memberData = nondata.members;
			totalExpense = nondata.totalExpense;
		}

		if(memberData === undefined || memberData.length ==0) {
			memberData = nondata.members;
			totalExpense = nondata.totalExpense;
		}
		
		setState({
			...state,
			[name]: event.target.value,
			year : event.target.value,
			members: memberData,
			totalExpense: totalExpense
		});
	};

	/*
	 * 달 변경 시, 호출
	 * data.js에 더미 데이터 생성하여 로드
	*/

	const MonthSelectBoxChange = name => event => {

		let memberData = {};
		let totalExpense = "";
		let month = Number(event.target.value);
		let year = Number(state.year);
		
		console.log(` year : ${year}`);
		console.log(` month : ${month}`);

		if(year == 2020) {	
			switch(month){
				case 1 :
					memberData = data_2020_01.members;
					totalExpense = data_2020_01.totalExpense;
					break;
				default : 
					memberData = nondata.members;
					totalExpense = nondata.totalExpense;
					break;
			}
		} else if(year == 2019) {
			switch(month){
				case 7 :
					memberData = data_2019_07.members;
					totalExpense = data_2019_07.totalExpense;
					break;
				case 8 : 
					memberData = data_2019_08.members;
					totalExpense = data_2019_08.totalExpense;
					break;
				case 9 : 
					memberData = data_2019_09.members;
					totalExpense = data_2019_09.totalExpense;
					break;
				case 10 : 
					memberData = data_2019_10.members;
					totalExpense = data_2019_10.totalExpense;
					break;
				case 11 : 
					memberData = data_2019_11.members;
					totalExpense = data_2019_11.totalExpense;
					break;
				case 12 : 
					memberData = data_2019_12.members;
					totalExpense = data_2019_12.totalExpense;
					break;
				default : 
					memberData = nondata.members;
					totalExpense = nondata.totalExpense;
					break;
			}
		} else {
			memberData = nondata.members;
			totalExpense = nondata.totalExpense;
		}

		if(memberData === undefined || memberData.length ==0) {
			memberData = nondata.members;
			totalExpense = nondata.totalExpense;
		}

		setState({
			...state,
			[name]: event.target.value,
			month : event.target.value,
			members: memberData,
			totalExpense : totalExpense
		});
	};
	
	return (
		<Fragment>
			<Card>
				<CardContent>
					<FormControl variant="outlined" className={classes.formControl} >
						<NativeSelect
							value={state.buttonYear}
							onChange={YearSelectBoxChange('buttonYear')}
							inputProps={{
								name: 'buttonYear',
								id: 'outlined-age-native-simple',
							}}
							className={classes.selectEmpty}
							>
							{getYearList(5).map((value, idx) => (
								<option key={idx} value={value}>{value}</option>
							))};
						</NativeSelect>
					</FormControl>
					<FormControl className={classes.formControl}>
						<NativeSelect
							value={state.buttonMonth}
							onChange={MonthSelectBoxChange('buttonMonth')}
							inputProps={{
								name: 'buttonMonth',
								id: 'outlined-age-native-simple',
							}}
							className={classes.selectEmpty}
							>
							{monthArr.map((value, idx) => (
								<option key={idx} value={value}>{value}</option>
							))};
						</NativeSelect>
					</FormControl>
					<div style={{height : 20}}/>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							총금액 : {state.totalExpense} 원
						</Grid>
					</Grid>
					<div style={{height : 20}}/>
					<Grid container spacing={3}>
						{state.members.map((value, idx) => (
							<Grid item xs={12} key={idx}>
								<Paper className={classes.paper} onClick={handleClickOpen}>{`${value.name} / ${value.position} / ${value.totalExpense} 원`} </Paper>
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
					<Typography variant="h6" className={classes.title}>
					Sound
					</Typography>
				</Toolbar>
				</AppBar>
				<TableContainer component={Paper}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
						<TableRow>
							<TableCell>Dessert (100g serving)</TableCell>
							<TableCell align="right">Calories</TableCell>
							<TableCell align="right">Fat&nbsp;(g)</TableCell>
							<TableCell align="right">Carbs&nbsp;(g)</TableCell>
							<TableCell align="right">Protein&nbsp;(g)</TableCell>
						</TableRow>
						</TableHead>
						<TableBody>
						{rows.map(row => (
							<TableRow key={row.name}>
							<TableCell component="th" scope="row">
								{row.name}
							</TableCell>
							<TableCell align="right">{row.calories}</TableCell>
							<TableCell align="right">{row.fat}</TableCell>
							<TableCell align="right">{row.carbs}</TableCell>
							<TableCell align="right">{row.protein}</TableCell>
							</TableRow>
						))}
						</TableBody>
					</Table>
				</TableContainer> 
			</Dialog>

			{/* Diallog Area END */}
		</Fragment>
	);
}