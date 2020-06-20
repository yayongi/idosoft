import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
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
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";
import Moment from "moment";
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

import { LoadingBar } from '../../../../common/LoadingBar/LoadingBar';
import { processErrCode, getRootPath } from '../../../../js/util';

import CommonDialog from '../../../../js/CommonDialog';

import axios from 'axios';

import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

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

const HistoryInfoDetail = (props) => {
	const classes = useStyles();
	const [infoState, setInfoState] = useState();
	const [projectList, setProjectList] = useState([]);
	const [dateState, setDateState] = useState();
	const [roleList, setRoleList] = useState();
	const [company, setCompany] = useState();
	const [dialog, setDialog] = useState({});

	const { match, location, history } = props.routeProps.routeProps;

	console.log("mathch : " + JSON.stringify(match));

	//상세 정보 가져오기
	useEffect(() => {
		axios({
			url: '/intranet/history/getinfo',
			method: 'post',
			data: {"MEM_HIST_NO": match.params.id}
		}).then(response => {
			// 특정연도의 프로젝트 가져오기
			getRoleList();
			getProjectList(response.data.INPT_BGNDE.substring(0,4));
			setDateState(response.data.INPT_BGNDE.substring(0,4));
			setInfoState(response.data);
			setCompany(response.data.INSTT_NM);
			//setShowLoadingBar(false);
		}).catch(e => {
			//setShowLoadingBar(false);
			processErrCode(e);
		});
	},[])

	useEffect(() => {
		setInfoState({
			...infoState,
			INSTT_NM : company
		});
	},[company])

	//특정 연도 프로젝트 가져오기
	const getProjectList = (data) => {
		axios({
			url: '/intranet/history/getprojectlist',
			method: 'post',
			data: {year: data}
		}).then(response => {
			setProjectList(response.data);
		}).catch(e => {
			//setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	//직무 가져오기
	const getRoleList = () => {
		axios({
			url: '/intranet/history/getrolelist',
			method: 'post'
		}).then(response => {
			setRoleList(response.data);
		}).catch(e => {
			//setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	//프로젝트에 따른 기관 가져오기
	const getCompany = (data) => {
		axios({
			url: '/intranet/history/getcompany',
			method: 'post',
			data: {project_no: data}
		}).then(response => {
			setCompany(response.data.CODE_NAME);
		}).catch(e => {
			//setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	//개인이력 수정 저장
	const saveData = () => {
		axios({
			url: '/intranet/history/update',
			method: 'post',
			data: infoState,
		}).then(response => {
			history.goBack();
		}).catch(e => {
			//setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	const changeYear = (date) => {
		setDateState(Moment(date).format('YYYY'));
		getProjectList(Moment(date).format('YYYY'));
	}

	const handleChange = (event) => {
		if(event.target.name == "PROJECT_NO"){
			getCompany(event.target.value);
		}

		if(event.target.name == "PROJECT_NO"){
			setInfoState({
				...infoState,
				[event.target.name]: event.target.value,
				PROJECT_NM : event.target.value != 0 ? projectList.filter((list) => list.PROJECT_NO === event.target.value)[0].PROJECT_NM : event.target.value
			});
		}else{
			setInfoState({
				...infoState,
				[event.target.name]: event.target.value,
			});
		}
	}

	const handleChangeInpt_bgnde = (date) => {
		setDataState({
			...dataState,
			inpt_bgnde: Moment(date).format('YYYY-MM-DD')
		});
	}

	const handleChangeInpt_endde = (date) => {
		setDataState({
			...dataState,
			inpt_endde: Moment(date).format('YYYY-MM-DD')
		});
	}

	const handleClickUpdateHistory = () => {
		handleOpenDialog("이력수정", "이력을 수정하시겠습니까?", true);
	}
	
	//Dialog open handler
	const handleOpenDialog = (title, content, isConfirm) => {
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	//Dialog close handler
	//확인:true 취소:false 리턴
	const handleCloseDialog = (title, result) => {
		setDialog({title:'', content:'', onOff:false, isConfirm:false});
		if(result){
			saveData();
		}else{
			return;
		}
	}
	return (
		<>
		<CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
		{((infoState != null) && (roleList != null)) && (
			<>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell 
								align="left"
								 colSpan="6">
								<Typography className={classes.title} color="inherit" variant="h6">
									이력관리 수정
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="MEMBER_NO"
									name="MEMBER_NO"
									margin="dense"
									variant="outlined"
									label = "이름"
									value = {infoState.MEMBER_NAME}
									InputProps={{
									 	 readOnly: true,
									}}
									autoComplete="off"
									fullWidth>
								</TextField>
							</TableCell>
							<TableCell align="left">
								<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
									<Grid container justify="space-around">
										<DatePicker
											label="연도선택"
											locale='ko'
											margin="dense"
											id="date"
											views={["year"]}
											format="yyyy"
											inputVariant="outlined"
											value={dateState}
											onChange={changeYear}
										/>
									</Grid>
								</MuiPickersUtilsProvider>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row" colSpan="2" style={{color:"red", fontSize:"12px"}}>회사에서 진행한 프로젝트만 년도를 선택해주세요
							(년도를 선택하면 해당 년도의 프로젝트 목록을 불러옵니다.)</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="PROJECT_NO"
									name="PROJECT_NO"
									margin="dense"
									variant="outlined"
									label = "프로젝트명"
									defaultValue = {infoState.INSTT_CODE != "" ? infoState.PROJECT_NO : 0}
									autoComplete="off"
									fullWidth
									onChange={handleChange}
									select>
									<MenuItem key="0" value={0}>
										직접입력
									</MenuItem>
									{projectList != null && projectList.map(option => (
										<MenuItem key={option.PROJECT_NO} value={option.PROJECT_NO}>
										{option.PROJECT_NM}
										</MenuItem>
									))}
								</TextField>
							</TableCell>
							<TableCell align="left">
								<TextField
									id="PROJECT_NM"
									name="PROJECT_NM"
									margin="dense"
									variant="outlined"
									autoComplete="off"
									label = "프로젝트명(직접입력)"
									onChange={handleChange}
									defaultValue = {infoState.INSTT_CODE == "" ? infoState.PROJECT_NM : ""}
									placeholder="회사 프로젝트는 년도와 프로젝트를 선택해주세요"
									fullWidth>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="INSTT_NM"
									name="INSTT_NM"
									margin="dense"
									variant="outlined"
									placeholder="직접입력"
									label = "기관"
									onChange={handleChange}
									autoComplete="off"
									value = {company}
									fullWidth>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" >
								<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
									<Grid container justify="space-around">
										<DatePicker
											locale='ko'
											margin="dense"
											id="INPT_BGNDE"
											name="INPT_BGNDE"
											label = "투입일"
											views={["year", "month", "date"]}
											value={Moment(infoState.INPT_BGNDE).format('YYYY-MM-DD')}
											onChange={handleChangeInpt_bgnde}
											format="yyyy-MM-dd"
											inputVariant="outlined"
											fullWidth
										/>
									</Grid>
								</MuiPickersUtilsProvider>
							</TableCell>
							<TableCell>
								<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
									<Grid container justify="space-around">
										<DatePicker
											locale='ko'
											margin="dense"
											id="INPT_ENDDE"
											name="INPT_ENDDE"
											label = "철수일"
											views={["year", "month", "date"]}
											value={Moment(infoState.INPT_ENDDE).format('YYYY-MM-DD')}
											onChange={handleChangeInpt_endde}
											format="yyyy-MM-dd"
											inputVariant="outlined"
											readOnly={false}
											fullWidth
										/>
									</Grid>
								</MuiPickersUtilsProvider>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="ROLE_CODE"
									name="ROLE_CODE"
									variant="outlined"
									label="역할"
									defaultValue={infoState.ROLE_CODE}
									onChange={handleChange}
									autoComplete="off"
									fullWidth
									select>
									{roleList.map(tmp => (
									<MenuItem key={tmp.CODE_ID} value={tmp.CODE_ID} name={tmp.CODE_NAME}>
										{tmp.CODE_NAME}
									</MenuItem>
									))}
								</TextField>
							</TableCell>
							<TableCell align="left">
								<TextField
									id="CHRG_JOB"
									name="CHRG_JOB"
									variant="outlined"
									autoComplete="off"
									defaultValue={infoState.CHRG_JOB}
									onChange={handleChange}
									label = "담당업무"
									fullWidth>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="USE_LANG"
									name="USE_LANG"
									variant="outlined"
									autoComplete="off"
									defaultValue={infoState.USE_LANG}
									onChange={handleChange}
									label = "비고(사용언어)"
									fullWidth>
								</TextField>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<Toolbar>
				<Typography className={classes.title} color="secondary" variant="subtitle2">
				</Typography>
				<div>
					<Button variant="contained" color="primary" size="small" className={classes.button}>
						취소
					</Button>
					<Button variant="contained" color="primary" size="small" className={classes.button}>
						등록
					</Button>
					<Button variant="contained" color="primary" size="small" className={classes.button} onClick={() => handleClickUpdateHistory()}>
						수정
					</Button>
					<Button variant="contained" color="secondary" size="small" className={classes.button}>
						삭제
					</Button>
				</div>
			</Toolbar>
		</>
		)}
		</>
	);
}
export default HistoryInfoDetail;