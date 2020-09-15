import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import HistoryInfoTable from './component/HistoryInfoTable'
import HistorySearchDiv from './component/HistorySearchDiv'
import { LoadingBar } from '../../../common/LoadingBar/LoadingBar';
import { processErrCode } from '../../../js/util';
import axios from 'axios';

const mainStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


//최초 진입 시 선택해서 들어온 사람인지, 아님 그냥 이력관리에 들어온건지 판단
function initCheck(match){
	var tmp = typeof(match.params.member_no) == "undefined" ? "" : match.params.member_no;
	if(!tmp){
		tmp = JSON.parse(sessionStorage.getItem("loginSession"))["member_NO"];
	}
	return tmp;
}


function getSelectedUserName(selectedUserMemberNo, memberList){
	if(selectedUserMemberNo && selectedUserMemberNo != ""){
		var tmp = memberList.filter((info) => info.member_no == selectedUserMemberNo);
		if(tmp && tmp.length > 0){
			return tmp[0];
		}
		return {};
	}
	return {};
}
export default function HistoryView(props) {
	const classes = mainStyles();
	
	const { match, location, history } = props.routeProps;
	const [historyInfo, setHistoryInfo] = useState([]);
	const [searchData, setSearchData] = useState(initCheck(match));
	const [isShowLoadingBar, setShowLoadingBar] = useState(true, []);    //loading bar
	const [memberList, setMemberList] = useState([]);
	const [isAdmin, SetIsAdmin] = useState(false);
	const userInfo = JSON.parse(sessionStorage.getItem("loginSession"));
	
	const selectedUserName = getSelectedUserName(searchData, memberList);
	
	useEffect(() => {
		var sendData = {"select_member": searchData};
		axios({
			url: '/intranet/allHistory',
			method: 'post',
			data: sendData
		}).then(response => {
			setHistoryInfo(response.data.history_list);
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	},[searchData]);

	//직원명단 가져오기
	useEffect(() => {
		axios({
			url: '/intranet/history/memberList',
			method: 'post'
		}).then(response => {
			setMemberList(response.data);
		}).catch(e => {
			processErrCode(e);
		});
	},[]);

	//관리자 여부
	useEffect(() => {
		axios({
			url: '/intranet/history/isAdmin',
			method: 'post',
			data : {},
		}).then(response => {
			if(response.data.isAdmin == "1"){
				SetIsAdmin(true);
			}else{
				SetIsAdmin(false);
			}
		}).catch(e => {
			processErrCode(e);
		});
	}, []);
	
	
	const excelDownLoad = () => {
		if(typeof(historyInfo) == "object" && historyInfo.length < 1){
			alert("검색 결과가 없습니다.");
			return;
		}
		const fileName = "HISTORY";
		const fileCode = "EXCEL0006";
		axios({
			url: '/intranet/downloadExcelFile',
			method: 'post',
			data : {
				fileCode : fileCode,
				fileName : fileName,
				searchData : selectedUserName,
			},
			responseType: 'blob',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(response => {
			const fileName = response.headers.filename;
			const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', fileName);
			document.body.appendChild(link);
			link.click();
		}).catch(e => {
			console.log(e);
		});
	}

	return (
		<>
			<LoadingBar openLoading={isShowLoadingBar}/>
			<HistorySearchDiv username={userInfo["name"]} excelDownLoad={excelDownLoad} searchData={searchData} setSearchData={setSearchData} memberList={memberList} isAdmin={isAdmin}/>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Paper className={classes.paper}>
						<HistoryInfoTable historyOriginalInfo={ historyInfo } selectedUserName={selectedUserName} routeProps={props.routeProps} isAdmin={isAdmin}/>
					</Paper>
				</Grid>
			</Grid>
		</>
	);
}
