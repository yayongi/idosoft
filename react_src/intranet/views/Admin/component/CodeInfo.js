import React, { useEffect } from 'react';
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
	const classes = useStyles();

	const {detailCodeInfo} = props;
	const { screenType } = detailCodeInfo.length > 0 ? "modify" : "new";

	//하위코드 등록 시 화면이 그려진 후 dataState(등록할 코드의 상위 코드 정보)를 한번 더 변경시켜준다.
	useEffect(() => {
		
	});

	const handleClickAddCode = () => {
	};

	const handleClickModifyCode = () => {
	}

	const handleClickRemoveCode = () => {
	}

	const handleClickLowerCode = () => {
	}

	return (
		<>
			<div className={classes.root}>
			</div>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
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
							목록
						</Button>
					</RouterLink>
					{
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickAddCode}>
								추가
							</Button>
						)
					}
					{ screenType == "modify" && 
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickModifyCode}>
								수정
							</Button>
						)
					}
					{screenType == "modify" &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickRemoveCode}>
								삭제
							</Button>
						)
					}
				</div>
			</Toolbar>
		</>
	);
}