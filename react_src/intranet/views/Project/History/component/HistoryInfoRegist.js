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

function initCheck(match){
	return typeof(match.params.id) == "undefined" ? "new" : "modify";
}
function getUserInfo(){
	return JSON.parse(sessionStorage.getItem("loginSession"));
}
const HistoryInfoRegist = (props) => {

	const classes = useStyles();
	
	const { match, location, history } = props.routeProps.routeProps;
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(false, []);    //loading bar
	const userInfo = getUserInfo();												//로그인한 사람 정보
	const [project_All_list, setProj_All_list] = React.useState([]);
	const [project_list, setProj_list] = React.useState([]);
	const [member_list, setMember_list] = React.useState([]);
	const [instt_list, setInstt_list] = React.useState([]);
	const [role_list, setRole_list] = React.useState([]);
	const [year_list, setYear_list] = React.useState([]);
	const [isAdmin, setisAdmin] = React.useState(false);
	const [dataState, setDataState] = React.useState(
		{
			member_no: userInfo["member_NO"] == "2019070801" ? "선택" : userInfo["member_NO"],
			select_year:"직접입력",
			project_no: "직접입력",
			project_nm : "",
			instt_code: "",
			instt_nm : "",
			inpt_bgnde: Moment(new Date()).format('YYYY-MM-DD'),
			inpt_endde: Moment(new Date()).format('YYYY-MM-DD'),
			role_code: "RL0001",
			chrg_job: "",
			use_lang: "java, jsp",
			mem_hist_no: ""
		}, [dataState]
	);	// state : 수정을 위한 데이터 관리
	
	const [validateCheck, setValidateCheck] = React.useState({
		member_no:{error:false, helperText:""},
		select_year:{error:false, helperText:""},
		project_no:{error:false, helperText:""},
		project_nm:{error:false, helperText:""},
		instt_nm:{error:false, helperText:""},
		inpt_bgnde:{error:false, helperText:""},
		inpt_endde:{error:false, helperText:""},
		role_code:{error:false, helperText:""},
		chrg_job:{error:false, helperText:""},
		use_lang:{error:false, helperText:""}
	});
	
	const screenType = initCheck(match);
	useEffect(() => {
		if(screenType == "new"){
			axios({
				url: '/intranet/historyinfoForm',
				method: 'post',
				data: {"CODE_ID": ["CD0008", "CD0009"]}
			}).then(response => {
				var proj_list = response.data.proj_list;
				var year_list = new Set();
				for(var i=0; i < proj_list.length; i++){
					year_list.add(proj_list[i]["BGNDE"].slice(0,4));
				}
				
				year_list = Array.from(year_list);
				year_list.sort((a, b) => {
					return b - a;
				});
				
				var allProjectList = response.data.proj_list;
				var thisYearProjectList = allProjectList.filter((info) => 
					info["BGNDE"].slice(0,4) == new Date().getFullYear());
				
				setYear_list([...year_list]);
				setProj_list([...thisYearProjectList]);
				setProj_All_list([...allProjectList]);
				setMember_list([...response.data.member_list]);
				setInstt_list([...response.data.code_list]);
				setRole_list([...response.data.role_list]);
				setisAdmin(response.data.isAdmin);
				if(response.data.isAdmin){
					setDataState({
						...dataState,
						member_no: "선택"
					});
				}
				setShowLoadingBar(false);
			}).catch(e => {
				setShowLoadingBar(false);
				processErrCode(e);
			});
		}else{
			axios({
				url: '/intranet/detailInfo',
				method: 'post',
				data: {"MEM_HIST_NO" : match.params.id, "CODE_ID":"CD0009"}
			}).then(response => {
				console.log(response);
				
				var member_list = [
					{"member_no":response.data.detailInfo["MEMBER_NO"], "name":response.data.detailInfo["MEMBER_NAME"]}];
				setMember_list([...member_list]);
				
				
				/*var project_list = [
					{"PROJECT_NO": -2, "PROJECT_NM":"직접입력"},
					{"PROJECT_NO": response.data.detailInfo["PROJECT_NO"], "PROJECT_NM":response.data.detailInfo["PROJECT_NM"]
				}];*/
				setProj_list([...response.data.proj_list]);
				setRole_list([...response.data.role_list]);
				
				var tmp = {
					member_no: response.data.detailInfo["MEMBER_NO"],
					select_year:"",
					project_no: !response.data.detailInfo["PROJECT_NO"] ? "직접입력" : response.data.detailInfo["PROJECT_NO"],
					project_nm : response.data.detailInfo["PROJECT_NM"],
					instt_code: response.data.detailInfo["INSTT_CODE"],
					instt_nm : response.data.detailInfo["INSTT_NM"],
					inpt_bgnde: Moment(response.data.detailInfo["INPT_BGNDE"]).format('YYYY-MM-DD'),
					inpt_endde: Moment(response.data.detailInfo["INPT_ENDDE"]).format('YYYY-MM-DD'),
					role_code: response.data.detailInfo["ROLE_CODE"],
					chrg_job: response.data.detailInfo["CHRG_JOB"],
					use_lang: response.data.detailInfo["USE_LANG"],
					mem_hist_no: response.data.detailInfo["MEM_HIST_NO"]
				}
				
				var proj_list = response.data.proj_list;
				var year_list = new Set();
				for(var i=0; i < proj_list.length; i++){
					year_list.add(proj_list[i]["BGNDE"].slice(0,4));
				}
				
				year_list = Array.from(year_list);
				year_list.sort((a, b) => {
					return b - a;
				});

				setYear_list([...year_list]);

				setDataState(tmp)
				setisAdmin(response.data.isAdmin);
				setShowLoadingBar(false);
			}).catch(e => {
				setShowLoadingBar(false);
				processErrCode(e);
			});
		}
	}, []);
	
	console.log("dataState : ");
	console.log(dataState);

	// 필드 값 변경 시, 임시로 값 저장
	const handleChange = event => {
		if(event.target.name == "project_nm" && screenType == "new"){
			setDataState({
				...dataState,
				select_year:"직접입력",
				project_no: "직접입력",
				project_nm : event.target.value,
				instt_code: "",
				instt_nm : "",
				inpt_bgnde: Moment(new Date()).format('YYYY-MM-DD'),
				inpt_endde: Moment(new Date()).format('YYYY-MM-DD'),
				role_code: "RL0001",
				chrg_job: "",
				use_lang: "java, jsp",
			});
		}else if(event.target.name == "project_no"){
			var instt_nm = "";
			var instt_code = "";
			var project_nm = "";
			var inpt_bgnde = Moment(new Date()).format('YYYY-MM-DD');
			var inpt_endde = Moment(new Date()).format('YYYY-MM-DD');
			if(event.target.value != "직접입력" && event.target.value != -2){
				var filterList = project_list.filter(info => info.PROJECT_NO == event.target.value);
				project_nm = filterList[0]["PROJECT_NM"];
				instt_nm = filterList[0]["INSTT_NAME"];
				instt_code = filterList[0]["INSTT_CODE"];
				inpt_bgnde = Moment(filterList[0]["BGNDE"]).format('YYYY-MM-DD');
				inpt_endde = Moment(filterList[0]["ENDDE"]).format('YYYY-MM-DD');
			}
			
			setDataState({
				...dataState,
				project_no: event.target.value,
				project_nm: project_nm,
				instt_code : instt_code,
				instt_nm: instt_nm,
				inpt_bgnde: inpt_bgnde,
				inpt_endde: inpt_endde
			});
			
		}else if(event.target.name == "select_year"){
			setDataState({
				...dataState,
				[event.target.name]: event.target.value,
				project_no: event.target.value == "직접입력" ? "직접입력" : "선택",
				project_nm: "",
				instt_code: "",
				instt_nm: "",
			});
			
			if(event.target.value != "직접입력"){
				var list = project_All_list.filter((info) => info["BGNDE"].slice(0,4) == event.target.value);
				setProj_list(list);
			}
			
		}else{
			setDataState({
				...dataState,
				[event.target.name]: event.target.value,
			});
		}
		
		//validate 체크 초기화
		setValidateCheck({
			...validateCheck,
			[event.target.name]: {error:false, helperText:""} 
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
	
	const isValidateCheck = () => {
		var isReturn=false;
		
		let prop_member_no={error:false, helperText:""};
		let prop_select_year={error:false, helperText:""};
		let prop_project_no={error:false, helperText:""};
		let prop_project_nm={error:false, helperText:""};
		let prop_instt_nm={error:false, helperText:""};
		let prop_inpt_bgnde={error:false, helperText:""};
		let prop_inpt_endde={error:false, helperText:""};
		let prop_role_code={error:false, helperText:""};
		let prop_chrg_job={error:false, helperText:""};
		let prop_use_lang={error:false, helperText:""};
		
		
		
		//이름 체크
		if(dataState.member_no == "선택"){
			prop_member_no = {error:true, helperText:"이름을 선택해주세요"};
			isReturn=true;
		}
		
		//년도의 경우 년도를 선택에 놓고 프로젝트를 직접 입력하여 등록할 수 있기 때문에 따로 유효성체크를 진행하지 않는다.
		/*if(dataState.select_year == "선택"){
			setValidateCheck({
				...validateCheck,
				select_year: {error:true, helperText:"년도를 선택해주세요"} 
			});
			return;
		}*/
		
		
		//선택된 프로젝트가 있는지 체크한다.
		if(dataState.project_no == "직접입력" && dataState.project_nm == ""){
			prop_project_no = {error:true, helperText:"프로젝트를 선택해주세요"};
			prop_project_nm = {error:true, helperText:"프로젝트를 입력해주세요"};
			isReturn=true;
		}
		
		//기관
		if(dataState.instt_nm == ""){
			prop_instt_nm = {error:true, helperText:"기관명을 입력해주세요"};
			isReturn=true;
		}
		
		
		
		//투입일과 철수일을 검사한다.
		/*
		 * 	[검사 조건]
		 * 	1-1. 투입일이 철수일보다 나중 인지를 검사한다.
		 *  1-2. 프로젝트를 선택한 경우 투입일과 철수일이 프로젝트 진행 기간 안에 존재하는지 확인한다.
		 */
		var inpt_bgnde = dataState["inpt_bgnde"].replace("-", "").replace("-", "");
		var inpt_endde = dataState["inpt_endde"].replace("-", "").replace("-", "");
		if(inpt_bgnde > inpt_endde){
			prop_inpt_bgnde = {error:true, helperText:"투입일과 철수일을 확인해주세요"};
			prop_inpt_endde = {error:true, helperText:"투입일과 철수일을 확인해주세요"};
			isReturn=true;
		}
		
		if(dataState.project_no != "직접입력" && dataState.project_no != -2){
			var selectedProjectInfo = project_list.filter((info) => info.PROJECT_NO == dataState.project_no)[0];
			var selProjectBGNDE = selectedProjectInfo["BGNDE"].replace("-", "").replace("-", "");
			var selProjectENDDE = selectedProjectInfo["ENDDE"].replace("-", "").replace("-", "");
			if(inpt_bgnde < selProjectBGNDE){
				prop_inpt_bgnde= {error:true, helperText:"프로젝트 최초 투입일은 "+Moment(selectedProjectInfo["BGNDE"]).format("YYYY-MM-DD")+"입니다."};
				isReturn=true;
			}
			
			if(inpt_endde > selProjectENDDE){
				prop_inpt_endde= {error:true, helperText:"프로젝트 최종 철수일은 "+Moment(selectedProjectInfo["ENDDE"]).format("YYYY-MM-DD")+"입니다."};
				isReturn=true;
			}
		}
		
		//담당업무
		if(dataState.chrg_job == ""){
			prop_chrg_job = {error:true, helperText:"담당 업무를 입력해주세요"};
			isReturn=true;
		}
		
		if(dataState.use_lang == ""){
			prop_use_lang = {error:true, helperText:"사용 기술을 입력해주세요"};
			isReturn=true;
		}
		
		setValidateCheck({
			member_no:prop_member_no,
			select_year:prop_select_year,
			project_no :prop_project_no,
			project_nm :prop_project_nm,
			instt_nm   :prop_instt_nm,
			inpt_bgnde :prop_inpt_bgnde,
			inpt_endde :prop_inpt_endde,
			role_code  :prop_role_code,
			chrg_job  :prop_chrg_job,
			use_lang  :prop_use_lang
		});
		if(isReturn){
			return true;
		}
		
		return false;
		
	}

	const handleClickAddHist = () => {
		if(isValidateCheck()){
			return;
		}
		
		setShowLoadingBar(true);
		
		
		var sendData = JSON.parse(JSON.stringify(dataState));
		
		if(sendData.project_no == -2){
			sendData.project_no = null;
		}
		
		sendData.inpt_bgnde = sendData.inpt_bgnde.replace("-", "").replace("-", "");
		sendData.inpt_endde = sendData.inpt_endde.replace("-", "").replace("-", "");
		sendData.project_no = sendData.project_no == "직접입력" ? null : sendData.project_no;
		axios({
			url: '/intranet/historyInsert',
			method: 'post',
			data: sendData
		}).then(response => {
			setShowLoadingBar(false);
			
			if(response.data.isDBError){
				alert("DB insert에 실패했습니다.");
				return;
			}else{
				alert("이력 등록에 성공했습니다.");
				history.goBack();
			}
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
		
		
		
	}

	const removeHistory = () => {
		if(isValidateCheck()){
			return;
		}
		
		
		setShowLoadingBar(true);
		axios({
			url: '/intranet/removeHistory',
			method: 'post',
			data: {"MEM_HIST_NO" : dataState.mem_hist_no}
		}).then(response => {
			setShowLoadingBar(false);
			
			if(response.data.isDBError){
				alert("이력 삭제에 실패했습니다.");
				return;
			}else{
				alert("이력 삭제에 성공했습니다.");
				history.goBack();
			}
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
		//history.goBack();
	}
	
	// confirm, alert 창 함수
  	// 초기값은 {}로 설정하고 온오프시  {title:'', content:'', onOff:'true of false'} 형식으로 setting됨.
	const [dialog, setDialog] = React.useState({});
	const handleClickRemoveHistory = () => {
		handleOpenDialog("이력관리", "이력을 삭제하시겠습니까?", true);
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
			removeHistory();
		}else{
			return;
		}
	}

	const handleClickUpdateHistory = () => {
		if(isValidateCheck()){
			return;
		}
		
		console.log("dataState : ");
		console.log(dataState);
		
		dataState.inpt_bgnde = dataState.inpt_bgnde.replace("-", "").replace("-","");
		dataState.inpt_endde = dataState.inpt_endde.replace("-", "").replace("-","");
		
		setShowLoadingBar(true);
		axios({
			url: '/intranet/updateHistory',
			method: 'post',
			data: dataState
		}).then(response => {
			setShowLoadingBar(false);
			
			if(response.data.isDBError){
				alert("이력 갱신에 실패했습니다.");
				return;
			}else{
				alert("이력 갱신에 성공했습니다.");
				//관리자가 등록하면 등록한 사람의 이력이 보일수있게 변경
				history.goBack();
			}
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	const handleClickCancle = () => {
		history.goBack();
	};

	return (
		<>
			"여기는 새로운 등록화면이요"
			<CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
			<LoadingBar openLoading={isShowLoadingBar}/>
			<div className={classes.root}>
			</div>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell 
								align="left"
								 colSpan="6">
								<Typography className={classes.title} color="inherit" variant="h6">
									{screenType == "new" ? "이력관리 등록" : "이력관리 수정"}
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell align="left" component="th" scope="row" style={{ width: '120px' }}>이름</TableCell>
							<TableCell align="left">
								<TextField
									id="member_no"
									name="member_no"
									margin="dense"
									variant="outlined"
									value={dataState.member_no}
									onChange={handleChange}
									InputProps={{
									 	 readOnly: screenType == "modify" ? true : member_list.length == 0 ? true : false,
									}}
									autoComplete="off"
									error={validateCheck.member_no.error}
									helperText={validateCheck.member_no.helperText}
									fullWidth
									select>
									<MenuItem key={"선택"} value={"선택"}>
										선택
									</MenuItem>
									{ member_list.map(option => {
										return(
											<MenuItem key={option.member_no} value={option.member_no}>
												{option.name}
											</MenuItem>
										)
									})}
									{	member_list.length == 0 &&
										<MenuItem key={userInfo["member_NO"]} value={userInfo["member_NO"]}>
											{userInfo["name"]}
										</MenuItem>
									}
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row" style={{ width: '120px' }}>년도</TableCell>
							<TableCell align="left">
								<TextField
									id="select_year"
									name="select_year"
									margin="dense"
									variant="outlined"
									value={dataState.select_year}
									onChange={handleChange}
									autoComplete="off"
									error={validateCheck.select_year.error}
									helperText={validateCheck.select_year.helperText}
									fullWidth
									select = {year_list.length > 0 ? true : false}>
									<MenuItem key={"직접입력"} value={"직접입력"}>
										직접입력
									</MenuItem>
									{year_list.map(option => {
										return(
											<MenuItem key={option} value={option}>
												{option}
											</MenuItem>	
										)
									})}
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row" colSpan="2" style={{color:"red", fontSize:"12px"}}>회사에서 진행한 프로젝트만 년도를 선택해주세요
							(년도를 선택하면 해당 년도의 프로젝트 목록을 불러옵니다.)</TableCell>
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
									InputProps={{
									 	 readOnly: screenType == "new" ? false : true,
									}}
									value={dataState.project_no}
									autoComplete="off"
									error={validateCheck.project_no.error}
									helperText={validateCheck.project_no.helperText}
									fullWidth
									select>
									{	(dataState.select_year == "직접입력") &&
										<MenuItem key={"직접입력"} value={"직접입력"}>
											직접입력
										</MenuItem>
									}
									{	(dataState.select_year != "직접입력") &&
										<MenuItem key={"선택"} value={"선택"}>
											선택
										</MenuItem>
									}
									{
										(dataState.select_year != "직접입력") 
										&& project_list.length > 0 &&
											project_list.map(option => {
											return(
												<MenuItem key={option.PROJECT_NO} value={option.PROJECT_NO}>
													{option.PROJECT_NM}
												</MenuItem>
											)
									})}
								</TextField>
							</TableCell>
						</TableRow>
						{ 
							(dataState.select_year == "직접입력" &&  dataState.project_no == "직접입력") && 
							<TableRow>
								<TableCell align="left" component="th" scope="row">프로젝트명(직접입력)</TableCell>
								<TableCell align="left">
									<TextField
										id="project_nm"
										name="project_nm"
										margin="dense"
										variant="outlined"
										autoComplete="off"
										placeholder="회사 프로젝트는 년도와 프로젝트를 선택해주세요"
										error={validateCheck.project_nm.error}
										helperText={validateCheck.project_nm.helperText}
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
									id="instt_nm"
									name="instt_nm"
									margin="dense"
									variant="outlined"
									error={validateCheck.instt_nm.error}
									helperText={validateCheck.instt_nm.helperText}
									placeholder="직접입력"
									autoComplete="off"
									fullWidth
									onChange={handleChange}
									InputProps={{
									 	 readOnly: dataState.project_no == "선택" || screenType == "new" ? false : true,
									}}
									value={dataState.instt_nm}>
									"직접입력"
								</TextField>
							</TableCell>
						</TableRow>
						
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
											error={validateCheck.inpt_bgnde.error}
											helperText={validateCheck.inpt_bgnde.helperText}
											value={dataState.inpt_bgnde}
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
											value={dataState.inpt_endde}
											error={validateCheck.inpt_endde.error}
											helperText={validateCheck.inpt_endde.helperText}
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
									autoComplete="off"
									error={validateCheck.role_code.error}
									helperText={validateCheck.role_code.helperText}
									onChange={handleChange}
									value={dataState.role_code}
									fullWidth
									select>
									{role_list.map(tmp => (
										<MenuItem key={tmp.CODE_ID} value={tmp.CODE_ID} name={tmp.CODE_NAME}>
											{tmp.CODE_NAME}
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
									autoComplete="off"
									error={validateCheck.chrg_job.error}
									helperText={validateCheck.chrg_job.helperText}
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
									autoComplete="off"
									error={validateCheck.use_lang.error}
									helperText={validateCheck.use_lang.helperText}
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
						screenType == "new" &&
						(
							<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickAddHist}>
								등록
							</Button>
						)
					}
					{
						screenType == "modify" && ( isAdmin ||  userInfo.member_NO == dataState.member_no) &&
						(
							<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickUpdateHistory}>
								수정
							</Button>
						)
					}
					{
						screenType == "modify" && ( isAdmin ||  userInfo.member_NO == dataState.member_no) && 
						(
							<Button variant="contained" color="secondary" size="small" className={classes.button} onClick={handleClickRemoveHistory}>
								삭제
							</Button>
						)
					}
				</div>
			</Toolbar>
		</>
	);
}
export default HistoryInfoRegist;