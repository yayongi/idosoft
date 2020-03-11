/**
 * 컴포넌트명 : 교통/통신비 관리
 * (Hooks 기술 적용, class + component가 아닌 function 기반 컴포넌트로 state와 life cycle 을 보다 간결하게 사용가능하다.)
 * data.js : 더미데이터 (2020, 2019, 2018, 2017, No Data)
 * styles.js : CSS 스타일
 */

import React, { Fragment } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import {useStyles} from './styles';
import {dataAdmin2020, dataAdmin2019, dataAdmin2018, dataAdmin2017, nodata} from './data';


export default function PayList() {
	const classes = useStyles();	// styles.js에 상수로 선언되어 있음. 
	const [state, setState] = React.useState({	// state 생성 (hooks 구조임)
		year: '', 
		members : dataAdmin2020.members
	});
	const { members } = state;
	const headerCells = [
		"", "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", "합계", "총합계"
	];

	// Select로 구성할 년도 목록
	const getYearList = (period) => {
		const d = new Date();
		const yearArr = new Array(period);
		return yearArr.fill(0).map( (value, idx) => {
			return d.getFullYear() - idx;
		});
	}
	
	const excelDownload = (e) => {
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
		let memberData = {};
		console.log(event.target.value);
		if(event.target.value == 2019) {
			memberData = dataAdmin2019.members;
		} else if(event.target.value == 2018) {
			memberData = dataAdmin2018.members;
		} else if(event.target.value == 2017) {
			memberData = dataAdmin2017.members;
		} else {
			memberData = dataAdmin2020.members;
		}
		
		if(memberData === undefined || memberData.length ==0) {
			memberData = nodata;
		}
		
		
		setState({
			...state,
			[name]: event.target.value,
			members: memberData,
		});
	};
	
	return (
		<Fragment>
			<FormControl variant="outlined" className={classes.formControl} >
				<InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
					Year
				</InputLabel>
				<Select
					native
					value={state.buttonYear}
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
			<Fab variant="extended" color="primary" aria-label="add" className={classes.fab} onClick={excelDownload}>
				<SaveIcon className={classes.saveIcon} />
				엑셀다운로드
			</Fab>

			{members.map((member, idx) => (
				<Card key={idx} className={ classes.cardArea }>
					<CardContent>
						<Typography variant="h6" color="textPrimary" style={{fontWeight: 'bold'}}>
							{member.name}
						</Typography>
					</CardContent>
					<TableContainer key={idx} component={Paper} >
						<Table key={idx}>

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
									<TableRow >
										<TableCell  align={'center'} className={classes.tableBodyCell} style={{minWidth:'80px'}}>교통비</TableCell>
										{/* 1월~12월 교통비*/}
										{member.tptCosts.map((tptCost, idx) => (	
											<TableCell key={idx} align={'right'} className={classes.tableBodyCell}>
												{typeof tptCost === 'number' ? tptCost.toLocaleString() : tptCost}
											</TableCell>
										))}

										{/* 교통비 합계*/}
										<TableCell align={'right'} className={classes.tableBodyCell}>
											{typeof member.tptCostsSum === 'number' ? member.tptCostsSum.toLocaleString() : member.tptCostsSum}
										</TableCell>

										{/* 교통비/통신비 총합계*/}
										<TableCell align={'right'} rowSpan={2} className={classes.tableBodyCell}>
											{typeof member.totalSum === 'number' ? member.totalSum.toLocaleString() : member.totalSum}
										</TableCell>
									</TableRow>
									<TableRow >
										<TableCell align={'center'} className={classes.tableBodyCell} style={{minWidth:'80px'}}>통신비</TableCell>
										{/* 1월~12월 통신비*/}
										{new Array(12).fill(0).map((foo, idx) => (
											<TableCell key={idx} align={'right'} className={classes.tableBodyCell}>
												{typeof member.cmncCost === 'number' ? member.cmncCost.toLocaleString() : member.cmncCost}
											</TableCell>
										))}

										{/* 통신비 합계*/}
										<TableCell align={'right'} className={classes.tableBodyCell}>
											{typeof member.cmncCostSum === 'number' ? member.cmncCostSum.toLocaleString() : member.cmncCostSum}
										</TableCell>
									</TableRow>								
							</TableBody>
						</Table>				
					</TableContainer>
				</Card>
			))}
		</Fragment>
	);
}