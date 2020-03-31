import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import HistoryInfoTable from './component/HistoryInfoTable'
import HistorySearchDiv from './component/HistorySearchDiv'
import { LoadingBar } from '../../Admin/component/utils';

import axios from 'axios';

const mainStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function getUserInfo(){
	return JSON.parse(sessionStorage.getItem("loginSession"));
}

export default function HistoryView(props) {
	console.log("HistoryView");
	const classes = mainStyles();
	const [historyOriginInfo, setHistoryOriginInfo ] = useState([]);
	const [memberlist, setMemberList] = useState([]);
	const [historyInfo, setHistoryInfo] = useState([]);
	const [isShowLoadingBar, setShowLoadingBar] = useState(true, []);    //loading bar
	const userInfo = getUserInfo();

	useEffect(() => {
		axios({
			url: '/intranet/allHistory',
			method: 'post',
			data: {}
		}).then(response => {
			setHistoryInfo(response.data.history_list);
			setHistoryOriginInfo(response.data.history_list);
			setMemberList(response.data.member_list);
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
		});
	}, []);


	return (
		<>
			<LoadingBar openLoading={isShowLoadingBar}/>
			<HistorySearchDiv username={userInfo["name"]} />
			<Grid container spacing={2}>
			<Grid item xs={12}>
				<Paper className={classes.paper}>
					<HistoryInfoTable historyInfo={ historyInfo } memberlist={memberlist} routeProps={props.routeProps}/>
				</Paper>
			</Grid>
			</Grid>
		</>
	);
}
