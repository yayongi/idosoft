import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link as RouterLink } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
	table: {
		minWidth: 650,
	},
	title: {
		flex: '1',
	},
	button: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	root: {
		width: '100%',
	},
	backButton: {
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	paper: {
		backgroundColor: '#efefef',
		color: 'black',
		padding: '5px 10px',
		borderRadius: '4px',
		fontSize: '13px',
		border: '1px solid black',
		marginTop: theme.spacing(1), 
	},
	
}));

/*
	state 변경에 Re-Rendering 수행
	state의 값이 이전과 동일해도 수행이 안됨.
	전역 변수는 호출 안됨.
*/
export default function CodeInfo(props) {
	console.log("call CodeInfo Area");

	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const [dataState, setDataState] = React.useState('');	// state : 수정을 위한 데이터 관리
	const { match, location, history } = props.routeProps.routeProps;

	const classes = useStyles();
	
	const handleClickAddCode = () => {
		console.log("handleClickAddCode");
		var code_id 	= document.getElementsByName("code_id")[0].value;
		var code_name 	= document.getElementsByName("code_name")[0].value;
		var code_level 	= "1";
		var upper_code 	= document.getElementsByName("upper_code")[0].value;
		var upper_name 	= document.getElementsByName("upper_name")[0].value;
		var code_dc 	= document.getElementsByName("code_dc")[0].value;
		var reg_datetime = "20200320";
		var upd_datetime = "";
		var reg_id = "2017041701";
		var upd_id = "";
		var note   = "";
		var temp_colum = "";

		if(!code_id)	{
			alert("코드ID를 입력해주세요");
			document.getElementsByName("code_id")[0].focus();
			return;
	 	}
		if(!code_name)	{
			alert("코드명을 입력해주세요"); 
			document.getElementsByName("code_name")[0].focus();
			return;
		}

		var codeInfoList = JSON.parse(localStorage.getItem("resCodeData"));
		var isContain = codeInfoList.filter(info => {
			return info.code_id === code_id
		}).length > 0 ? true : false;

		if(isContain){
			alert("이미 등록되어 있는 코드ID입니다.");
			document.getElementsByName("code_id")[0].focus();
			return;
		}
		
		codeInfoList.push(
			{
				"id": codeInfoList.length+1,
				"code_id":code_id,
				"code_name":code_name,
				"code_level":code_level,
				"upper_code":upper_code,
				"upper_name":upper_name,
				"code_dc":code_dc,
				"reg_datetime":reg_datetime,
				"upd_datetime":upd_datetime,
				"reg_id":reg_id,
				"upd_id":upd_id,
				"note":note,
				"temp_colum":temp_colum
		});
		localStorage.setItem("resCodeData", JSON.stringify(codeInfoList));
		//history.push("/admin/code");
		history.goBack();
	};

	return (
		<>
			<div className={classes.root}>
			</div>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left" colSpan="2">
								<Typography className={classes.title} color="inherit" variant="h6">					
									코드 생성
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell align="left" component="th" scope="row" style={{width: '120px'}}>상위코드 ID</TableCell>
							<TableCell align="left">
								<TextField
									id="upper_code"
									name="upper_code"
									margin="dense"
									variant="outlined"
									InputProps={{
									 	 readOnly: true,
									}}
									style={{
										background: 'gray'
									}}
									fullWidth
								>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">상위코드 명</TableCell>
							<TableCell align="left">
								<TextField
									id="upper_name"
									name="upper_name"
									margin="dense"
									variant="outlined"
									InputProps={{
									 	readOnly: true,
									}}
									style={{
									 	background: 'gray'
									}}
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">코드ID</TableCell>
							<TableCell align="left">
								<TextField
									id="code_id"
									name="code_id"
									margin="dense"
									variant="outlined"
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">코드명</TableCell>
							<TableCell align="left" >
								<TextField
									id="code_name"
									name="code_name"
									margin="dense"
									variant="outlined"
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">코드 설명</TableCell>
							<TableCell align="left">
								<TextField
									id="code_dc"
									name="code_dc"
									rows="5"
									variant="outlined"
									multiline
									fullWidth
								/>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<Toolbar>
				<Typography className={classes.title} color="secondary" variant="subtitle2">					
				</Typography>
				<div>
					<RouterLink button="true" to="/admin/code">
						<Button variant="contained" color="primary" size="small"  className={classes.button}>
							취소
						</Button>
					</RouterLink>
					<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickAddCode}>
						추가
					</Button>
				</div>
			</Toolbar>
		</>
	);
}