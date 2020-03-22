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

import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

import { Link as RouterLink } from 'react-router-dom';
import { getProjectInfoDB, getSiteInfoDB, getMemberInfoDB } from '../../data';

import { getCodeInfoDB } from '../../../Admin/data'

function initData(location) {
	console.log("initData");

	var urlSplitList = location.pathname.split("/");
	var currentLastPath = urlSplitList[urlSplitList.length - 1];

	var data = {};
	data["screenType"] = currentLastPath == "new" ? "new" : "modify";
	
	data["member_no"] = "2017041701";
	data["project_no"] = "";
	data["project_nm"] = "";
	data["instt_code"] = "";
	data["instt_nm"] = "";
	data["inpt_bgnde"] = Moment(new Date()).format('YYYY-MM-DD');
	data["inpt_endde"] = Moment((new Date()).setFullYear(new Date().getFullYear() + 1)).format('YYYY-MM-DD');
	data["role_code"] = "";
	data["chrg_job"] = "";
	data["use_lang"] = "java, jsp";
	data["reg_datetime"] = "";
	data["upd_datetime"] = "";
	data["reg_id"] = "";
	data["upd_id"] = "";
	data["note"] = "";
	data["temp_colum"] = "";
	
	data["insttList"] = getSiteInfoDB();
	data["projectList"] = localStorage.getItem("resProjData") ? JSON.parse(localStorage.getItem("resProjData")) : getProjectInfoDB();	
	data["memberList"] = getMemberInfoDB();
	data["codeList"] = localStorage.getItem("resCodeData") ? JSON.parse(localStorage.getItem("resCodeData")) : getCodeInfoDB();

	var user_name = (data["memberList"]).filter((member) => {
		return member.member_id == data["member_no"];
	});

	data["member_name"] = user_name[0]["member_name"];


	var query = location.search;
	if (query) {
		query.replace("?", "").split("&").map((param => {
			var kValue = param.split("=")[0];
			var vValue = decodeURIComponent(param.split("=")[1]);
			return data[kValue] = vValue;
		}));
	}
	return data;
}

