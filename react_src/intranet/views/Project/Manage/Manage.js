import React, {useState, useReducer, useCallback, useEffect} from 'react';
import { getProjectInfoDB, getMemberInfoDB, getSiteInfoDB } from '../data';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ProjectSearchDiv from './component/ProjectSearchDiv';
import ProjectInfoTable from './component/ProjectInfoTable';
import ProjectGraph from './component/ProjectGraph';
import { LoadingBar } from '../../../common/LoadingBar/LoadingBar';

import axios from 'axios';

const mainStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    overflowX: 'scroll'
  },
  paper2: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height:350,
    overflowY: 'scroll'
  }
}));

export default function ManageView(props) {
  console.log("ManageView");
  console.log(props);
  const classes = mainStyles();
  const [isShowLoadingBar, setShowLoadingBar] = useState(true, []);    //loading bar
  const [projectOriginInfo, setProjectOriginInfo] = useState([], []);
  const [projectInfo, setProjectInfo] = useState([]);
  const [condition, setCondition] = useState({
    searchType: 		[],
    searchDetailType:  "",
    searchDetailTypes: []
  });

  useEffect(() => {
    axios({
      url: '/intranet/allProject',
      method: 'post',
      data: {}
    }).then(response => {
      var result = response.data.project_list;
      console.log("result : ");
      console.log(result);
      setProjectOriginInfo(result);
      setProjectInfo(result);
      setShowLoadingBar(false);
    }).catch(e => {
      setShowLoadingBar(false);
      processErrCode(e);
    });
  }, []);


  const updateCondition = (conditions) => {
    console.log("updateCondition");
    console.log(conditions);
    
    setCondition(conditions);

    var searchedInfo = [];
    switch(conditions.searchType){
      case "0":
        searchedInfo = projectOriginInfo;
        break;
      case "1":
        searchedInfo = projectOriginInfo.filter((info) => info.BGNDE.slice(0,4) === conditions.searchDetailType);
        break;
      case "2":
        searchedInfo = projectOriginInfo.filter((info) => info.INSTT_CODE === conditions.searchDetailType);
        break;
      default:
        searchedInfo = projectOriginInfo;
        break;
      
    }
    setProjectInfo(searchedInfo);
  }

  return (
    <>
      <LoadingBar openLoading={isShowLoadingBar}/>
      <ProjectSearchDiv  condition={condition} updateCondition={updateCondition}/>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {/* <ProjectGraph projectInfo={projectInfo} /> */}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper2}>
            <ProjectInfoTable projectInfo={projectInfo} routeProps={props.routeProps}/>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
