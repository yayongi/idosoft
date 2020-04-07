import React, {useState, useReducer, useCallback, useEffect} from 'react';
import { getProjectInfoDB, getMemberInfoDB, getSiteInfoDB } from '../data';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ProjectSearchDiv from './component/ProjectSearchDiv';
import ProjectInfoTable from './component/ProjectInfoTable';
import ProjectGraph from './component/ProjectGraph';
import Moment from "moment";
import { LoadingBar } from '../../../common/LoadingBar/LoadingBar';
import { processErrCode } from '../../../js/util';
import axios from 'axios';
import clsx from 'clsx';


const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	fixedHeight: {
		height: 240,
	}
}));

function currentCalcul(searchedInfo){
	if(searchedInfo.length == 0){
		return [];
	}
	
	var currentDate = Moment(new Date()).format('YYYYMMDD');
    var tmp = searchedInfo.filter((info) => {
    	if(info.BGNDE <= currentDate && currentDate <= info.ENDDE){
    		return info;
    	}
	});
    
    return tmp;
}

export default function ManageView(props) {
	const classes = useStyles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
	const [isShowLoadingBar, setShowLoadingBar] = useState(false);    //loading bar
	const [projectInfo, setProjectInfo] = useState([]);
	const [projectGraphInfo, setProjectGraphInfo] = useState([]);
	const [member_list, setMember_list] = useState([], []);
	const [instt_list, setInstt_list] = useState([], []);
	const [isAdmin, SetAdmin] = useState(false, []);
	
	
	const [condition, setCondition] = useState({
		searchType: "1",
		select_date: Moment(new Date()).format("YYYY-MM-DD"),
		select_detail : "",
	});
	
	useEffect(() => {
		getDBInfo({"searchType":"1", "select_detail":Moment(new Date()).format("YYYYMMDD")});
	}, []);
	
	const getDBInfo = (condition) => {
		axios({
			url: '/intranet/allProject',
			method: 'post',
			data: {"CODE_ID":"CD0008", "condition":condition}
		}).then(response => {
			setProjectInfo(response.data.hist_list);
			setProjectGraphInfo(response.data.graph_list);
			setMember_list(response.data.member_list);
			setInstt_list(response.data.instt_list);
			SetAdmin(response.data.isAdmin);
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	const updateCondition = (conditions) => {
		setCondition(conditions);
		getDBInfo(conditions);
	}
	
	return (
	<>
		<LoadingBar openLoading={isShowLoadingBar}/>
		<ProjectSearchDiv updateCondition={updateCondition} member_list={member_list} instt_list={instt_list}/>
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Paper className={fixedHeightPaper}>
					<ProjectGraph projectGraphInfo={projectGraphInfo}/>
				</Paper>
			</Grid>
			<Grid item xs={12}>
				<Paper className={classes.paper}>
					<ProjectInfoTable projectInfo={projectInfo} routeProps={props.routeProps}/>
				</Paper>
			</Grid>
		</Grid>
	</>
	);
}
