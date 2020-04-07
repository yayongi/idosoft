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
	const userInfo = JSON.parse(sessionStorage.getItem("loginSession"));
	
	const selectedUserName = getSelectedUserName(searchData, memberList);
	
	useEffect(() => {
		var sendData = {"select_member": searchData};
		axios({
			url: '/intranet/allHistory',
			method: 'post',
			data: sendData
		}).then(response => {
			setMemberList(response.data.member_list);
			setHistoryInfo(response.data.history_list);
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	},[searchData]);
	
	
	const excelDownLoad = () => {
		const fileName = "HISTORY";
		const fileCode = "EXCEL0006";
		axios({
			url: '/intranet/downloadExcelFile',
			method: 'post',
			data : {
				fileCode : fileCode,
				fileName : fileName,
				searchData : {"select_member_no":searchData},
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
			<HistorySearchDiv username={userInfo["name"]} excelDownLoad={excelDownLoad} searchData={searchData} setSearchData={setSearchData} memberList={memberList}/>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Paper className={classes.paper}>
						<HistoryInfoTable historyOriginalInfo={ historyInfo } selectedUserName={selectedUserName} routeProps={props.routeProps}/>
					</Paper>
				</Grid>
			</Grid>
		</>
	);
}
