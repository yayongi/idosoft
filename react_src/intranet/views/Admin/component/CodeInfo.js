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

import { LoadingBar } from '../../../common/LoadingBar/LoadingBar';

import axios from 'axios';

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
	const {detailCodeInfo, setShowTotalInfoTable, getOrigin} = props;
	const [isModify, setModify] = React.useState(false);
	const [isAddBtnClicked, setIsAddBtn] = React.useState(false, []);
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(false, []);    //loading bar
	const [dataState, setDataState] = React.useState(
		{
			CODE_ID: ""
			,CODE_LEVEL: "1"
			,UPPER_CODE: ""
			,UPD_ID: ""
			,TEMP_COLUM: ""
			,UPPER_NAME: ""
			,CODE_NAME: ""
			,NOTE: ""
			,REG_DATETIME: ""
			,UPD_DATETIME: ""
			,REG_ID: ""
			,CODE_DC: ""
		}
	);	// state : 수정을 위한 데이터 관리

	//하위코드 등록 시 화면이 그려진 후 dataState(등록할 코드의 상위 코드 정보)를 한번 더 변경시켜준다.
	useEffect(() => {
		console.log("detailCodeInfo : ");
		console.log(detailCodeInfo);
		if(detailCodeInfo && detailCodeInfo.length != 0){
			setDataState(detailCodeInfo);
			setModify(true);
		}else{
			setModify(false);
			setDataState(
			{
				CODE_ID: ""
				,CODE_LEVEL: "1"
				,UPPER_CODE: ""
				,UPD_ID: ""
				,TEMP_COLUM: ""
				,UPPER_NAME: ""
				,CODE_NAME: ""
				,NOTE: ""
				,REG_DATETIME: ""
				,UPD_DATETIME: ""
				,REG_ID: ""
				,CODE_DC: ""
			});



		}
	}, [detailCodeInfo]);

	const validationCheck = () => {
		return false;
	}

	// 필드 값 변경 시, 임시로 값 저장
	const handleChange = event => {
		setDataState({
			...dataState,
			[event.target.name]: event.target.value
		});
	};

	const handleClickAddCode = () => {
		setShowLoadingBar(true);
		if(validationCheck()){
			return;	
		}

		var sendData = dataState;
		var upper_code = sendData.UPPER_CODE;
		if(!upper_code){
			sendData["CODE_LEVEL"] = 1;
		}
		axios({
			url: '/intranet/addNewCode',
			method: 'post',
			data: sendData
		}).then(response => {
			if(!response.data.isDBError){
				console.log(response);
				getOrigin();
				setShowTotalInfoTable(true);
			}else{
				alert("DB insert에 실패했습니다.");
			}
				setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	};

	const handleClickModifyCode = () => {
		if(dataState.CODE_NAME == ""){
			alert("코드명을 입력해주세요");
			return;
		}
		setShowLoadingBar(true);
		axios({
			url: '/intranet/updateCode',
			method: 'post',
			data: dataState
		}).then(response => {
			if(!response.data.isDBError){
				console.log(response);
				alert("수정했습니다.");
				getOrigin();
				setShowTotalInfoTable(true);
			}else{
				alert("수정에 실패했습니다.");
			}
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	const handleClickRemoveCode = () => {
		if(detailCodeInfo.subTrees){
			alert("하위코드가 존재하여 삭제가 불가능합니다. " + detailCodeInfo.subTrees[0]["CODE_ID"]);
			return;
		}
		setShowLoadingBar(true);
		axios({
			url: '/intranet/deleteCode',
			method: 'post',
			data: {"CODE_ID": detailCodeInfo["CODE_ID"]}
		}).then(response => {
			if(!response.data.isDBError){
				console.log(response);
				alert("삭제했습니다.");
				getOrigin();
				setShowTotalInfoTable(true);
			}else{
				alert("삭제 실패했습니다.");
			}
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});


	}

	const handleClickLowerCode = () => {
		setModify(false);
		setDataState({
			CODE_ID: ""
			,CODE_LEVEL: dataState.CODE_LEVEL+1
			,UPPER_CODE: dataState.CODE_ID
			,UPD_ID: ""
			,TEMP_COLUM: ""
			,UPPER_NAME: dataState.CODE_NAME
			,CODE_NAME: ""
			,NOTE: ""
			,REG_DATETIME: ""
			,UPD_DATETIME: ""
			,REG_ID: ""
			,CODE_DC: ""
		});


	}

	return (
		<>
			<LoadingBar openLoading={isShowLoadingBar}/>
			<div className={classes.root}>
			</div>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableBody>
						<TableRow>
							<TableCell align="left" component="th" scope="row" style={{width: '120px'}}>상위코드 ID</TableCell>
							<TableCell align="left">
								<TextField
									id="UPPER_CODE"
									name="UPPER_CODE"
									margin="dense"
									variant="outlined"
									value={dataState.UPPER_CODE}
									onChange={handleChange}
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
									id="UPPER_NAME"
									name="UPPER_NAME"
									margin="dense"
									variant="outlined"
									value={dataState.UPPER_NAME}
									onChange={handleChange}
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
									id="CODE_ID"
									name="CODE_ID"
									margin="dense"
									variant="outlined"
									value={dataState.CODE_ID}
									onChange={handleChange}
									InputProps={{
									 	readOnly: isModify,
									}}
									style={{
										background: isModify ? 'gray' : ''
									}}
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">코드명</TableCell>
							<TableCell align="left" >
								<TextField
									id="CODE_NAME"
									name="CODE_NAME"
									margin="dense"
									variant="outlined"
									value={dataState.CODE_NAME}
									onChange={handleChange}
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">코드 설명</TableCell>
							<TableCell align="left">
								<TextField
									id="CODE_DC"
									name="CODE_DC"
									rows="5"
									variant="outlined"
									value={dataState.CODE_DC}
									onChange={handleChange}
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
						<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={() => (setShowTotalInfoTable(true))}>
							목록
						</Button>
					</RouterLink>
					{	!isModify && 
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickAddCode}>
								추가
							</Button>
						)
					}
					{	isModify && 
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickRemoveCode}>
								삭제
							</Button>
						)
					}
					{	isModify && 
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickModifyCode}>
								수정
							</Button>
						)
					}
					{	isModify && 
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickLowerCode}>
								하위코드추가
							</Button>
						)
					}
				</div>
			</Toolbar>
		</>
	);
}