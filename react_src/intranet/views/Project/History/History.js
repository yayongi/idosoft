import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import HistoryInfoTable from './component/HistoryInfoTable'
import HistorySearchDiv from './component/HistorySearchDiv'
import { LoadingBar } from '../../../common/LoadingBar/LoadingBar';
import axios from 'axios';

const mainStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));



function initCheck(match){
	return typeof(match.params.member_no) == "undefined" ? "" : match.params.member_no;
}
export default function HistoryView(props) {
	const classes = mainStyles();
	
	const { match, location, history } = props.routeProps;
	const [historyInfo, setHistoryInfo] = useState([]);
	const [memberlist, setMemberList] = useState([]);
	const [searchData, setSearchData] = useState("", []);
	const [isShowLoadingBar, setShowLoadingBar] = useState(true, []);    //loading bar
	const userInfo = JSON.parse(sessionStorage.getItem("loginSession"));
	
	useEffect(() => {
		var select_member_no = initCheck(match);
		
		if(searchData != "") {
			if(searchData != -1){
				select_member_no = searchData;
			}else{
				select_member_no = "";
			}
		}
		
		var sendData = {"select_member": select_member_no};
		axios({
			url: '/intranet/allHistory',
			method: 'post',
			data: sendData
		}).then(response => {
			var member_list = response.data.member_list;
			if(member_list.length > 0){
				setMemberList([...member_list]);
			}else{
				var list = [];
				list.push({"MEMBER_NO" : userInfo["member_NO"], "MEMBER_NAME":userInfo["name"]})
				setMemberList([...list]);
			}
			setHistoryInfo(response.data.history_list);
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}, [searchData]);
	
	
	const excelDownLoad = () => {
		
		var select_member_no = initCheck(match);
		
		if(searchData != "") {
			if(searchData != -1){
				select_member_no = searchData;
			}else{
				select_member_no = "";
			}
		}
		
		const fileName = "HISTORY";
		const fileCode = "EXCEL0006";
		
		axios({
			url: '/intranet/downloadExcelFile',
			method: 'post',
			data : {
				fileCode : fileCode,
				fileName : fileName,
				searchData : {"select_member_no":select_member_no},
			},
			responseType: 'blob',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(response => {

			console.log(JSON.stringify(response));

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
			<HistorySearchDiv username={userInfo["name"]} excelDownLoad={excelDownLoad} setSearchData={setSearchData} memberlist={memberlist}/>
			<Grid container spacing={2}>
			<Grid item xs={12}>
				<Paper className={classes.paper}>
					<HistoryInfoTable historyOriginalInfo={ historyInfo } memberlist={ memberlist } routeProps={props.routeProps}/>
				</Paper>
			</Grid>
			</Grid>
		</>
	);
}
