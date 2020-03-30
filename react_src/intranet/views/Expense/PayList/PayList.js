/**
 * 컴포넌트명 : 교통/통신비 관리
 * (Hooks 기술 적용, class + component가 아닌 function 기반 컴포넌트로 state와 life cycle 을 보다 간결하게 사용가능하다.)
 * data.js : 더미데이터 (2020, 2019, 2018, 2017, No Data)
 * styles.js : CSS 스타일
 */

import React, { Fragment } from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import SaveIcon from '@material-ui/icons/Save';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Divider, Button, Hidden } from '@material-ui/core';

import {useStyles} from './styles';
import {dataAdmin2020, dataAdmin2019, dataAdmin2018, dataAdmin2017, nodata} from './data';

import Moment from "moment";
Moment.locale('ko'); // 한국 시간

//Server
import Axios from 'axios';

export default function PayList() {
	const classes = useStyles();	// styles.js에 상수로 선언되어 있음. 

	const [year , setYear] = React.useState([]);					// 선택년도
	const [commList, setCommList] = React.useState([]);				// 통신비 통계 내역
	const [transList, setTransList] = React.useState([]);			// 교통비  통계 내역
	
	const headerCells = [
		"성명","구분 ", "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", "합계", "총합계"
	];

	React.useEffect(() => {

		Axios({
			url: '/intranet/getCommAndTransExpenseList.exp',
			method: 'post',
			data: {
				year : String(Moment(new Date()).format('YYYY'))
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {

			setCommList(JSON.parse(response.data.commList));
			setTransList(JSON.parse(response.data.transList));
			
		}).catch(e => {
			processErrCode(e);
			console.log(e);
		});
		
	}, []);

	// Select로 구성할 년도 목록
	const getYearList = (period) => {
		const d = new Date();
		const yearArr = new Array(period);
		return yearArr.fill(0).map( (value, idx) => {
			return d.getFullYear() - idx;
		});
	}
	
	const excelExport = (e) => {
		alert('엑셀다운로드 실행');
	}


	const inputLabel = React.useRef(null);
	const [labelWidth, setLabelWidth] = React.useState(0);
	React.useEffect(() => {
		setLabelWidth(inputLabel.current.offsetWidth);
	}, []);

	/*
	 * 년도 변경 시, 호출
	 * data.js에 더미 데이터 생성하여 로드
	*/
	const handleChange = name => event => {
		
		const value = event.target.value;

		setYear(value);

		Axios({
			url: '/intranet/getCommAndTransExpenseList.exp',
			method: 'post',
			data: {
				year : value
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {

			setCommList(JSON.parse(response.data.commList));
			setTransList(JSON.parse(response.data.transList));
			
		}).catch(e => {
			processErrCode(e);
			console.log(e);
		});
	};
	
	return (
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
					<FormControl variant="outlined" className={classes.formControl} >
						<InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
							Year
						</InputLabel>
						<Select
							native
							value={year}
							onChange={handleChange('buttonYear')}
							labelWidth={labelWidth}
							inputProps={{
								name: 'buttonYear',
								id: 'outlined-age-native-simple',
							}}
							className={classes.select}
						>
							{getYearList(4).map((value, idx) => (
								<option key={idx} value={value}>{value}</option>
							))};
						</Select>
					</FormControl>
					<TableContainer component={Paper}>
						<Table>
						<TableHead className={ classes.tableHead }>								
							<TableRow>
								{headerCells.map((cell, idx) => (
									<TableCell key={idx} align={'center'} className={classes.tableHeadCell}>
										{cell}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{/* //transList */}
						{commList.map((members, idx) => (
							<Fragment key={`row${idx}`}>
								<TableRow>
									{/* 성명 */}
									<TableCell align={'right'} rowSpan={2} className={classes.tableBodyCell}>
										{members.NAME}
									</TableCell>
									<TableCell  align={'center'} className={classes.tableBodyCell} style={{minWidth:'80px'}}>통신비</TableCell>
									{/* 위치 */}
									{/* 1월~12월 통신비*/}
									{
										commList.map((member, idx1) => (
											members.MEMBER_NO == member.MEMBER_NO &&
											<Fragment key={`row${idx1}`}>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Jan === 'number' ? member.Jan.toLocaleString() : Number(member.Jan).toLocaleString()}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Fab === 'number' ? member.Fab.toLocaleString() : Number(member.Fab).toLocaleString()}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Mar === 'number' ? member.Mar.toLocaleString() : Number(member.Mar).toLocaleString()}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Apr === 'number' ? member.Apr.toLocaleString() : Number(member.Apr).toLocaleString()}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.May === 'number' ? member.May.toLocaleString() : Number(member.May).toLocaleString()}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.June === 'number' ? member.June.toLocaleString() : Number(member.June).toLocaleString()}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.July === 'number' ? member.July.toLocaleString() : Number(member.July).toLocaleString()}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Aug === 'number' ? member.Aug.toLocaleString() : Number(member.Aug).toLocaleString()}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Sept === 'number' ? member.Sept.toLocaleString() : Number(member.Sept).toLocaleString()}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Oct === 'number' ? member.Oct.toLocaleString() : Number(member.Oct).toLocaleString()}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Nov === 'number' ? member.Nov.toLocaleString() : Number(member.Nov).toLocaleString()}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Dec === 'number' ? member.Dec.toLocaleString() : Number(member.Dec).toLocaleString()}
												</TableCell>
											</Fragment>
										))}
									{/* 통신비  합계*/}
									<TableCell align={'right'} className={classes.tableBodyCell}>
										{
											commList.map((member, idx1) => (
												members.MEMBER_NO == member.MEMBER_NO &&
												member.totalAmount.toLocaleString()
											))
										}
									</TableCell>
									{/* 교통비/통신비 총합계*/}
									<TableCell align={'right'} rowSpan={2} className={classes.tableBodyCell}>
										
										{
											commList.map((member, idx1) => (
												members.MEMBER_NO == member.MEMBER_NO &&
												member.commAndTransTotalAmount.toLocaleString()
											))
										}
									</TableCell>
								</TableRow>
								<TableRow>
									
									<TableCell align={'center'} className={classes.tableBodyCell} style={{minWidth:'80px'}}>교통비</TableCell>
									{/* 1월~12월 교통비*/}
									{
										transList.map((member, idx1) => (
											members.MEMBER_NO == member.MEMBER_NO &&
											<Fragment key={`row${idx1}`}>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Jan === 'number' ? member.Jan.toLocaleString() : member.Jan}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Fab === 'number' ? member.Fab.toLocaleString() : member.Fab}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Mar === 'number' ? member.Mar.toLocaleString() : member.Mar}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Apr === 'number' ? member.Apr.toLocaleString() : member.Apr}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.May === 'number' ? member.May.toLocaleString() : member.May}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.June === 'number' ? member.June.toLocaleString() : member.June}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.July === 'number' ? member.July.toLocaleString() : member.July}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Aug === 'number' ? member.Aug.toLocaleString() : member.Aug}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Sept === 'number' ? member.Sept.toLocaleString() : member.Sept}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Oct === 'number' ? member.Oct.toLocaleString() : member.Oct}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Nov === 'number' ? member.Nov.toLocaleString() : member.Nov}
												</TableCell>
												<TableCell  align={'right'} className={classes.tableBodyCell}>
													{typeof member.Dec === 'number' ? member.Dec.toLocaleString() : member.Dec}
												</TableCell>
											</Fragment>
										))}
									{/* 교통비  합계*/}
									<TableCell align={'right'} className={classes.tableBodyCell}>
										{
											transList.map((member, idx1) => (
												members.MEMBER_NO == member.MEMBER_NO &&
												member.totalAmount.toLocaleString()
											))
										}
									</TableCell>
								</TableRow>	
							</Fragment>							
						))}
						</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			</Card>		
		</>		
	);
}