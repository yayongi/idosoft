/**
 * 컴포넌트명 : 교통/통신비 관리
 * (Hooks 기술 적용, class + component가 아닌 function 기반 컴포넌트로 state와 life cycle 을 보다 간결하게 사용가능하다.)
 * data.js : 더미데이터 (2020, 2019, 2018, 2017, No Data)
 * styles.js : CSS 스타일
 */

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

import {useStyles} from './styles';
import {data_2020_01, data_2019_12, data_2019_11
	, data_2019_10, data_2019_09, data_2019_08
	, data_2019_07, nondata} from './data';

export default function MonthlystatMemberSelectView() {
	const classes = useStyles();				// styles.js에 상수로 선언되어 있음. 
	
	const [state, setState] = React.useState({	// state 생성 (hooks 구조임)
		members : data_2020_01.members,
		year : "",
		month : "",
	});
	
	const members	= state.members;
	const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; 

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
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
		console.log(event.target.value);

		

		if(event.target.value == 2020) {	
			switch(month){
				case 1 :
					memberData = data_2020_01.members;
					break;
				default : 
					memberData = nondata.members;
					break;
			}
		} else if(event.target.value == 2019) {
			switch(month){
				case 7 :
					memberData = data_2019_07.members;
					break;
				case 8 : 
					memberData = data_2019_08.members;
					break;
				case 9 : 
					memberData = data_2019_09.members;
					break;
				case 10 : 
					memberData = data_2019_10.members;
					break;
				case 11 : 
					memberData = data_2019_11.members;
					break;
				case 12 : 
					memberData = data_2019_12.members;
					break;
				default : 
					memberData = nondata.members;
					break;
			}
		} else {
			memberData = nondata.members;
		}

		if(memberData === undefined || memberData.length ==0) {
			memberData = nodata;
		}
		
		setState({
			...state,
			[name]: event.target.value,
			year : event.target.value,
			members: memberData,
		});
	};

	/*
	 * 달 변경 시, 호출
	 * data.js에 더미 데이터 생성하여 로드
	*/

	const MonthSelectBoxChange = name => event => {3

		let memberData = {};
		console.log(event.target.value);

		month = event.target.value;

		if(year == 2020) {	
			switch(event.target.value){
				case 1 :
					memberData = data_2020_01.members;
					break;
				default : 
					memberData = nondata.members;
					break;
			}
		} else if(year == 2019) {
			switch(event.target.value){
				case 7 :
					memberData = data_2019_07.members;
					break;
				case 8 : 
					memberData = data_2019_08.members;
					break;
				case 9 : 
					memberData = data_2019_09.members;
					break;
				case 10 : 
					memberData = data_2019_10.members;
					break;
				case 11 : 
					memberData = data_2019_11.members;
					break;
				case 12 : 
					memberData = data_2019_12.members;
					break;
				default : 
					memberData = nondata.members;
					break;
			}
		} else {
			memberData = nondata.members;
		}

		if(memberData === undefined || memberData.length ==0) {
			memberData = nodata;
		}
		
		setState({
			...state,
			[name]: event.target.value,
			month : event.target.value,
			members: memberData,
		});
	};
	
	return (
		<Fragment>
			<Card>
				<CardContent>
					<FormControl variant="outlined" className={classes.formControl} >
						<NativeSelect
							value={state.buttonYear}
							onChange={MonthSelectBoxChange('buttonYear')}
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
						{members.map((value, idx) => (
							<Grid item xs={12} key={idx}>
								<Paper className={classes.paper} onClick={handleClickOpen}>{`${value.name} / ${value.position} / ${value.totalExpense} 원`} </Paper>
							</Grid>
						))}
						{/* <option key={idx} value={value}>{value}</option> */}
						
					</Grid>
				</CardContent>
			</Card>
			<Dialog fullScreen open={open} onClose={                                                                 } TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
					<CloseIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
					Sound
					</Typography>
					<Button autoFocus color="inherit" onClick={handleClose}>
					save
					</Button>
				</Toolbar>
				</AppBar>
			</Dialog>
			<Fab variant="extended" color="primary" aria-label="add" className={classes.fab} onClick={excelDownload}>
				<SaveIcon className={classes.saveIcon} />
				엑셀다운로드
			</Fab>
		</Fragment>
	);
}