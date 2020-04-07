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
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import CancelIcon from '@material-ui/icons/Cancel';

import { LoadingBar }  from '../../../../common/LoadingBar/LoadingBar';
import { processErrCode }  from '../../../../js/util';
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
function ProjectInfoForm(props) {

	const classes = useStyles();
	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const { location, match, history } = props.routeProps.routeProps;
	const { routeProps } = props.routeProps;
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(true, []);    //loading bar
	const [instt_list, setInstt] = React.useState([], []);
	const [member_list, setMember] = React.useState([], [member_list]);
	const [role_list, setRole] = React.useState([], []);
	const [updatedMemList, setUpdateMemList] = React.useState([], []);
	const [renderWant, setRenderWant] = React.useState(true);
	const screenType = initCheck(match);
	
	const [dataState, setDataState] = React.useState({
		PROJECT_NM : "",
		INSTT_CODE : "",
		BGNDE : Moment(new Date()).format('YYYY-MM-DD'),
		ENDDE : Moment(new Date()).format('YYYY-MM-DD'),
		TRANSPORT_CT : "",
		PM : "",
	});	// state : 수정을 위한 데이터 관리
	const [memDataState, setMemDataState] = React.useState([{
		MEMBER_NO : "",
		CHRG_JOB : "",
		INPT_BGNDE : dataState.BGNDE,
		INPT_ENDDE : dataState.ENDDE,
		ROLE_CODE : "RL0000",
		USE_LANG : "Java,Jsp,Javascript",
	}]);	// state : 수정을 위한 데이터 관리
	
	const [validateCheck, setValidateCheck] = React.useState({
		PROJECT_NM:{error:false, helperText:""},
		INSTT_CODE:{error:false, helperText:""},
		BGNDE:{error:false, helperText:""},
		ENDDE:{error:false, helperText:""},
		TRANSPORT_CT:{error:false, helperText:""},
	});

	const [validateMemCheck, setValidateMemCheck] = React.useState([{
		MEMBER_NO:{error:false, helperText:""},
		CHRG_JOB:{error:false, helperText:""},
		INPT_BGNDE:{error:false, helperText:""},
		INPT_ENDDE:{error:false, helperText:""},
		ROLE_CODE:{error:false, helperText:""},
		USE_LANG:{error:false, helperText:""},
	}]);
	
	const columnsUp = [
		{ id: 'MEMBER_NO', label: '이름', minWidth: 100, align: 'center' },
		{ id: 'CHRG_JOB', label: '담당업무', minWidth: 100, align: 'center' },
		{ id: 'TERM', label: '프로젝트 기간', minWidth: 100, align: 'center' },
		{ id: 'ROLE', label: '역할', minWidth: 100, align: 'center' },
		{ id: 'USE_LANG', label: '비고', minWidth: 100, align: 'center' },
		{ id: 'BTN', label: screenType == "new" ? "행삭제" : '수정/삭제', minWidth: 100, align: 'center' },
	];
	const columnsDown = [
		{ id: 'MEMBER_NO', label: '이름', minWidth: 100, align: 'center' },
		{ id: 'CHRG_JOB', label: '담당업무', minWidth: 100, align: 'center' },
		{ id: 'BTN', label: screenType == "new" ? "행삭제" : '수정/삭제', minWidth: 100, align: 'center' },
	];
    let columns = columnsUp;
    if (isWidthUp('md', props.width)) {
      columns = columnsUp;
    } else {
      columns = columnsDown;
    }


	useEffect(() => {
		setUpdateMemList([]);
		if(screenType == "new"){
			axios({
				url: '/intranet/projectInfo',
				method: 'post',
				data: {"CODE_ID": ["CD0008", "CD0009"]}
			}).then(response => {
				setInstt(response.data.code_list);
				setMember(response.data.member_list);
				setRole(response.data.role_list);
				setShowLoadingBar(false);
			}).catch(e => {
				setShowLoadingBar(false);
				processErrCode(e);
			});
		}else if(screenType == "modify"){
			axios({
				url: '/intranet/projectDetailInfo',
				method: 'post',
				data: {"PROJECT_NO": match.params.id}
			}).then(response => {
				setInstt(response.data.code_list);
				setMember(response.data.member_list);
				setRole(response.data.role_list);

				var projectInfo = response.data.project_info;
				projectInfo["BGNDE"] = projectInfo["BGNDE"].slice(0,4) + "-" + projectInfo["BGNDE"].slice(4,6) + "-" + projectInfo["BGNDE"].slice(6,8);  
				projectInfo["ENDDE"] = projectInfo["ENDDE"].slice(0,4) + "-" + projectInfo["ENDDE"].slice(4,6) + "-" + projectInfo["ENDDE"].slice(6,8);  
				setDataState(projectInfo);

				var tmp = [];
				for(var i=0; i < response.data.proMemList.length; i++){
					var validateMemCheck_defaultForm = {
						MEMBER_NO:{error:false, helperText:""},
						CHRG_JOB:{error:false, helperText:""},
						INPT_BGNDE:{error:false, helperText:""},
						INPT_ENDDE:{error:false, helperText:""},
						ROLE_CODE:{error:false, helperText:""},
						USE_LANG:{error:false, helperText:""},
					}
					
					tmp.push(validateMemCheck_defaultForm);
				}
				setValidateMemCheck(tmp);
				
				
				var proMemList = response.data.proMemList;
				for(var idx=0; idx < proMemList.length; idx++){
					proMemList[idx]["INPT_BGNDE"] = proMemList[idx]["INPT_BGNDE"].slice(0,4) + "-" + proMemList[idx]["INPT_BGNDE"].slice(4,6) + "-" + proMemList[idx]["INPT_BGNDE"].slice(6,8);
					proMemList[idx]["INPT_ENDDE"] = proMemList[idx]["INPT_ENDDE"].slice(0,4) + "-" + proMemList[idx]["INPT_ENDDE"].slice(4,6) + "-" + proMemList[idx]["INPT_ENDDE"].slice(6,8);
				}
				setMemDataState(proMemList);
				setShowLoadingBar(false);
			}).catch(e => {
				setShowLoadingBar(false);
				processErrCode(e);
			});
		}
	}, [renderWant]);
	
	
	console.log("ValidateMemCheck : ");
	console.log(validateMemCheck);

	const handleAddRow = () => {
		console.log(memDataState);

		var member_defaultForm = {
			MEMBER_NO : "",
			CHRG_JOB : "",
			INPT_BGNDE : dataState.BGNDE,
			INPT_ENDDE : dataState.ENDDE,
			ROLE_CODE : "RL0001",
			USE_LANG : "Java,Jsp,Javascript",
		}

		memDataState.push(member_defaultForm)
		setMemDataState([...memDataState]);
		
		
		var validateMemCheck_defaultForm = {
			MEMBER_NO:{error:false, helperText:""},
			CHRG_JOB:{error:false, helperText:""},
			INPT_BGNDE:{error:false, helperText:""},
			INPT_ENDDE:{error:false, helperText:""},
			ROLE_CODE:{error:false, helperText:""},
			USE_LANG:{error:false, helperText:""},
		}
		validateMemCheck.push(validateMemCheck_defaultForm);
		setValidateMemCheck([...validateMemCheck]);
	}

	// 필드 값 변경 시, 임시로 값 저장
	const handleChange = event => {
		if(event.target.name == 'TRANSPORT_CT') {	// 결제금액 특수문자 제거
			event.target.value = event.target.value.replace(/[^0-9]/g, '');
		}
		setDataState({
			...dataState,
			[event.target.name]: event.target.value
		});
		
		
		setValidateCheck({
			...validateCheck,
			[event.target.name] : {error:false, helperText:""},
		});
	};

	const handleMemChange = (event, idx) => {
		if(screenType == "modify" && updatedMemList.indexOf(idx) < 0){
			updatedMemList.push(idx);
			setUpdateMemList(updatedMemList);
		}
		
		var validateMemCheck_defaultForm = {
			MEMBER_NO:{error:false, helperText:""},
			CHRG_JOB:{error:false, helperText:""},
			INPT_BGNDE:{error:false, helperText:""},
			INPT_ENDDE:{error:false, helperText:""},
			ROLE_CODE:{error:false, helperText:""},
			USE_LANG:{error:false, helperText:""},
		}
		
		
		//투입인원에대한 에러 문구는 한번에 초기화 시켜준다
		var defaultMemberValidate = [];
		for(var i=0; i < memDataState.length; i++){
			defaultMemberValidate.push(validateMemCheck_defaultForm);
		}
		setValidateMemCheck(defaultMemberValidate);

		memDataState[idx][event.target.name] = event.target.value;
		setMemDataState([...memDataState]);
	}

	const handleChangeDate = (date, target, idx) => {
		console.log("handleChangeDate : ");
		if(!target.includes("INPT_")){
			console.log("target not include inpt_");
			setDataState({
				...dataState,
				[target]: Moment(date).format('YYYY-MM-DD')
			});
			
			//투입일 철수일이 수정되었을때 에러문구 초기화
			setValidateCheck({
				...validateCheck,
				[target]: {error:false, helperText:""}
			});
		}else{
			console.log("target include inpt_");
			if(screenType == "modify" && updatedMemList.indexOf(idx) < 0){
				updatedMemList.push(idx);
				setUpdateMemList(updatedMemList);
			}
			memDataState[idx][target] = Moment(date).format('YYYY-MM-DD'); 
			setMemDataState([...memDataState]);
			
			var tmp = [];
			for(var i=0; i < memDataState.length; i++){
				var validateMemCheck_defaultForm = {
					MEMBER_NO:{error:false, helperText:""},
					CHRG_JOB:{error:false, helperText:""},
					INPT_BGNDE:{error:false, helperText:""},
					INPT_ENDDE:{error:false, helperText:""},
					ROLE_CODE:{error:false, helperText:""},
					USE_LANG:{error:false, helperText:""},
				}
				
				tmp.push(validateMemCheck_defaultForm);
			}
			setValidateMemCheck(tmp);
		}
	}
	
	const isValidateCheck = () => {
		var isError = false;
		let prop_PROJECT_NM={error:false, helperText:""};
		let prop_INSTT_CODE={error:false, helperText:""};
		let prop_BGNDE={error:false, helperText:""};
		let prop_ENDDE={error:false, helperText:""};
		let prop_TRANSPORT_CT={error:false, helperText:""};
		let prop_PM={error:false, helperText:""};
		
		
		//프로그램 명 체크
		if(dataState.PROJECT_NM == ""){
			prop_PROJECT_NM = {error:true, helperText:"이름을 선택해주세요"};
			isError = true;
		}
		
		//발주처
		if(dataState.INSTT_CODE == ""){
			prop_INSTT_CODE={error:true, helperText:"발주처를 선택해주세요"};
			isError = true;
		}
		
		//투입일 - 철수일
		if(dataState.BGNDE == ""){
			prop_BGNDE={error:true, helperText:"투입일을 입력해주세요"};
			isError = true;
		}
		
		if(dataState.ENDDE == ""){
			prop_ENDDE={error:false, helperText:""};
			isError = true;
		}
		
		if(dataState.BGNDE > dataState.ENDDE){
			prop_BGNDE={error:true, helperText:"투입일과 철수일을 확인해주세요"};
			prop_ENDDE={error:true, helperText:"투입일과 철수일을 확인해주세요"};
			isError = true;
		}
		
		//교통비
		if(dataState.TRANSPORT_CT == ""){
			prop_TRANSPORT_CT={error:true, helperText:"교통비을 입력해주세요"};
			isError = true;
		}

		//PM
		/*if(dataState.PM == ""){
			
		}*/
		setValidateCheck({
			PROJECT_NM : prop_PROJECT_NM,
			INSTT_CODE : prop_INSTT_CODE,
			BGNDE : prop_BGNDE,
			ENDDE : prop_ENDDE,
			TRANSPORT_CT : prop_TRANSPORT_CT,
			PM : prop_PM,
		});
		if(isError){
			return isError;
		}
		return isError;
	}
	
	const isMemberValidateCheck = () => {
		var isError = false;
		var errorList = [];
		for (var i = 0; i < memDataState.length; i++){
			var validateMemCheck_defaultForm = {
				MEMBER_NO:{error:false, helperText:""},
				CHRG_JOB:{error:false, helperText:""},
				INPT_BGNDE:{error:false, helperText:""},
				INPT_ENDDE:{error:false, helperText:""},
				ROLE_CODE:{error:false, helperText:""},
				USE_LANG:{error:false, helperText:""},
			}
			
			
			//이름
			if(memDataState[i]["MEMBER_NO"] == ""){
				validateMemCheck_defaultForm.MEMBER_NO = {error:true, helperText:"사원을 선택해주세요"};
				isError = true;
			}
			//담당업무	
			if(memDataState[i]["CHRG_JOB"] == ""){
				validateMemCheck_defaultForm.CHRG_JOB = {error:true, helperText:"역할을 입력해주세요"};
				isError = true;
			}
			
			else if(memDataState[i]["CHRG_JOB"].length > 30){
				validateMemCheck_defaultForm.CHRG_JOB = {error:true, helperText:"역할을 너무 길게 입력하셨습니다."};
				isError = true;
			}
			
			//프로젝트 기간
			var INPT_BGNDE = memDataState[i]["INPT_BGNDE"].replace("-", "").replace("-", "");
			var INPT_ENDDE = memDataState[i]["INPT_ENDDE"].replace("-", "").replace("-", "");
			var BGNDE = dataState.BGNDE.replace("-", "").replace("-", "");
			var ENDDE = dataState.ENDDE.replace("-", "").replace("-", "");
			if(INPT_BGNDE > INPT_ENDDE ){
				validateMemCheck_defaultForm.INPT_BGNDE = {error:true, helperText:"투입일을 확인해주세요"};
				validateMemCheck_defaultForm.INPT_ENDDE = {error:true, helperText:"철수일을 확인해주세요"};
				isError = true;
			}
			
			if(INPT_BGNDE < BGNDE){
				validateMemCheck_defaultForm.INPT_BGNDE = {error:true, helperText:"투입일을 확인해주세요"};
				isError = true;
			}
			
			if(INPT_ENDDE > ENDDE){
				validateMemCheck_defaultForm.INPT_ENDDE = {error:true, helperText:"철수일을 확인해주세요"};
				isError = true;
			}
			
			//역할
			if(memDataState[i]["ROLE_CODE"] == ""){
				validateMemCheck_defaultForm.ROLE_CODE = {error:true, helperText:"역할을 선택해주세요"};
				isError = true;
			}
			//비고
			if(memDataState[i]["USE_LANG"] == "" ){
				validateMemCheck_defaultForm.USE_LANG = {error:true, helperText:"비고를 입력해주세요"};
				isError = true;
			}
			else if(memDataState[i]["USE_LANG"].length > 30){
				validateMemCheck_defaultForm.CHRG_JOB = {error:true, helperText:"비고을 너무 길게 입력하셨습니다."};
				isError = true;
			}
			errorList.push(validateMemCheck_defaultForm);
		}
		setValidateMemCheck(errorList);
		if(isError){
			return isError;
		}
		return isError;
	}
	

	const handleClickAddProject = () => {
		if(isValidateCheck()){
			return;
		}
		
		if(isMemberValidateCheck()){
			return;
		}
		
		setShowLoadingBar(true);
		var instt = instt_list.filter((info) => (info.instt_code == dataState.instt_code))[0];
		console.log("dataState : ");
		dataState["PM"] = memDataState[0]["MEMBER_NO"];
		axios({
			url: '/intranet/insertProject',
			method: 'post',
			data: {"dataState" : dataState, "memDataState": memDataState, "instt_name":instt["CODE_NAME"], "instt_code":instt["CODE_ID"]}
		}).then(response => {
			setShowLoadingBar(false);
			if(!response.data.isDBError){
				alert("등록 되었습니다.");
				history.goBack();
			}else{
				alert("등록 실패했습니다.");
			}
		}).catch(e => {
			setShowLoadingBar(false);
		});
	}

	const handleClickModifyProject = () => {
		console.log("updatedMemList : ");
		console.log(updatedMemList);

		var memUpdateList = [];
		for(var i=0; i < updatedMemList.length; i++){
			memUpdateList.push(memDataState[updatedMemList[i]]);
		}


		setShowLoadingBar(true);
		axios({
			url: '/intranet/updateProjectInfo',
			method: 'post',
			data: {"PROJECT_NO":match.id, "dataState": dataState, "memDataState":memUpdateList}
		}).then(response => {
			setShowLoadingBar(false);
			if(response.data.isDBError){
				alert("수정 실패했습니다.")
			}else{
				alert("수정되었습니다.");
				history.goBack();
			}
		}).catch(e => {
			setShowLoadingBar(false);
		});
	}
	const removeProject = () => {
		setShowLoadingBar(true);
		axios({
			url: '/intranet/removeProject',
			method: 'post',
			data: {"PROJECT_NO": match.params.id}
		}).then(response => {
			setShowLoadingBar(false);
			if(response.data.isDBError){
				alert("삭제 실패 했습니다.")
			}else{
				alert("삭제했습니다.");
				history.goBack();
			}
		}).catch(e => {
			setShowLoadingBar(false);
		});
	}
	
	const handleRemoveRow = (idx) => {
		console.log("---------remove click "+ idx +"-------");
		if(idx == 0){
			alert("PM은 삭제할 수 없습니다.");
			return;
		}
	}

	const handleRemoveMember = (member_no) => {
		var list = memDataState.filter((info) => (info.MEMBER_NO != member_no));
		
		setShowLoadingBar(true);
		axios({
			url: '/intranet/removeMember',
			method: 'post',
			data: {"PROJECT_NO": match.params.id, "MEMBER_NO" : member_no}
		}).then(response => {
			setShowLoadingBar(false);
			if(response.data.isDBError){
				alert("삭제 실패 했습니다.")
			}else{
				alert("삭제했습니다.");
				setMemDataState([...list]);
				setRenderWant(!renderWant);
			}
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	
	const handleUpdateMember = (memDataState) => {
		setShowLoadingBar(true);
		
		memDataState["INPT_BGNDE"] = memDataState["INPT_BGNDE"].replace("-", "").replace("-", "");
		memDataState["INPT_ENDDE"] = memDataState["INPT_ENDDE"].replace("-", "").replace("-", "");
		axios({
			url: '/intranet/updateMember',
			method: 'post',
			data: {"PROJECT_NO": match.params.id, "memDataState" : memDataState}
		}).then(response => {
			setShowLoadingBar(false);
			if(response.data.isDBError){
				alert("갱신 실패 했습니다.")
			}else{
				alert("갱신했습니다.");
			}
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	
	const handleClickCancle = () => {
		history.goBack();
	};
	
	
	
	// confirm, alert 창 함수
  	// 초기값은 {}로 설정하고 온오프시  {title:'', content:'', onOff:'true of false'} 형식으로 setting됨.
	const [dialog, setDialog] = React.useState({});
	
	const handleClickRemoveProject = () => {
		handleOpenDialog("프로젝트 관리", "프로젝트를 삭제하시겠습니까?", true);
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
			removeProject();
		}else{
			return;
		}
	}

	return (
			<>
			<CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
			<LoadingBar openLoading={isShowLoadingBar}/>
			<div className={classes.root}>
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="left" colSpan="2">
									<Toolbar>
										<Typography className={classes.title} color="inherit" variant="h6">
											{screenType == "new" ? "프로젝트 등록" : "프로젝트 수정"}
										</Typography>
										<div>
											<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickCancle}>
												취소
											</Button>

											{
												screenType == "new" &&
												<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickAddProject}>
													등록
												</Button>
											}
											{
												screenType == "modify" &&
												<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickModifyProject}>
													수정
												</Button>
											}
											{
												screenType == "modify" &&
												<Button variant="contained" color="secondary" size="small" className={classes.button} onClick={handleClickRemoveProject}>
													삭제
												</Button>
											}
										</div>
									</Toolbar>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell align="left" component="th" scope="row" style={{ width: '120px' }}>프로젝트명</TableCell>
								<TableCell align="left">
									<TextField
										id="PROJECT_NM"
										name="PROJECT_NM"
										margin="dense"
										variant="outlined"
										value={dataState.PROJECT_NM}
										onChange={handleChange}
										error={validateCheck.PROJECT_NM.error}
										helperText={validateCheck.PROJECT_NM.helperText}
										autoComplete="off"
										fullWidth
									>
									</TextField>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" component="th" scope="row">발주처</TableCell>
								<TableCell align="left">
									<TextField
										id="INSTT_CODE"
										name="INSTT_CODE"
										margin="dense"
										variant="outlined"
										onChange={handleChange}
										value={dataState.INSTT_CODE}
										error={validateCheck.INSTT_CODE.error}
										helperText={validateCheck.INSTT_CODE.helperText}
										autoComplete="off"
										fullWidth
										select>
										{instt_list.map(info => (
											<MenuItem key={info.CODE_ID} value={info.CODE_ID}>
												{info.CODE_NAME}
											</MenuItem>
										))}
									</TextField>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" component="th" scope="row">착수일</TableCell>
								<TableCell align="left">
									<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
										<Grid container justify="space-around">
											<DatePicker
												locale='ko'
												margin="dense"
												id="BGNDE"
												name="BGNDE"
												views={["year", "month", "date"]}
												format="yyyy-MM-dd"
												/* minDate={new Date()} */
												value={dataState.BGNDE}
												onChange={(data) => {handleChangeDate(data, "BGNDE")}}
												error={validateCheck.BGNDE.error}
												helperText={validateCheck.BGNDE.helperText}
												inputVariant="outlined"
												readOnly={false}
												// InputAdornmentProps={{ position: "start" }}
												fullWidth
											/>
										</Grid>
									</MuiPickersUtilsProvider>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" component="th" scope="row">종료일</TableCell>
								<TableCell align="left" >
									<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
										<Grid container justify="space-around">
											<DatePicker
												locale='ko'
												margin="dense"
												id="ENDDE"
												name="ENDDE"
												views={["year", "month", "date"]}
												format="yyyy-MM-dd"
												/* maxDate={dataState.ENDDE} */
												value={dataState.ENDDE}
												error={validateCheck.ENDDE.error}
												helperText={validateCheck.ENDDE.helperText}
												onChange={(data) => {handleChangeDate(data, "ENDDE")}}
												inputVariant="outlined"
												readOnly={false}
												fullWidth
											/>
										</Grid>
									</MuiPickersUtilsProvider>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" component="th" scope="row">교통비</TableCell>
								<TableCell align="left">
									<CurrencyTextField
										id="TRANSPORT_CT"
										name="TRANSPORT_CT"
										variant="outlined"
										currencySymbol="￦"
										minimumValue="0"
										decimalPlaces={0}
										error={validateCheck.TRANSPORT_CT.error}
										helperText={validateCheck.TRANSPORT_CT.helperText}
										value={dataState.TRANSPORT_CT}
										onChange={handleChange}
										autoComplete="off"
										fullWidth
									/>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>

				<TableContainer>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell align="left" colSpan="6">
									<Toolbar>
										<Typography className={classes.title} color="inherit" variant="h6">
											투입인원
										</Typography>
										<div>
											<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleAddRow}>
												추가
											</Button>
										</div>
									</Toolbar>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								{columns.map(column => (
									<TableCell
										key={column.id}
										align={column.align}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
							{memDataState.map((row, idx) => {
								return (
									<TableRow
										key={"row"+idx}>
										<TableCell 
											align="left"
											key={"NAME" + idx}>
											<TextField
												id="MEMBER_NO"
												name="MEMBER_NO"
												margin="dense"
												variant="outlined"
												value={memDataState[idx]["MEMBER_NO"]}
												error={validateMemCheck[idx]["MEMBER_NO"].error}
												helperText={validateMemCheck[idx]["MEMBER_NO"].helperText}
												onChange={(event) => {handleMemChange(event, idx)}}
												readOnly={screenType=="modify"}
												fullWidth
												select
											>
											{member_list.map(info => {
												if(screenType == "new" || memDataState[idx]["MEMBER_NO"] == info.member_no || !memDataState[idx]["MEMBER_NO"]){
													return (
														<MenuItem key={info.member_no} value={info.member_no}>
															{info.name}
														</MenuItem>
													)
												}
											})}
											</TextField>
										</TableCell>
										<TableCell 
											align="left"
											key={"CHRG_JOB" + idx}>
											<TextField
												id="CHRG_JOB"
												name="CHRG_JOB"
												margin="dense"
												variant="outlined"
												autoComplete="off"
												error={validateMemCheck[idx]["CHRG_JOB"].error}
												helperText={validateMemCheck[idx]["CHRG_JOB"].helperText}
												value={memDataState[idx]["CHRG_JOB"]}
												onChange={(event) => {handleMemChange(event, idx)}}
												fullWidth
											>
											</TextField>
										</TableCell>
										{ isWidthUp('md', props.width) && 
											<TableCell 
												align="left"
												key={"INPT" + idx}>
												<Toolbar>
													<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
														<Grid container justify="space-around">
															<DatePicker
																locale='ko'
																margin="dense"
																id="INPT_BGNDE"
																name="INPT_BGNDE"
																views={["year", "month", "date"]}
																format="yyyy-MM-dd"
																minDate={dataState.BGNDE}
																value={memDataState[idx]["INPT_BGNDE"]}
																error={validateMemCheck[idx]["INPT_BGNDE"].error}
																helperText={validateMemCheck[idx]["INPT_BGNDE"].helperText}
																onChange={(data) => {handleChangeDate(data, "INPT_BGNDE", idx)}}
																inputVariant="outlined"
																readOnly={false}
																fullWidth
															/>
														</Grid>
													</MuiPickersUtilsProvider>
													~
													<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
														<Grid container justify="space-around">
															<DatePicker
																locale='ko'
																margin="dense"
																id="INPT_ENDDE"
																name="INPT_ENDDE"
																views={["year", "month", "date"]}
																format="yyyy-MM-dd"
																maxDate={dataState.ENDDE}
																value={memDataState[idx]["INPT_ENDDE"]}
																error={validateMemCheck[idx]["INPT_ENDDE"].error}
																helperText={validateMemCheck[idx]["INPT_ENDDE"].helperText}
																onChange={(data) => {handleChangeDate(data, "INPT_ENDDE", idx)}}
																inputVariant="outlined"
																readOnly={false}
																fullWidth
															/>
														</Grid>
													</MuiPickersUtilsProvider>
												</Toolbar>
											</TableCell>
										}
										{ isWidthUp('md', props.width) && 
											<TableCell 
												align="left"
												key={"ROLE_CODE" + idx}>
												<TextField
													id="ROLE_CODE"
													name="ROLE_CODE"
													margin="dense"
													variant="outlined"
													error={validateMemCheck[idx]["ROLE_CODE"].error}
													helperText={validateMemCheck[idx]["ROLE_CODE"].helperText}
													value={screenType == "new" && idx == 0 ? "RL0000" : memDataState[idx]["ROLE_CODE"]}
													onChange={(event) => {handleMemChange(event, idx)}}
													fullWidth
													select
												>
													{role_list.map(info => {
														if(screenType == "new"){
															if(idx == 0 && info["CODE_ID"] == "RL0000"){
																return (
																	<MenuItem key={info["CODE_ID"]} value={info["CODE_ID"]}>
																		{info["CODE_NAME"]}
																	</MenuItem>
																);
															}else if(idx != 0){
																if(info["CODE_ID"] == "RL0000"){
																	
																}else{
																	return (
																		<MenuItem key={info["CODE_ID"]} value={info["CODE_ID"]}>
																			{info["CODE_NAME"]}
																		</MenuItem>
																	);
																}
															}
														}else{
															if(idx == 0 && info["CODE_ID"] == "RL0000"){
																return (
																	<MenuItem key={info["CODE_ID"]} value={info["CODE_ID"]}>
																		{info["CODE_NAME"]}
																	</MenuItem>
																);
															}else if(idx != 0){
																if(info["CODE_ID"] == "RL0000"){
																	
																}else{
																	return (
																		<MenuItem key={info["CODE_ID"]} value={info["CODE_ID"]}>
																			{info["CODE_NAME"]}
																		</MenuItem>
																	);
																}
															}
														}
													})}
												</TextField>
											</TableCell>
										}
										{ isWidthUp('md', props.width) && 
											<TableCell 
												align="left"
												key={"USE_LANG" + idx}>
												<TextField
													id="USE_LANG"
													name="USE_LANG"
													margin="dense"
													variant="outlined"
													error={validateMemCheck[idx]["USE_LANG"].error}
													helperText={validateMemCheck[idx]["USE_LANG"].helperText}
													value={memDataState[idx]["USE_LANG"]}
													onChange={(event) => {handleMemChange(event, idx)}}
													fullWidth
												>
												</TextField>
											</TableCell>
										}

										<TableCell 
											align="center"
											key={"BTN" + idx}>
											{ screenType == "new" &&
												<IconButton aria-label="remove" color="secondary" className={classes.margin} onClick={() => handleRemoveRow(idx)}>
													<CancelIcon fontSize="small" />
												</IconButton>
											}
											{ screenType == "modify" &&
												<IconButton aria-label="delete" className={classes.margin} onClick={() => handleRemoveMember(memDataState[idx]["MEMBER_NO"])}>
													<DeleteIcon fontSize="small" />
												</IconButton>
											}
											{ screenType == "modify" &&
												<IconButton aria-label="update" className={classes.margin} onClick={() => handleUpdateMember(memDataState[idx])}>
													<CreateIcon fontSize="small" />
												</IconButton>
											}
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</>
	);
}

export default withWidth()(ProjectInfoForm);