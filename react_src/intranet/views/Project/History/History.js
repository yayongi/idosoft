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



export default function HistoryView(props) {
	const classes = mainStyles();
	const [historyInfo, setHistoryInfo] = useState([]);
	const [memberlist, setMemberList] = useState([]);
	const [isShowLoadingBar, setShowLoadingBar] = useState(true, []);    //loading bar
	const userInfo = JSON.parse(sessionStorage.getItem("loginSession"));
	
	useEffect(() => {
		axios({
			url: '/intranet/allHistory',
			method: 'post',
			data: {}
		}).then(response => {
			var member_list = response.data.member_list;
			if(member_list.length > 0){
				setMemberList(member_list);
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
	}, []);


	return (
		<>
			<LoadingBar openLoading={isShowLoadingBar}/>
			<HistorySearchDiv username={userInfo["name"]} />
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
