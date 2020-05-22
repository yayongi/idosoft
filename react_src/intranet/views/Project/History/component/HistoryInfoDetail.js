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
	const [infoState, serInfoState] = useState();
	const [projectList, setProjectList] = useState([]);
	const [dateState, setDateState] = useState();

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
			getProjectList(response.data.INPT_BGNDE.substring(0,4));
			setDateState(response.data.INPT_BGNDE.substring(0,4));
			serInfoState(response.data);
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	},[])

	//특정 연도 프로젝트 가져오기
	const getProjectList = (date) => {
		axios({
			url: '/intranet/history/getprojectlist',
			method: 'post',
			data: {year: date}
		}).then(response => {
			setProjectList(response.data);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	const changeYear = (date) => {
		setDateState(Moment(date).format('YYYY'));
		getProjectList(Moment(date).format('YYYY'));
	}
	return (
		<>
			"여기는 새로운 수정화면이오"
			{/* <CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
			<LoadingBar openLoading={isShowLoadingBar}/> */}
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
									id="member_no"
									name="member_no"
									margin="dense"
									variant="outlined"
									label = "이름"
									value = {infoState != null? infoState.MEMBER_NAME : ""}
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
											value={dateState != null ? dateState : ""}
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
									id="project_no"
									name="project_no"
									margin="dense"
									variant="outlined"
									label = "프로젝트명"
									value = {infoState != null && infoState.PROJECT_NO != undefined ? infoState.PROJECT_NO : "0"}
									autoComplete="off"
									fullWidth
									select>
									<MenuItem key="0" value="0">
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
									id="project_nm"
									name="project_nm"
									margin="dense"
									variant="outlined"
									autoComplete="off"
									label = "프로젝트명(직접입력)"
									value = {infoState != null && infoState.PROJECT_NO == undefined ? infoState.PROJECT_NM : ""}
									placeholder="회사 프로젝트는 년도와 프로젝트를 선택해주세요"
									fullWidth>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="instt_nm"
									name="instt_nm"
									margin="dense"
									variant="outlined"
									placeholder="직접입력"
									label = "기관"
									autoComplete="off"
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
											id="inpt_bgnde"
											name="inpt_bgnde"
											label = "투입일"
											views={["year", "month", "date"]}
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
											id="inpt_endde"
											name="inpt_endde"
											label = "철수일"
											views={["year", "month", "date"]}
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
									id="role_code"
									name="role_code"
									variant="outlined"
									label="역할"
									autoComplete="off"
									fullWidth>
								</TextField>
							</TableCell>
							<TableCell align="left">
								<TextField
									id="chrg_job"
									name="chrg_job"
									variant="outlined"
									autoComplete="off"
									label = "담당업무"
									fullWidth>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="use_lang"
									name="use_lang"
									variant="outlined"
									autoComplete="off"
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
					<Button variant="contained" color="primary" size="small" className={classes.button}>
						수정
					</Button>
					<Button variant="contained" color="secondary" size="small" className={classes.button}>
						삭제
					</Button>
				</div>
			</Toolbar>
		</>
	);
}
export default HistoryInfoDetail;