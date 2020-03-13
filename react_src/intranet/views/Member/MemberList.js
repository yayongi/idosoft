import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import StarIcon from '@material-ui/icons/Star';
import Grid from '@material-ui/core/Grid';
import {tableList} from './data';

const useStyles = makeStyles(theme =>({
	table: {
		minWidth: 650,
	},
	button :{
		textAlign:'right',
		marginTop:10
	},
	root: {
		flexGrow: 1,
		marginLeft:10,
		marginRight:10,
	},
}));

var selected = [];

// 모든체크박스 선택
const onSelectAllClick = () =>{

}
// 체크박스 선택
const isItemSelected = (event,id) =>{
	if(event.target.checked){
		selected.push(id);
	}else{
		selected.splice(selected.indexOf(id),1)
	}
}

const category = [
	{label:"이름",value:"0"},
	{label:"직급",value:"1"},
]

const MemberList = () => {
	const classes = useStyles();
	
	const [state, setState] = React.useState({
		memberList : tableList,
	});

	//사원삭제
	const removeData = () => {
		let temp = memberList;
		for(let i=0;i<selected.length;i++){
			temp = temp.filter(temp => temp.id !== String(selected[i]));
		}

		setState({
			...state,
			memberList : temp
		});
	}
	
	const {memberList} = state;
	//const {data} = this.props;

	// console.log("date : " + data);


	return (
		<div>
			<Card>
				<CardContent>
					사원관리
				</CardContent>
				<div className={classes.root}>
					<Grid container spacing={3}>
						<Grid item xs style={{textAlign:'left'}}>
							<Button variant="contained" color="primary" onClick={removeData}>
								직원정보 삭제
							</Button>
						</Grid>
						<Grid item xs style={{textAlign:'center'}}>
							<TextField id="outlined-basic" placeholder="검색어를 입력해 주세요" variant="outlined" />
							<TextField style={{width:'20%'}}
								id="outlined-select-currency"
								select
								variant="outlined"
							>
								{category.map(option => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
								))}
							</TextField>
							<Button variant="contained" color="primary">
								검색
							</Button>
						</Grid>
						<Grid item xs  style={{textAlign:'right'}}>
							<Button variant="contained" color="primary">
								직원정보 출력
							</Button>
						</Grid>
					</Grid>
				</div>
				<TableContainer>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>	
								<TableCell padding="checkbox">
									<Checkbox 
										onChange={onSelectAllClick}
									></Checkbox>
								</TableCell>
								<TableCell align="center">이름</TableCell>
								<TableCell align="center">직급</TableCell>
								<TableCell align="center">주소</TableCell>
								<TableCell align="center">휴대전화</TableCell>
								<TableCell align="center">경력</TableCell>
								<TableCell align="center">입사일</TableCell>
								<TableCell align="center">자격증<br/>유무</TableCell>
								<TableCell align="center">개인이력</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{memberList.map(row => (
							<TableRow key={row.id}>
								<TableCell padding="checkbox">
									<Checkbox
										onChange={() => isItemSelected(event,row.id)}
										key = {row.id}
									/>
								</TableCell>
								<TableCell align="center">
									{row.manager_yn === 1 && (<StarIcon style={{verticalAlign:'bottom'}}/>) } 
									{row.name}
								</TableCell>
								<TableCell align="center">{row.position}</TableCell>
								<TableCell>
									{row.address1} {row.address2}
									</TableCell>
								<TableCell align="center">{row.phone}</TableCell>
								<TableCell align="center">{row.career}</TableCell>
								<TableCell align="center">{row.entry}</TableCell>
								<TableCell align="center">
									{row.cert_yn == 1? '유':'무'}
								</TableCell>
								<TableCell align="center">
									<Button variant="contained" color="primary" href="#contained-buttons">
										개인이력
									</Button>
								</TableCell>
							</TableRow>
						))}
						</TableBody>
					</Table>
				</TableContainer>
			</Card>
			<div className={classes.button}>
				<RouterLink button="true" to="/member/memberreg">
					<Button variant="contained" color="primary" >
						사원정보 등록
					</Button>
				</RouterLink>
			</div>
		</div>
	);
}

export default MemberList;