function jsonToQuery(obj) {
	return ('?' +
		Object.keys(obj).map(function (key) {
			return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
		}).join('&'));
}


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
export default function ProjectInfoForm(props) {
	console.log("call ProjectInfoForm Area");

	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const { match, location, history } = props.routeProps.routeProps;
	const [dataState, setDataState] = React.useState(initData(location));	// state : 수정을 위한 데이터 관리
	const [ isShowProjectInput, setIsShowProject ] = React.useState(false);
	const [ isShowInSttInput, setIsShowInStt ] 		= React.useState(false);
	const classes = useStyles();


	useEffect(() => {
		console.log("userEffect");
		console.log("dataState.project_no : " + dataState.project_no);
		if(dataState.screenType != "new"){
			if(dataState.project_no == "-1" || dataState.project_no == ""){
				setIsShowProject(true);
			}else{
				setIsShowProject(false);
			}

			if(dataState.instt_code == "-1" || dataState.instt_code == ""){
				setIsShowInStt(true);
			}else{
				setIsShowInStt(false);
			}
		}else{
			if(dataState.project_no == "-1" || dataState.project_no == ""){
				setIsShowProject(true);
			}else{
				setIsShowProject(false);
			}

			if(dataState.instt_code == "-1" || dataState.instt_code == ""){
				setIsShowInStt(true);
			}else{
				setIsShowInStt(false);
			}
		}
	});

	// 필드 값 변경 시, 임시로 값 저장
	const handleChange = event => {
		if(event.target.name == 'project_no'){
			if(event.target.value == "-1"){
				setIsShowProject(true);
			}else{
				setIsShowProject(false);
			}
		}

		if(event.target.name == 'instt_code'){
			if(event.target.value == "-1"){
				setIsShowProject(true);
			}else{
				setIsShowProject(false);
			}
		}

		setDataState({
			...dataState,
			[event.target.name]: event.target.value
		});
	};

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

		

		var resHistData = JSON.parse(localStorage.getItem("resHistData"));
		var mem_hist_no  = resHistData.length+1;
		var member_no  = dataState.member_no;
		
		var project_nm  = "";
		var project_select_list = dataState.projectList.filter(project => {
			return project.project_no == dataState.project_no; 
		})

		if(project_select_list.length > 0){
			project_nm = project_select_list[0]["project_nm"];
		}else{
			project_nm = dataState.project_nm;
		}
		var project_no  = dataState.project_no != "-1" ? dataState.project_no : "";

		
		var instt_nm  = "";
		var instt_select_list = dataState.insttList.filter(instt => {
			return instt.instt_code == dataState.instt_code; 
		});

		if(instt_select_list.length > 0){
			instt_nm = instt_select_list[0]["instt_name"];
		}else{
			instt_nm = dataState.instt_nm
		}
		var instt_code  = dataState.instt_code != "-1" ? dataState.instt_code : "";
		var inpt_bgnde  = dataState.inpt_bgnde.replace(/[^0-9]/g, '');
		var inpt_endde  = dataState.inpt_endde.replace(/[^0-9]/g, '');
		var role_code  = dataState.role_code;
		var chrg_job  = dataState.chrg_job;
		var use_lang  = dataState.use_lang;
		var reg_datetime  = "20200321";
		var upd_datetime  = "";
		var reg_id  = dataState.member_no;
		var upd_id  = "";
		var note  = "";
		var temp_colum  = "";

		resHistData.push(
			{
				"mem_hist_no":mem_hist_no,
				"member_no":  member_no, 
				"project_no" : project_no != "" ? project_no : "", 
				"project_nm" : project_nm, 
				"instt_code" : instt_code != "" ? instt_code : "",
				"instt_nm" : instt_nm, 
				"inpt_bgnde" : inpt_bgnde, 
				"inpt_endde" : inpt_endde, 
				"role_code" : role_code, 
				"chrg_job" : chrg_job, 
				"use_lang" : use_lang, 
				"reg_datetime" :reg_datetime, 
				"upd_datetime" : upd_datetime, 
				"reg_id" : reg_id, 
				"upd_id" : upd_id, 
				"note" : note, 
				"temp_colum": temp_colum
			}
		)

		resHistData.sort((a, b) => {
			return parseInt(b.inpt_bgnde) - parseInt(a.inpt_bgnde);
		});

		localStorage.setItem('resHistData', JSON.stringify(resHistData));

		alert("등록 되었습니다.");
		history.goBack();
	}

	const handleClickRemoveHistory = () => {
		var resHistData = JSON.parse(localStorage.getItem("resHistData"));

		var idx = -1;
		resHistData.filter((histData, index) => {
			if(histData.mem_hist_no == dataState.mem_hist_no){
				idx = index;
				return histData;
			}
		});

		if(idx > -1){
			resHistData.splice(idx, 1);
			localStorage.setItem("resHistData", JSON.stringify(resHistData));
			alert("삭제되었습니다.");
		}else{
			alert("삭제 중 오류가 발생했습니다.");
		}
		history.goBack();
	}

	const handleClickUpdateHistory = () => {
		console.log("handleClickUpdateHistory");

		var resHistData = JSON.parse(localStorage.getItem("resHistData"));
		var idx = -1;
		resHistData.filter((histData, index) => {
			if(histData.mem_hist_no == dataState.mem_hist_no){
				idx = index;
				return histData;
			}
		});

		var resProjData = JSON.parse(localStorage.getItem("resProjData"));
		var projectList = resProjData.filter(projData => {
			return projData.project_no == dataState.project_no;
		});

		resHistData[idx]["project_no"] 	= dataState.project_no;
		resHistData[idx]["project_nm"] 	= projectList.length > 0 ? projectList[0]["project_nm"] : dataState.project_nm;
		resHistData[idx]["instt_nm"] 	= dataState.instt_nm;
		resHistData[idx]["instt_code"] 	= dataState.instt_code;
		resHistData[idx]["inpt_bgnde"] 	= dataState.inpt_bgnde.replace(/[^0-9]/g, '');
		resHistData[idx]["inpt_endde"] 	= dataState.inpt_endde.replace(/[^0-9]/g, '');
		resHistData[idx]["role_code"] 	= dataState.role_code;
		resHistData[idx]["chrg_job"] 	= dataState.chrg_job;
		resHistData[idx]["use_lang"] 	= dataState.use_lang;
		localStorage.setItem("resHistData", JSON.stringify(resHistData));
		
		alert("수정되었습니다.");
		history.goBack();
	}

	const handleClickCancle = () => {
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
									onChange={handleChange}
									value={dataState.project_no != "" ? dataState.project_no : "-1"}
									fullWidth
									select>
									<MenuItem key={-1} value={-1} name="직접입력">
										{"직접입력"}
									</MenuItem>
									{dataState.projectList.map(tmp => (
										<MenuItem key={tmp.project_no} value={tmp.project_no} name={tmp.project_nm}>
											{tmp.project_nm}
										</MenuItem>
									))}
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
									onChange={handleChange}
									value={dataState.instt_code != "" ? dataState.instt_code : "-1"}
									select>
									<MenuItem key={-1} value={-1} name={"직접입력"}>
										{"직접입력"}
									</MenuItem>
									{dataState.insttList.map(tmp => (
										<MenuItem key={tmp.instt_code} value={tmp.instt_code} name={tmp.instt_name}>
											{tmp.instt_name}
										</MenuItem>
									))}
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
											value={new Date(Number(dataState.inpt_bgnde.slice(0, 4)), Number(dataState.inpt_bgnde.slice(5, 7)) - 1, Number(dataState.inpt_bgnde.slice(8, 10)))}
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
											value={new Date(Number(dataState.inpt_endde.slice(0, 4)), Number(dataState.inpt_endde.slice(5, 7)) - 1, Number(dataState.inpt_endde.slice(8, 10)))}
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
									{dataState.codeList.filter((code) => {
										return code.upper_code == "CD0009"
									}).map(tmp => (
										<MenuItem key={tmp.code_id} value={tmp.code_id} name={tmp.code_name}>
											{tmp.code_name}
										</MenuItem>
									))}
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