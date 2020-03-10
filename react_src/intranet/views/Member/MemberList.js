import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

function createData(id,name, position, address, phone, career,entry, cert ) {
	return { id,name, position, address, phone, career,entry, cert };
}


const rows = [
	createData('1','최문걸','대표', '경기도 안양시 동안구 달안로 75 샛별한양아파트 304동 611호', '010-5174-2860', '3년', '2018.05.09','유'),
	createData('2','조현철','이사', '경기도 안양시 동안구 달안로 75 샛별한양아파트 304동 611호', '010-5174-2860', '3년', '2018.05.09','유'),
	createData('3','박종운', '이사','경기도 안양시 동안구 달안로 75 샛별한양아파트 304동 611호', '010-5174-2860', '3년', '2018.05.09','유'),
	createData('4','허중섭', '부장','경기도 안양시 동안구 달안로 75 샛별한양아파트 304동 611호', '010-5174-2860', '3년', '2018.05.09','유'),
	createData('5','신우인', '부장','경기도 안양시 동안구 달안로 75 샛별한양아파트 304동 611호', '010-5174-2860', '3년', '2018.05.09','유'),
];

const MemberList = () => {
	function onSelectAllClick(){
	
	}
	function isItemSelected(){
	
	}
	const classes = useStyles();
	
	return (
		<Card>
			<CardContent>
				사원관리
			</CardContent>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>	
							<TableCell padding="checkbox">
								<Checkbox onChange={onSelectAllClick}></Checkbox>
							</TableCell>
							<TableCell>이름</TableCell>
							<TableCell align="center">직급</TableCell>
							<TableCell align="center">주소</TableCell>
							<TableCell align="center">휴대전화</TableCell>
							<TableCell align="center">경력</TableCell>
							<TableCell align="center">입사일</TableCell>
							<TableCell align="center">자격증<br></br>유무</TableCell>
							<TableCell align="center">개인이력</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
					{rows.map(row => (
						<TableRow key={row.name}>
							<TableCell padding="checkbox">
								<Checkbox
									onChange={isItemSelected}
									key = {row.id}
								/>
							</TableCell>
							<TableCell component="th" scope="row">
								{row.name}
							</TableCell>
							<TableCell >{row.position}</TableCell>
							<TableCell >{row.address}</TableCell>
							<TableCell >{row.phone}</TableCell>
							<TableCell >{row.career}</TableCell>
							<TableCell >{row.entry}</TableCell>
							<TableCell align="center">{row.cert}</TableCell>
							<TableCell >
								 <Button variant="contained" color="primary" href="#contained-buttons">
									개인이
								</Button>
							</TableCell>
						</TableRow>
					))}
					</TableBody>
				</Table>
			</TableContainer>
		</Card>
	);
}

export default MemberList;
