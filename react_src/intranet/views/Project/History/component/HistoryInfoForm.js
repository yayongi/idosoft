import React, { useEffect } from 'react';
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

import { LoadingBar } from '../../../Admin/component/utils';

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

function initCheck(match){
	return typeof(match.params.id) == "undefined" ? "new" : "modify";
}
function getUserInfo(){
	return JSON.parse(sessionStorage.getItem("loginSession"));
}
export default function ProjectInfoForm(props) {

	const classes = useStyles();
	
	const { match, location, history } = props.routeProps.routeProps;
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(false, []);    //loading bar
	const [isShowProjectInput, setShowProjectInput] = React.useState(true, []);
	const [isShowInSttInput, setShowInSttInput] = React.useState(true, []);
	const useInfo = getUserInfo();
	const [member_list, setMember_list] = React.useState([]);
	const [instt_list, setinstt_list] = React.useState([]);
	const [role_list, setrole_list] = React.useState([]);
	const [dataState, setDataState] = React.useState([
		{
			member_name:"",
			project_no: "",
			project_nm : "",
			instt_code: "",
			instt_nm : "",
			inpt_bgnde:"",
			inpt_endde:"",
			role_code:"",
			chrg_job:"",
			use_lang:""
		}
	]);	// state : 수정을 위한 데이터 관리
	const screenType = initCheck(match);
	useEffect(() => {
		axios({
			url: '/intranet/historyinfoForm',
			method: 'post',
			data: {"CODE_ID": ["CD0008", "CD0009"]}
		}).then(response => {
			console.log(response);
			debugger;
			//setHistoryInfo(response.data.history_list);
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
		});
	}, []);

	// 필드 값 변경 시, 임시로 값 저장
	const handleChange = event => {
		setDataState({
			...dataState,
			[event.target.name]: event.target.value
		});
	};

	const hadleChangeProject = (event) => {
	}

	const hadleChangeInstt = (event) => {
		if(event.target.value == "-1"){
			setIsShowProject(true);

			setDataState({
				...dataState,
				instt_code: event.target.value, 
			});
		}else{
			setIsShowProject(false);
			setDataState({
				...dataState,
				instt_code: event.target.value, 
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

	const handleClickAddHist = () => {

		alert("등록 되었습니다.");
		history.goBack();
	}

	const handleClickRemoveHistory = () => {
		history.goBack();
	}

	const handleClickUpdateHistory = () => {
		alert("수정되었습니다.");
		history.goBack();
	}

	const handleClickCancle = () => {
		history.goBack();
	};

	return (
		<>
			<LoadingBar openLoading={isShowLoadingBar}/>
			<div className={classes.root}>
			</div>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left" colSpan="2">
								<Typography className={classes.title} color="inherit" variant="h6">
									{dataState.screenType == "new" ? "이력관리 등록" : "이력관리 수정"}
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell align="left" component="th" scope="row" style={{ width: '120px' }}>이름</TableCell>
							<TableCell align="left">
								<TextField
									id="member_name"
									name="member_name"
									margin="dense"
									variant="outlined"
									defaultValue={dataState.member_name}
									onChange={handleChange}
									fullWidth
								>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row" style={{ width: '120px' }}>연도</TableCell>
							<TableCell align="left">
								<TextField
									id="member_name"
									name="member_name"
									margin="dense"
									variant="outlined"
									defaultValue={dataState.member_name}
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
							<TableCell align="left" component="th" scope="row">프로젝트명</TableCell>
							<TableCell align="left">
								<TextField
									id="project_no"
									name="project_no"
									margin="dense"
									variant="outlined"
									onChange={hadleChangeProject}
									value={dataState.project_no != "" ? dataState.project_no : "-1"}
									fullWidth
									select>
									<MenuItem key={-1} value={-1} name="직접입력">
										{"직접입력"}
									</MenuItem>
								</TextField>
							</TableCell>
						</TableRow>
						{ isShowProjectInput && 
							<TableRow>
								<TableCell align="left" component="th" scope="row">프로젝트명(직접입력)</TableCell>
								<TableCell align="left">
									<TextField
										id="project_nm"
										name="project_nm"
										margin="dense"
										variant="outlined"
										onChange={handleChange}
										value={dataState.project_nm}
										fullWidth>
										{dataState.project_nm}
									</TextField>
								</TableCell>
							</TableRow>
						}
						<TableRow>
							<TableCell align="left" component="th" scope="row">기관</TableCell>
							<TableCell align="left">
								<TextField
									id="instt_code"
									name="instt_code"
									margin="dense"
									variant="outlined"
									fullWidth
									onChange={hadleChangeInstt}
									value={dataState.instt_code != "" ? dataState.instt_code : "-1"}
									select>
									<MenuItem key={-1} value={-1} name={"직접입력"}>
										{"직접입력"}
									</MenuItem>
									{/* {dataState.insttList.map(tmp => (
										<MenuItem key={tmp.instt_code} value={tmp.instt_code} name={tmp.instt_name}>
											{tmp.instt_name}
										</MenuItem>
									))} */}
								</TextField>
							</TableCell>
						</TableRow>
						{ isShowInSttInput && 
							<TableRow>
								<TableCell align="left" component="th" scope="row">기관(직접입력)</TableCell>
								<TableCell align="left">
									<TextField
										id="instt_nm"
										name="instt_nm"
										margin="dense"
										variant="outlined"
										onChange={handleChange}
										value={dataState.instt_nm}
										fullWidth>
										{dataState.instt_nm}
									</TextField>
								</TableCell>
							</TableRow>
						}
						<TableRow>
							<TableCell align="left" component="th" scope="row">투입일</TableCell>
							<TableCell align="left" >
								<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
									<Grid container justify="space-around">
										<DatePicker
											locale='ko'
											margin="dense"
											id="inpt_bgnde"
											name="inpt_bgnde"
											views={["year", "month", "date"]}
											format="yyyy-MM-dd"
											value={"2020-03-31"}
											onChange={handleChangeInpt_bgnde}
											inputVariant="outlined"
											readOnly={false}
											fullWidth
										/>
									</Grid>
								</MuiPickersUtilsProvider>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">철수일</TableCell>
							<TableCell align="left">
								<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
									<Grid container justify="space-around">
										<DatePicker
											locale='ko'
											margin="dense"
											id="inpt_endde"
											name="inpt_endde"
											views={["year", "month", "date"]}
											format="yyyy-MM-dd"
											value={"2020-03-31"}
											onChange={handleChangeInpt_endde}
											inputVariant="outlined"
											readOnly={false}
											fullWidth
										/>
									</Grid>
								</MuiPickersUtilsProvider>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">역할</TableCell>
							<TableCell align="left">
								<TextField
									id="role_code"
									name="role_code"
									variant="outlined"
									onChange={handleChange}
									value={dataState.role_code}
									fullWidth
									select>
									{/* {dataState.codeList.filter((code) => {
										return code.upper_code == "CD0009"
									}).map(tmp => (
										<MenuItem key={tmp.code_id} value={tmp.code_id} name={tmp.code_name}>
											{tmp.code_name}
										</MenuItem>
									))} */}
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">담당업무</TableCell>
							<TableCell align="left">
								<TextField
									id="chrg_job"
									name="chrg_job"
									variant="outlined"
									onChange={handleChange}
									value={dataState.chrg_job}
									fullWidth>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">비고(사용언어)</TableCell>
							<TableCell align="left">
								<TextField
									id="use_lang"
									name="use_lang"
									variant="outlined"
									onChange={handleChange}
									value={dataState.use_lang}
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
					<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickCancle}>
						취소
					</Button>
					{
						dataState.screenType == "new" &&
						(
							<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickAddHist}>
								등록
							</Button>
						)
					}
					{
						dataState.screenType == "modify" &&
						(
							<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickUpdateHistory}>
								수정
							</Button>
						)
					}
					{
						dataState.screenType == "modify" &&
						(
							<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickRemoveHistory}>
								삭제
							</Button>
						)
					}
				</div>
			</Toolbar>
		</>
	);
}