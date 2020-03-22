import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import HistoryInfoTable from './component/HistoryInfoTable'
import HistorySearchDiv from './component/HistorySearchDiv'

import { getHistoryInfoDB, getMemberInfoDB, getSiteInfoDB } from '../data';


function getHistoryData(){
	if(!localStorage.getItem("resHistData")){
		const sortedHistoryInfo = getHistoryInfoDB();
		sortedHistoryInfo.sort((a, b) => {
			return parseInt(b.inpt_bgnde) - parseInt(a.inpt_bgnde);
		});

		localStorage.setItem('resHistData', JSON.stringify(sortedHistoryInfo));
		return sortedHistoryInfo;
	}
	return JSON.parse(localStorage.getItem("resHistData"));
}



function makeHistoryInfo(){
	var historyInfo = getHistoryData();
	var memberInfo = getMemberInfoDB();
	
	var userInfo = "";
	if(historyInfo.length > 0){
		userInfo = memberInfo.filter((info) => {
			return info.member_id == historyInfo[0].member_no;
		});
	}
	if(userInfo.length > 0){
		var selectHistoryInfo = historyInfo.filter(info => {
			return info.member_no == userInfo[0]["member_id"];
		});
		for(var i=0; i < selectHistoryInfo.length; i++){
			selectHistoryInfo[i]["member_name"] = userInfo[0]["member_name"];
			selectHistoryInfo[i]["term"] = historyInfo[i]["inpt_bgnde"] + " ~ " + historyInfo[i]["inpt_endde"]; 
		}
	}

	return selectHistoryInfo;
}

function getUser_name(historyInfo){
	console.log(historyInfo);
	if(historyInfo.length > 0){
		return historyInfo[0]["member_name"];
	}
}

const mainStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function HistoryView(props) {
	console.log("HistoryView");
	const classes = mainStyles();
	const [historyOriginInfo, setHistoryOriginInfo ] = useState(makeHistoryInfo());
  	const [historyInfo, setHistoryInfo] = useState(historyOriginInfo);
	const username = getUser_name(historyInfo);

	const excelDownLoad = () => {
		alert("Excel Download");
	}
	return (
		<>
			<HistorySearchDiv username={username} excelDownLoad={excelDownLoad}/>
			<Grid container spacing={2}>
			<Grid item xs={12}>
				<Paper className={classes.paper}>
					<HistoryInfoTable historyInfo={ historyInfo } routeProps={props.routeProps}/>
				</Paper>
			</Grid>
			</Grid>
		</>
	);
}
