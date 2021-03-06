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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
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
		padding: '3px 3px',
		borderRadius: '4px',
		fontSize: '13px',
		border: '1px solid black',
		marginTop: theme.spacing(0),
	},
	trafficHead:{
		backgroundColor: '#fafafa',
	},
	pm_table:{
		backgroundColor: '#000000',
	}
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
	const [instt_list, setInstt] = React.useState([], []);					//발주처 정보 처음 진입할때 받아오면 새로 갱신할 필요가없음
	const [member_list, setMember] = React.useState([], [member_list]);		//정직원 리스트
	const [role_list, setRole] = React.useState([], []);					//역할정보 처음 진입할때 받아오면 새로 갱신할 필요가없음
	const [membertype_list, setMemberType] = React.useState([], []);		//정규직인지 프리랜서인지 외주인지 받아와야함
	const [updatedMemList, setUpdateMemList] = React.useState([], []);		//투입 인원 리스트
	const [renderWant, setRenderWant] = React.useState(true, [renderWant]);				//다시 렌더링을 원할때 setRenderWant로 렌더링 제어
	const [isRowAddClicked, setIsRowAddClicked] = React.useState(false);	//추가 버튼을 클릭 했는지 여부 (프로젝트 정보 수정 시 사용)
	const [pm_member_no, setPm_member_no] = React.useState("",[]);			//PM과 관리자만 투입인원 추가 삭제 수정이 가능함 + 수정은 자기 자신도
	const [isAdmin, setIsAdmin] = React.useState("",[]);			//PM과 관리자만 투입인원 추가 삭제 수정이 가능함 + 수정은 자기 자신도
	const [isTransShow, setIsTransShow] = React.useState([], [isTransShow]);	//몇번째 사원의 주유비 테이블을 보여줄지 판단하는 배열 [false, false, true] 이런식으로 들어감
																// true 인 경우 보여줌
	const [trafficList, setTrafficList] = React.useState([
		[{
			TRAFFIC_NO: "",
			MEMBER_NO: "",
			TRAFFIC_INPT_BGNDE:"",
			TRAFFIC_INPT_ENDDE:""
		}]
	]);		// 주유비 리스트  사원별 차량 운행 기간[[],[],[],[],[]]
	
	
	const [trafficOriginList, setTrafficOriginList] = React.useState([[]], []);
	
	const screenType = initCheck(match);									//신규 프로젝트 작성인지 프로젝트 수정인지 판단
	const userInfo = JSON.parse(sessionStorage.getItem("loginSession"))["member_NO"];
	
	
	//프로젝트 정보
	const [dataState, setDataState] = React.useState({
		PROJECT_NM : "",
		INSTT_CODE : "",
		BGNDE : Moment(new Date()).format('YYYY-MM-DD'),
		ENDDE : Moment(new Date()).format('YYYY-MM-DD'),
		TRANSPORT_CT : "",
		PM : "",
	}, [dataState]);	// state : 수정을 위한 데이터 관리
	
	
	// 투입 인원 변경할때 프로젝트 정보가 변경되면 안되기 때문
	const [cloneDataState, setCloneDataState] = React.useState([], []);
	//프로젝트 투입 인원 원 정보 - 수정 시 비교하기 위함
	const [memOriginDataState, setMemOriginDataState] = React.useState([{}], []);	// 수정 상태에서 ROW 삭제할 시 사용함
	
	//프로젝트 투입 인원 정보
	const [memDataState, setMemDataState] = React.useState([{
		MEMBER_NO : "",
		PROJECT_MEMBER_NO : "",
		MEMBER_NAME : "",
		MEMBER_TYPE : "EM0000",
		CHRG_JOB : "",
		INPT_BGNDE : dataState.BGNDE,
		INPT_ENDDE : dataState.ENDDE,
		ROLE_CODE : "RL0000",
		USE_LANG : "Java,Jsp,Javascript",
	}], [memDataState]);	// state : 수정을 위한 데이터 관리
	
	//프로젝트 정보 벨리데이션 체크용도
	const [validateCheck, setValidateCheck] = React.useState({
		PROJECT_NM:{error:false, helperText:""},
		INSTT_CODE:{error:false, helperText:""},
		BGNDE:{error:false, helperText:""},
		ENDDE:{error:false, helperText:""},
		TRANSPORT_CT:{error:false, helperText:""},
	}, [validateCheck]);		// 마지막에 [validateCheck] 추가됨
	//투입 인원 벨리데이션 정보 (배열로 되어 있으며, 투입 인원 수에 맞게 동적으로 생성해줘야함)
	const [validateMemCheck, setValidateMemCheck] = React.useState([{
		MEMBER_NO:{error:false, helperText:""},
		MEMBER_TYPE:{error:false, helperText:""},
		CHRG_JOB:{error:false, helperText:""},
		INPT_BGNDE:{error:false, helperText:""},
		INPT_ENDDE:{error:false, helperText:""},
		ROLE_CODE:{error:false, helperText:""},
		USE_LANG:{error:false, helperText:""},
	}], [validateMemCheck]);// 마지막에 [validateMemCheck] 추가됨
	
	//차량 운행 기간 벨리데이션 정보
	const [validateTraffic, setValidateTraffic] = React.useState([[{
		TRAFFIC_INPT_BGNDE:{error:false, helperText:""},
		TRAFFIC_INPT_ENDDE:{error:false, helperText:""},
	}]]); // 마지막에 [validateTraffic] 추가됨
	
	
	const validateTrafficDefault = (traffic_member_list) => {
		var tmp  = [];
		for(var i=0; i < traffic_member_list.length; i++){
			var list = [];
			for(var j=0; j < traffic_member_list[i].length; j++){
				var validateTraffic_defaultForm = {
					TRAFFIC_INPT_BGNDE:{error:false, helperText:""},
					TRAFFIC_INPT_ENDDE:{error:false, helperText:""},
				}
				list.push(validateTraffic_defaultForm);
			}
			tmp.push(list);
		}
		
		setValidateTraffic(tmp);
	}
	
	
	//사원별 오류 메시지 배열 (동적으로 생성하며, 사원 수와 동일하게 생성되어야한다.)
	const validateMemCheckDefault = (list_leng) => {
		var tmp = [];
		for(var i=0; i < list_leng; i++){
			var validateMemCheck_defaultForm = {
				MEMBER_NO:{error:false, helperText:""},
				MEMBER_TYPE:{error:false, helperText:""},
				MEMBER_NAME:{error:false, helperText:""},
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
	
	//사원별 주유비 테이블을 보여줄지 여부 배열
	const transShowDefault = (list_length) => {
		var tmp = [];
		for(var i=0; i < list_length; i++){
			tmp.push(false);
		}
		setIsTransShow(tmp);
	}
	
	
	//보여줄 레이블
	const columnsUp = [
		{ id: 'MEMBER_TYPE', label: '직원종류', minWidth: 100, align: 'center' },
		{ id: 'MEMBER_NO', label: '이름', minWidth: 100, align: 'center' },
		{ id: 'CHRG_JOB', label: '담당업무', minWidth: 100, align: 'center' },
		{ id: 'TERM', label: '프로젝트 기간', minWidth: 100, align: 'center' },
		{ id: 'ROLE', label: '역할', minWidth: 100, align: 'center' },
		{ id: 'USE_LANG', label: '비고', minWidth: 100, align: 'center' },
		{ id: 'BTN', label: screenType == "new" ? "행삭제" : '수정/삭제/주유비', minWidth: 100, align: 'center' },
	];
	const columnsDown = [
		{ id: 'MEMBER_TYPE', label: '직원종류', minWidth: 100, align: 'center' },
		{ id: 'MEMBER_NO', label: '이름', minWidth: 100, align: 'center' },
		{ id: 'CHRG_JOB', label: '담당업무', minWidth: 100, align: 'center' },
		{ id: 'BTN', label: screenType == "new" ? "행삭제" : '수정/삭제/주유비', minWidth: 100, align: 'center' },
	];
    let columns = columnsUp;
    if (isWidthUp('md', props.width)) {
      columns = columnsUp;
    } else {
      columns = columnsDown;
    }


	useEffect(() => {
		// 진입 경로가 신규 등록으로 들어왔는 지 프로젝트 수정으로 들어왔는지 여부에 따라
		// 신규로 들어온 경우 사원정보, 발주처 정보, 역할 정보를 받아옴(모든 프로젝트 공통)
		if(screenType == "new"){
			axios({
				url: '/intranet/projectInfo',
				method: 'post',
				data: {"CODE_ID": ["CD0008", "CD0009", "CD0011"]}
			}).then(response => {
				setInstt(response.data.code_list);
				setMember(response.data.member_list);
				setRole(response.data.role_list);
				setIsAdmin(response.data.isAdmin);
				setMemberType(response.data.member_type_list);
				setShowLoadingBar(false);
			}).catch(e => {
				setShowLoadingBar(false);
				processErrCode(e);
			});
		}
		//프로젝트 수정으로 들어온 경우
		else if(screenType == "modify"){
			console.log("modify");
			axios({
				url: '/intranet/projectDetailInfo',
				method: 'post',
				data: {"PROJECT_NO": match.params.id}
			}).then(response => {
				setInstt(response.data.code_list);
				setMember(response.data.member_list);
				setRole(response.data.role_list);
				setIsAdmin(response.data.isAdmin);
				setMemberType(response.data.member_type_list);
				
				var projectInfo = response.data.project_info;
				projectInfo["BGNDE"] = projectInfo["BGNDE"].slice(0,4) + "-" + projectInfo["BGNDE"].slice(4,6) + "-" + projectInfo["BGNDE"].slice(6,8);  
				projectInfo["ENDDE"] = projectInfo["ENDDE"].slice(0,4) + "-" + projectInfo["ENDDE"].slice(4,6) + "-" + projectInfo["ENDDE"].slice(6,8);  
				setDataState(projectInfo);
				setPm_member_no(response.data.project_info.PM);
				setCloneDataState(projectInfo);
				
				
				var proMemList = response.data.proMemList;
				if(response.data.proMemList.length > 0){
					
					//중간에 갱신 삭제 추가 등으로 들어온 경우 벨리데이션 배열을 다시 만들지 않는다.
					if(validateMemCheck.length == 1){
						//투입 인원 벨리데이션 체크 동적으로 생성
						validateMemCheckDefault(response.data.proMemList.length);
					}
					//주유비 보여줄 테이블도 동적으로 생성(최초 진입 시에만 초기화해준다.)
					if(isTransShow.length == 0){
						transShowDefault(response.data.proMemList.length);
					}
					for(var idx=0; idx < proMemList.length; idx++){
						
						proMemList[idx]["INPT_BGNDE"] = proMemList[idx]["INPT_BGNDE"].slice(0,4) + "-" + proMemList[idx]["INPT_BGNDE"].slice(4,6) + "-" + proMemList[idx]["INPT_BGNDE"].slice(6,8);
						proMemList[idx]["INPT_ENDDE"] = proMemList[idx]["INPT_ENDDE"].slice(0,4) + "-" + proMemList[idx]["INPT_ENDDE"].slice(4,6) + "-" + proMemList[idx]["INPT_ENDDE"].slice(6,8);
					}
					setMemDataState(proMemList);
					setMemOriginDataState(JSON.parse(JSON.stringify(proMemList)));
				}
				
				var trafficResultList = response.data.traffic_list;
				var trafficListTmp = [];
				for(var i=0; i < proMemList.length; i++){
					var tmp = [];
					tmp = trafficResultList.filter((info) => {
						return info.MEMBER_NO == proMemList[i]["MEMBER_NO"]
					});
				
					for(var j=0; j < tmp.length; j++){
						tmp[j]["TRAFFIC_INPT_BGNDE"] = Moment(tmp[j].INPT_BGNDE).format("YYYY-MM-DD");
						tmp[j]["TRAFFIC_INPT_ENDDE"] = Moment(tmp[j].INPT_ENDDE).format("YYYY-MM-DD");
					}
					
					trafficListTmp.push(tmp);
				}
				
				//DB에서 조회된 리스트 보다 화면에서 추가된 리스트가 있는 경우 default값으로 추가를 해줘야한다.
				/*if(trafficListTmp.length < memDataState.length){
					for(var j=0; j <  memDataState.length-trafficListTmp.length; j++){
						trafficListTmp.push([]);
					}
				}*/
				
				setTrafficList(trafficListTmp);
				validateTrafficDefault(trafficListTmp);
				
				//배열이라 값이 복사되서 for 문으로 다시 만들어서 넣어줌
				var tmplist = [];
				for(var i=0; i < trafficListTmp.length; i++){
					tmplist[i] = [].concat(trafficListTmp[i]);
				}
				setTrafficOriginList(tmplist);
				setShowLoadingBar(false);
			}).catch(e => {
				setShowLoadingBar(false);
				processErrCode(e);
			});
		}
	}, [renderWant]);
	
	const handleAddRow = () => {
		var member_defaultForm = {
			MEMBER_NO : "",
			PROJECT_MEMBER_NO : "",
			MEMBER_TYPE : "",
			MEMBER_NAME : "",
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
			MEMBER_TYPE:{error:false, helperText:""},
			MEMBER_NAME:{error:false, helperText:""},
			CHRG_JOB:{error:false, helperText:""},
			INPT_BGNDE:{error:false, helperText:""},
			INPT_ENDDE:{error:false, helperText:""},
			ROLE_CODE:{error:false, helperText:""},
			USE_LANG:{error:false, helperText:""},
		}
		validateMemCheck.push(validateMemCheck_defaultForm);
		setValidateMemCheck([...validateMemCheck]);
		setIsRowAddClicked(true);
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
		memDataState[idx][event.target.name] = event.target.value;
		setMemDataState([...memDataState]);
		
		//에러메시지 초기화
		validateMemCheckDefault(memDataState.length);
	}
	
	const handleMemTypeChange = (event, idx) => {
		if(screenType == "modify" && updatedMemList.indexOf(idx) < 0){
			updatedMemList.push(idx);
			setUpdateMemList(updatedMemList);
		}
		memDataState[idx][event.target.name] = event.target.value;
		setMemDataState([...memDataState]);
		
		//에러메시지 초기화
		validateMemCheckDefault(memDataState.length);
	}

	const handleChangeDate = (date, target, idx, trafficIdx) => {
		
		//개인별 차량 운행 기간
		if(target.includes("TRAFFIC_")){
			console.log("target include traffic_");
			trafficList[idx][trafficIdx][target] = Moment(date).format('YYYY-MM-DD'); 
			setTrafficList([...trafficList]);
			//초기화
			validateTrafficDefault(trafficList);
		}
		//개인별 투입 기간
		else if(target.includes("INPT_")){
			console.log("target include inpt_");
			if(screenType == "modify" && updatedMemList.indexOf(idx) < 0){
				updatedMemList.push(idx);
				setUpdateMemList(updatedMemList);
			}
			memDataState[idx][target] = Moment(date).format('YYYY-MM-DD'); 
			setMemDataState([...memDataState]);
			
			validateMemCheckDefault(memDataState.length);
		}
		
		//프로젝트 기간
		else{
			console.log("target not include inpt_");
			setDataState({
				...dataState,
				[target]: Moment(date).format('YYYY-MM-DD')
			});
			
			//신규일때만
			if(screenType == "new"){
				//프로젝트 기간이 변경되면 멤버들 프로젝트 기간도 동일하게 변경된다.
				var tmp = [].concat(memDataState);
				for(var i=0; i < memDataState.length; i++){
					tmp[i]["INPT_"+target] = Moment(date).format('YYYY-MM-DD')
				}
					
				setMemDataState(tmp);
			}
			//투입일 철수일이 수정되었을때 에러문구 초기화
			setValidateCheck({
				...validateCheck,
				[target]: {error:false, helperText:""}
			});
		}
	}
	
	
	//프로젝트 벨리데이션 체크
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
		
		if(dataState.TRANSPORT_CT > 1000000){
			prop_TRANSPORT_CT={error:true, helperText:"교통비을 확인해주세요"};
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
				MEMBER_TYPE:{error:false, helperText:""},
				MEMBER_NAME:{error:false, helperText:""},
				CHRG_JOB:{error:false, helperText:""},
				INPT_BGNDE:{error:false, helperText:""},
				INPT_ENDDE:{error:false, helperText:""},
				ROLE_CODE:{error:false, helperText:""},
				USE_LANG:{error:false, helperText:""},
			}
			//정규직인지, 프리랜서인지, 외주인지 구분
			if(memDataState[i]["MEMBER_TYPE"] == ""){
				validateMemCheck_defaultForm.MEMBER_TYPE = {error:true, helperText:"직원 구분을 선택해주세요"};
				isError = true;
			}
			
			//이름
			if(memDataState[i]["MEMBER_TYPE"] == "EM0000" && memDataState[i]["MEMBER_NO"] == ""){
				validateMemCheck_defaultForm.MEMBER_NO = {error:true, helperText:"사원을 선택해주세요"};
				isError = true;
			}
			
			//외주 프리랜서의 경우 이름을 입력 받아야한다.
			if(memDataState[i]["MEMBER_TYPE"] != "EM0000" && (memDataState[i]["MEMBER_NAME"] == "")){
				validateMemCheck_defaultForm.MEMBER_NAME = {error:true, helperText:"이름을 입력 해주세요"};
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
				validateMemCheck_defaultForm.CHRG_JOB = {error:true, helperText:"비고를 너무 길게 입력하셨습니다."};
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
	
	const isTrafficValidateCheck = (trafficData, memberData, memberIdx, trafficIdx) => {
		//초기화
		validateTrafficDefault(memDataState.length);
		// 사원의 투입 기간 정보 투입일 : memberData["INPT_BGNDE"] 철수일 : memberData["INPT_ENDDE"]
		//차량운행기간 추가할때 고려해야되는 부분
		//1. 프로젝트 기간 내의 기간인지 확인 필요(어차피 투입기간 넣을 때 체크할거라 프로젝트 내 투입 기간만 확인할것)
		//2. 차량 운행기간 시작일이 투입일보다 미래인지 확인
		//3. 이미 추가되어 있는 기간인지 확인 필요
		var isError = false;
		
		
		var validateTrafficTmp = [].concat(validateTraffic);
		//프로젝트 투입일과 비교
		if(Moment(memberData["INPT_BGNDE"]).format("YYYYMMDD") > trafficData["INPT_BGNDE"]){
			isError = true;
			validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_BGNDE"]["error"] = true;
			validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_BGNDE"]["helperText"] = "프로젝트 투입일을 확인해주세요";
		}
		//프로젝트 철수일과 비교
		if(Moment(memberData["INPT_ENDDE"]).format("YYYYMMDD") < trafficData["INPT_ENDDE"]){
			isError = true;
			validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_ENDDE"]["error"] = true;
			validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_ENDDE"]["helperText"] = "프로젝트 철수일을 확인해주세요";
		}
		//차량운행 기간을 비교
		if(trafficData["INPT_BGNDE"] > trafficData["INPT_ENDDE"]){
			isError = true;
			validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_BGNDE"]["error"] = true;
			validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_BGNDE"]["helperText"] = "차량운행 시작일을 확인해주세요";
			validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_ENDDE"]["error"] = true;
			validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_ENDDE"]["helperText"] = "차량운행 종료일을 확인해주세요";
		}
		
		//기존 등록된 운행기간이 있으면 기존 등록된 운행 기간과 비교
		var members_traffic_data = trafficList[memberIdx];
		if(members_traffic_data.length > 1){
			for(var i=0; i < members_traffic_data.length; i++){
				if(trafficIdx == i){
					continue;
				}
			
				var traffic_bgnde = members_traffic_data[i]["TRAFFIC_INPT_BGNDE"];
				var traffic_endde = members_traffic_data[i]["TRAFFIC_INPT_ENDDE"];
				
				var isbreak = false;
				if(trafficData["INPT_BGNDE"] >= Moment(traffic_bgnde).format("YYYYMMDD") && trafficData["INPT_BGNDE"] <=  Moment(traffic_endde).format("YYYYMMDD")){
					isbreak = true;
					validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_BGNDE"]["error"] = true;
					validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_BGNDE"]["helperText"] = "이미 등록된 기간에 해당합니다.";
				}
				
				if(trafficData["INPT_ENDDE"] <= Moment(traffic_bgnde).format("YYYYMMDD") && trafficData["INPT_ENDDE"] >= Moment(traffic_endde).format("YYYYMMDD")){
					isbreak = true;
					validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_ENDDE"]["error"] = true;
					validateTrafficTmp[memberIdx][trafficIdx]["TRAFFIC_INPT_ENDDE"]["helperText"] = "이미 등록된 기간에 해당합니다.";
				}
				
				if(isbreak){
					isError = true;
					break;
				}
			}
		}
		
		setValidateTraffic(validateTrafficTmp);
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
		//PM의 경우 경비 관련 로직이 깊숙하게 연관되어 있어 정직원에서만 뽑아야한다.
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
		
		if(isMemberValidateCheck()){
			return;
		}
		
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
		if(idx == 0){
			alert("PM은 삭제할 수 없습니다.");
			return;
		}else {
			if(screenType == "new"){
				alert("삭제했습니다.");
				memDataState.splice(idx, 1);
				setMemDataState([...memDataState]);
				setRenderWant(!renderWant);
			}else{
				alert("삭제했습니다.");
				memDataState.splice(idx, 1);
				setMemDataState([...memDataState]);
				setRenderWant(!renderWant);
			}
		}
	}

	const handleRemoveMember = (member_no, idx) => {
		if(idx == 0){
			alert("PM은 삭제가 불가능 합니다.");
			return;
		}
		
		//차량운행 기간이 존재하는지 여부를 가져온다.
		var hasTrafficList = typeof(trafficList[idx]) != "object" ? false : trafficList[idx].length > 0 ? true : false;
		var PROJECT_MEMBER_NO = memDataState[idx]["PROJECT_MEMBER_NO"];
		setShowLoadingBar(true);
		axios({
			url: '/intranet/removeMember',
			method: 'post',
			data: {"PROJECT_NO": match.params.id, "MEMBER_NO" : member_no, "PROJECT_MEMBER_NO" : PROJECT_MEMBER_NO,"hasTrafficList": hasTrafficList}
		}).then(response => {
			setShowLoadingBar(false);
			if(response.data.isDBError){
				alert("삭제 실패 했습니다.")
			}else{
				alert("삭제했습니다.");
				//setMemDataState([...list]);
				//setMemOriginDataState([...list]);
				setRenderWant(!renderWant);
			}
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	
	const handleUpdateMember = (selectMemberInfo, idx) => {
		//차량운행 기간을 넣고 있는 사원정보
		var isError = false;
		if(typeof(trafficList[idx]) == "object" && trafficList[idx].length > 0){
			for(var i=0; i < trafficList[idx].length; i++){
				if(isTrafficValidateCheck(trafficList[idx][i], selectMemberInfo, idx, i)){
					isError = true;
					break;
				}
			}
			if(isError){
				return;
			}
		}
		
		
		selectMemberInfo["INPT_BGNDE"] = selectMemberInfo["INPT_BGNDE"].replace("-", "").replace("-", "");
		selectMemberInfo["INPT_ENDDE"] = selectMemberInfo["INPT_ENDDE"].replace("-", "").replace("-", "");
		
		
		var sendData = JSON.parse(JSON.stringify(cloneDataState));
		sendData["BGNDE"] = sendData["BGNDE"].replace("-", "").replace("-", "");
		sendData["ENDDE"] = sendData["ENDDE"].replace("-", "").replace("-", "");
		
		var beforePM = "";
		if(idx == 0){
			beforePM = sendData["PM"];
			sendData["PM"] = selectMemberInfo.MEMBER_NO;
		}
		
		
		var PROJECT_MEMBER_NO = selectMemberInfo["PROJECT_MEMBER_NO"];
		
		setShowLoadingBar(true);
		axios({
			url: '/intranet/updateMember',
			method: 'post',
			data: {"PROJECT_NO": match.params.id, "memDataState" : selectMemberInfo, "isPM" : idx == 0, "sendData":sendData, "beforePM": beforePM, "PROJECT_MEMBER_NO" : PROJECT_MEMBER_NO}
		}).then(response => {
			setShowLoadingBar(false);
			if(response.data.isDBError){
				alert("갱신 실패 했습니다.")
			}else{
				setRenderWant(!renderWant);
				alert("갱신했습니다.");
			}
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	
	const handleAddMember = (member_no, idx) => {
		
		var isError = false;
		var errorList = [];
		var validateMemCheck_defaultForm = {
			MEMBER_NO:{error:false, helperText:""},
			MEMBER_TYPE:{error:false, helperText:""},
			MEMBER_NAME:{error:false, helperText:""},
			CHRG_JOB:{error:false, helperText:""},
			INPT_BGNDE:{error:false, helperText:""},
			INPT_ENDDE:{error:false, helperText:""},
			ROLE_CODE:{error:false, helperText:""},
			USE_LANG:{error:false, helperText:""},
		}
		//정직원인지, 프리랜서인지, 외주인지
		if(member_no["MEMBER_TYPE"] == ""){
			validateMemCheck_defaultForm.MEMBER_NO = {error:true, helperText:"직원 구분을 선택해주세요"};
			isError = true;
		}
		
		//이름
		if(member_no["MEMBER_TYPE"] == "EM0000" && member_no["MEMBER_NO"] == ""){
			validateMemCheck_defaultForm.MEMBER_NO = {error:true, helperText:"사원을 선택해주세요"};
			isError = true;
		}
		
		
		//정직원인지, 프리랜서인지, 외주인지
		if(member_no["MEMBER_TYPE"] != "EM0000" && member_no["MEMBER_NAME"] == ""){
			validateMemCheck_defaultForm.MEMBER_NO = {error:true, helperText:"직원 구분을 선택해주세요"};
			isError = true;
		}
		
		//담당업무	
		if(member_no["CHRG_JOB"] == ""){
			validateMemCheck_defaultForm.CHRG_JOB = {error:true, helperText:"역할을 입력해주세요"};
			isError = true;
		}
		
		else if(member_no["CHRG_JOB"].length > 30){
			validateMemCheck_defaultForm.CHRG_JOB = {error:true, helperText:"역할을 너무 길게 입력하셨습니다."};
			isError = true;
		}
		
		//프로젝트 기간
		var INPT_BGNDE = member_no["INPT_BGNDE"].replace("-", "").replace("-", "");
		var INPT_ENDDE = member_no["INPT_ENDDE"].replace("-", "").replace("-", "");
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
		if(member_no["ROLE_CODE"] == ""){
			validateMemCheck_defaultForm.ROLE_CODE = {error:true, helperText:"역할을 선택해주세요"};
			isError = true;
		}
		//비고
		if(member_no["USE_LANG"] == "" ){
			validateMemCheck_defaultForm.USE_LANG = {error:true, helperText:"비고를 입력해주세요"};
			isError = true;
		}
		else if(member_no["USE_LANG"].length > 30){
			validateMemCheck_defaultForm.CHRG_JOB = {error:true, helperText:"비고를 너무 길게 입력하셨습니다."};
			isError = true;
		}
		
		if(isError){
			validateMemCheck[idx] = validateMemCheck_defaultForm;
			setValidateMemCheck([...validateMemCheck]);
			return;
		}
		
		console.log(member_no);
		var sendData = JSON.parse(JSON.stringify(member_no));
		setShowLoadingBar(true);
		sendData["PROJECT_NO"] = match.params.id;
		sendData["INPT_BGNDE"] = Moment(sendData["INPT_BGNDE"]).format("YYYYMMDD");
		sendData["INPT_ENDDE"] = Moment(sendData["INPT_ENDDE"]).format("YYYYMMDD");
		axios({
			url: '/intranet/addMember',
			method: 'post',
			data: sendData
		}).then(response => {
			setShowLoadingBar(false);
			if(response.data.isDBError){
				alert("추가 실패 했습니다.")
			}else{
				setRenderWant(!renderWant);
				alert("추가 했습니다.");
			}
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	
	const handleClickCancle = () => {
		history.goBack();
	};
	
	//차량 운행 기간 영역 보기
	const handleRowClick = (index) => {
		//영역 보여주기
		var tmp = [].concat(isTransShow);
		tmp[index] = !tmp[index];
		setIsTransShow([...tmp]);
	}
	
	const handleAddTraffic = (index) => {
		var tmpList = [].concat(trafficList);
		var selectList = tmpList[index];
		
		if(typeof(selectList) == "object" && selectList.length > 0){
			selectList.push({
				"MEMBER_NO": memDataState[index]["MEMBER_NO"], 
				"TRAFFIC_INPT_BGNDE": Moment(Moment(selectList[selectList.length-1]["TRAFFIC_INPT_ENDDE"]).add(1, 'days')).format("YYYY-MM-DD"), 
				"TRAFFIC_INPT_ENDDE": Moment(memDataState[index]["INPT_ENDDE"]).format("YYYY-MM-DD")
			});
		}else{
			selectList.push({"MEMBER_NO": memDataState[index]["MEMBER_NO"], "TRAFFIC_INPT_BGNDE": Moment(memDataState[index]["INPT_BGNDE"]).format("YYYY-MM-DD"), "TRAFFIC_INPT_ENDDE": Moment(memDataState[index]["INPT_ENDDE"]).format("YYYY-MM-DD")});
		}
		
		tmpList[index] = selectList;
		validateTrafficDefault(tmpList);
		setTrafficList([...tmpList]);
		
	}
	
	const handleRemoveRowTraffic = (memberIdx, trafficIdx) => {
		var tmpList = [].concat(trafficList);
		tmpList[memberIdx].splice(trafficIdx, 1);
		setTrafficList([...tmpList]);
	}
	
	
	const handleRemoveTraffic = (memberIdx, trafficIdx) => {
		var tmpList = [].concat(trafficList);
		var deleteInfo = tmpList[memberIdx][trafficIdx];
		setShowLoadingBar(true);
		axios({
			url: '/intranet/removeTraffic',
			method: 'post',
			data: deleteInfo
		}).then(response => {
			setShowLoadingBar(false);
			alert("삭제했습니다.");
			tmpList[memberIdx].splice(trafficIdx, 1);
			setTrafficList([...tmpList]);
			setRenderWant(!renderWant);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	
	const handleRegisteTraffic = (memberIdx, trafficIdx) => {
		
		//차량 운행 기간에 넣은 데이터
		var sendData = trafficList[memberIdx][trafficIdx];
		sendData["INPT_BGNDE"] = sendData["TRAFFIC_INPT_BGNDE"].replace("-", "").replace("-", "");
		sendData["INPT_ENDDE"] = sendData["TRAFFIC_INPT_ENDDE"].replace("-", "").replace("-", "");
		sendData["PROJECT_NO"] = match.params.id;
		
		//차량운행 기간을 넣고 있는 사원정보
		var memberData = memDataState[memberIdx];
		if(isTrafficValidateCheck(sendData, memberData, memberIdx, trafficIdx)){
			return;
		}
		
		setShowLoadingBar(true);
		axios({
			url: '/intranet/registTraffic',
			method: 'post',
			data: sendData
		}).then(response => {
			setShowLoadingBar(false);
			alert("등록했습니다.");
			setRenderWant(!renderWant);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	
	const handleUpdateTraffic = (memberIdx, trafficIdx) => {
		//차량 운행 기간에 넣은 데이터
		var sendData = trafficList[memberIdx][trafficIdx];
		sendData["INPT_BGNDE"] = sendData["TRAFFIC_INPT_BGNDE"].replace("-", "").replace("-", "");
		sendData["INPT_ENDDE"] = sendData["TRAFFIC_INPT_ENDDE"].replace("-", "").replace("-", "");
		sendData["PROJECT_NO"] = match.params.id;
		
		//차량운행 기간을 넣고 있는 사원정보
		var memberData = memDataState[memberIdx];
		
		if(isTrafficValidateCheck(sendData, memberData, memberIdx, trafficIdx)){
			return;
		}
		
		setShowLoadingBar(true);
		axios({
			url: '/intranet/updateTraffic',
			method: 'post',
			data: sendData
		}).then(response => {
			setShowLoadingBar(false);
			alert("갱신했습니다.");
			setRenderWant(!renderWant);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	
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
									{	
										isWidthUp('md', props.width) && 
										<Toolbar>
											<Typography className={classes.title} color="inherit" variant="h6">
												{screenType == "new" ? "프로젝트 등록" : "프로젝트 수정"}
											</Typography>
											<div>
												<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickCancle}>
													목록
												</Button>
	
												{
													screenType == "new" && (isAdmin || pm_member_no == userInfo) &&
													<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickAddProject}>
														등록
													</Button>
												}
												{
													screenType == "modify" && (isAdmin || pm_member_no == userInfo) &&
													<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickModifyProject}>
														수정
													</Button>
												}
												{
													screenType == "modify" && (isAdmin || pm_member_no == userInfo) &&
													<Button variant="contained" color="secondary" size="small" className={classes.button} onClick={handleClickRemoveProject}>
														삭제
													</Button>
												}
											</div>
										</Toolbar>
									}
									{	
										!isWidthUp('md', props.width) && 
										<>
											<Typography className={classes.title} color="inherit" variant="h6">
												{screenType == "new" ? "프로젝트 등록" : "프로젝트 수정"}
											</Typography>
											<div>
												<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickCancle}>
													목록
												</Button>
	
												{
													screenType == "new" && (isAdmin || pm_member_no == userInfo) &&
													<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickAddProject}>
														등록
													</Button>
												}
												{
													screenType == "modify" && (isAdmin || pm_member_no == userInfo) &&
													<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickModifyProject}>
														수정
													</Button>
												}
												{
													screenType == "modify" && (isAdmin || pm_member_no == userInfo) &&
													<Button variant="contained" color="secondary" size="small" className={classes.button} onClick={handleClickRemoveProject}>
														삭제
													</Button>
												}
											</div>
										</>
									}
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
								<TableCell align="left" colSpan="7">
									<Toolbar>
										<Typography className={classes.title} color="inherit" variant="h6">
											투입인원
										</Typography>
										<div>
											{/* 관리자 혹은 PM만 투입 인원 수정 삭제가 가능함*/}
											{	(isAdmin || pm_member_no == userInfo) &&
												<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleAddRow}>
												추가
												</Button>
											}
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
									<>
										<TableRow
											key={"row"+idx}
											style={{ backgroundColor: idx==0 ? '#ffd4fb' : ''}}>
											<TableCell 
												align="left"
												key={"MEMBER_TYPE" + idx}>
												<TextField
													id="MEMBER_TYPE"
													name="MEMBER_TYPE"
													margin="dense"
													variant="outlined"
													value={memDataState[idx]["MEMBER_TYPE"]}
													onChange={(event) => {handleMemTypeChange(event, idx)}}
													error={validateMemCheck[idx]["MEMBER_TYPE"].error}
													helperText={validateMemCheck[idx]["MEMBER_TYPE"].helperText}
													fullWidth
													select
												>
												{
													membertype_list.map(info => {
														if(idx == 0){
															if(info.CODE_ID == "EM0000"){
																return (
																	<MenuItem key={info.CODE_ID} value={info.CODE_ID}>
																		{info.CODE_NAME}
																	</MenuItem>
																)
															}
														}else{
															if(screenType == "modify"){
																if(idx < memOriginDataState.length){
																	if(memDataState[idx]["MEMBER_TYPE"] == "EM0000"){
																		if(info.CODE_ID == "EM0000"){
																			return (
																				<MenuItem key={info.CODE_ID} value={info.CODE_ID}>
																					{info.CODE_NAME}
																				</MenuItem>
																			)
																		}
																	}else{
																		if(info.CODE_ID != "EM0000"){
																			return (
																				<MenuItem key={info.CODE_ID} value={info.CODE_ID}>
																					{info.CODE_NAME}
																				</MenuItem>
																			)
																		}
																	}
																}else{
																	return (
																		<MenuItem key={info.CODE_ID} value={info.CODE_ID}>
																			{info.CODE_NAME}
																		</MenuItem>
																	)
																}
															}else{
																return (
																	<MenuItem key={info.CODE_ID} value={info.CODE_ID}>
																		{info.CODE_NAME}
																	</MenuItem>
																)
															}
														}
													})
												}
												</TextField>
											</TableCell>
											{
												memDataState[idx]["MEMBER_TYPE"] == "EM0000" && 
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
														fullWidth
														select
													>
													{member_list.map(info => {
														//PM 인 경우 수정 가능하도록 변경
														if (idx == 0){
															return (
																<MenuItem key={info.member_no} value={info.member_no}>
																	{info.name}
																</MenuItem>
															)
														}
														//기존의 투입된 인원은 투입된 인원을 보여줘야하고 새롭게 투입인원을 추가할때는 기존에 없는 사람으로 보여줘야함
														else if(memOriginDataState.length > idx){
															if(memDataState[idx]["MEMBER_NO"] == info.member_no || !memDataState[idx]["MEMBER_NO"]){
																return (
																	<MenuItem key={info.member_no} value={info.member_no}>
																		{info.name}
																	</MenuItem>
																)
															}
														}else{
															if(memOriginDataState.findIndex((item) => item["MEMBER_NO"] == info.member_no) == -1){
																return (
																	<MenuItem key={info.member_no} value={info.member_no}>
																		{info.name}
																	</MenuItem>
																)
															}
														}
													})}
													</TextField>
												</TableCell>
											}
											{
												memDataState[idx]["MEMBER_TYPE"] != "EM0000" && 
												<TableCell 
													align="left"
													key={"MEMBER_NAME" + idx}>
													<TextField
														id="MEMBER_NAME"
														name="MEMBER_NAME"
														margin="dense"
														variant="outlined"
														autoComplete="off"
														error={validateMemCheck[idx]["MEMBER_NAME"].error}
														helperText={validateMemCheck[idx]["MEMBER_NAME"].helperText}
														value={memDataState[idx]["MEMBER_NAME"]}
														onChange={(event) => {handleMemChange(event, idx)}}
														fullWidth
													>
													</TextField>
												</TableCell>
											}
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
												key={"BTN" + idx}
												rowSpan={isWidthUp('md', props.width) ? "1" : "2"}>
												{ 	((isAdmin || pm_member_no == userInfo) &&
													(screenType == "new" || (screenType == "modify" && memOriginDataState.length <= idx))) &&
													<IconButton aria-label="remove" color="secondary" className={classes.margin} onClick={() => handleRemoveRow(idx)}>
														<CancelIcon fontSize="small" />
													</IconButton>
												}
												{ 	((isAdmin || pm_member_no == userInfo) &&
													((screenType == "modify" && memOriginDataState.length <= idx))) &&
													<IconButton aria-label="add" color="secondary" className={classes.margin} onClick={() => handleAddMember(memDataState[idx], idx)}>
														<CheckCircleIcon fontSize="small" color="primary"/>
													</IconButton>
												}
												{ 	((isAdmin || pm_member_no == userInfo) &&
													screenType == "modify" && memOriginDataState.length > idx) && 
													<IconButton aria-label="delete" className={classes.margin} onClick={() => handleRemoveMember(memDataState[idx]["MEMBER_NO"], idx)}>
														<DeleteIcon fontSize="small" />
													</IconButton>
												}
												{ 	((isAdmin || pm_member_no == userInfo || userInfo == memDataState[idx]["MEMBER_NO"]) &&
													screenType == "modify" && memOriginDataState.length > idx) && 
													<IconButton aria-label="update" className={classes.margin} onClick={() => handleUpdateMember(memDataState[idx], idx)}>
														<CreateIcon fontSize="small" />
													</IconButton>
												}
												{ 	
													memDataState[idx]["MEMBER_TYPE"] == "EM0000" && 
													((isAdmin || userInfo == memDataState[idx]["MEMBER_NO"]) &&
													screenType == "modify" && memOriginDataState.length > idx) && 
													<IconButton aria-label="update" className={classes.margin} onClick={() => handleRowClick(idx)}>
														<ArrowDropDownIcon fontSize="small" />
													</IconButton>
												}
											</TableCell>
										</TableRow>
										{ !isWidthUp('md', props.width) &&
											<TableRow
											style={{ backgroundColor: idx==0 ? '#ffd4fb' : ''}}>
												<TableCell 
													align="left"
													key={"INPT_DATE" + idx}
													colSpan="3">
													투입 기간
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
											</TableRow>
										}
										{
											isTransShow[idx] &&
											<TableRow className={classes.trafficHead}>
												<TableCell  key={"extendsHeader_title"+idx} colSpan={isWidthUp('md', props.width) ? "6" : "3"}>
													차량 운행 기간
												</TableCell>
												<TableCell key={"extendsHeader_"+idx} align="center">
													<IconButton aria-label="update" className={classes.margin} onClick={() => handleAddTraffic(idx)}>
														<ControlPointIcon fontSize="small" />
													</IconButton>
												</TableCell>
											</TableRow>
										}	
										{	isTransShow[idx] && typeof(trafficList[idx]) == "object" && trafficList[idx].length > 0 &&
											trafficList[idx].map((info, trafficIdx) => {
												return(
													<>
														<TableRow className={classes.trafficHead}>
															<TableCell  key={"TRAFFIC_INPT"+idx} colSpan={isWidthUp('md', props.width) ? "6" : "3"}>
																<Toolbar>
																	<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
																		<Grid container justify="space-around">
																			<DatePicker
																				locale='ko'
																				margin="dense"
																				id="TRAFFIC_INPT_BGNDE"
																				name="TRAFFIC_INPT_BGNDE"
																				minDate={memDataState[idx]["INPT_BGNDE"]}
																				value={trafficList[idx][trafficIdx]["TRAFFIC_INPT_BGNDE"]}
																				views={["year", "month", "date"]}
																				error={validateTraffic[idx][trafficIdx]["TRAFFIC_INPT_BGNDE"].error}
																				helperText={validateTraffic[idx][trafficIdx]["TRAFFIC_INPT_BGNDE"].helperText}
																				onChange={(data) => handleChangeDate(data, "TRAFFIC_INPT_BGNDE", idx, trafficIdx)}
																				format="yyyy-MM-dd"
																				inputVariant="outlined"
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
																				id="TRAFFIC_INPT_ENDDE"
																				name="TRAFFIC_INPT_ENDDE"
																				maxDate={memDataState[idx]["INPT_ENDDE"]}
																				value={trafficList[idx][trafficIdx]["TRAFFIC_INPT_ENDDE"]}
																				views={["year", "month", "date"]}
																				error={validateTraffic[idx][trafficIdx]["TRAFFIC_INPT_ENDDE"].error}
																				helperText={validateTraffic[idx][trafficIdx]["TRAFFIC_INPT_ENDDE"].helperText}
																				onChange={(data) => handleChangeDate(data, "TRAFFIC_INPT_ENDDE", idx, trafficIdx)}
																				format="yyyy-MM-dd"
																				inputVariant="outlined"
																				fullWidth
																			/>
																		</Grid>
																	</MuiPickersUtilsProvider>
																</Toolbar>
															</TableCell>
															<TableCell key={"TRAFFIC_BTN"+idx}>
																
																{	(isAdmin || pm_member_no == userInfo || userInfo == memDataState[idx]["MEMBER_NO"]) &&
																	(typeof(trafficOriginList[idx][trafficIdx]) != "object") && 
																	<IconButton aria-label="removeTraffic" className={classes.margin} onClick={() => handleRemoveRowTraffic(idx, trafficIdx)}>
																		<CancelIcon fontSize="small"  color="secondary"/>
																	</IconButton>
																}
																{	(isAdmin || pm_member_no == userInfo || userInfo == memDataState[idx]["MEMBER_NO"]) &&
																	(typeof(trafficOriginList[idx][trafficIdx]) != "object") && 
																	<IconButton aria-label="amount_save" className={classes.margin} onClick={() => handleRegisteTraffic(idx, trafficIdx)}>
																		<SaveAltIcon fontSize="small"  color="primary"/>
																	</IconButton>
																}
																{ 	(isAdmin || pm_member_no == userInfo || userInfo == memDataState[idx]["MEMBER_NO"]) &&
																	(typeof(trafficOriginList[idx][trafficIdx]) == "object") && 
																	<IconButton aria-label="delete" className={classes.margin} onClick={() => handleRemoveTraffic(idx, trafficIdx)}>
																		<DeleteIcon fontSize="small" />
																	</IconButton>
																}
																{ 	(isAdmin || pm_member_no == userInfo || userInfo == memDataState[idx]["MEMBER_NO"]) &&
																	(typeof(trafficOriginList[idx][trafficIdx]) == "object") &&
																	<IconButton aria-label="update" className={classes.margin}>
																		<CreateIcon fontSize="small" onClick={() => handleUpdateTraffic(idx, trafficIdx)}/>
																	</IconButton>
																}	
															</TableCell>
														</TableRow>
													</>
												)
											})
										}
									</>
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