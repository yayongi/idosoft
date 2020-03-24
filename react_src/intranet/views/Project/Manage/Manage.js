import React, {useState, useReducer, useCallback, useEffect} from 'react';
import { getProjectInfoDB, getMemberInfoDB, getSiteInfoDB } from '../data';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ProjectSearchDiv from './component/ProjectSearchDiv';
import ProjectInfoTable from './component/ProjectInfoTable';
import ProjectGraph from './component/ProjectGraph';

/*
    개발 소스 db 연결 시 변경 및 수정 필요
*/
  function getProjectData(){
    if(!localStorage.getItem("resProjData")){
      const sortedProjInfo = getProjectInfoDB();
      sortedProjInfo.sort((a, b) => {
        return parseInt(b.bgnde) - parseInt(a.bgnde);
    });

    localStorage.setItem('resProjData', JSON.stringify(sortedProjInfo));
      return sortedProjInfo;
    }
    return JSON.parse(localStorage.getItem("resProjData"));
  }

  function makeProjectInfo(){
    var mainProjectInfo = getProjectData();
    var memberInfo = getMemberInfoDB();
    var siteInfo = getSiteInfoDB();
    var projectInfo = [];

    for(var i=0; i < mainProjectInfo.length; i++){
      var tempJSON = mainProjectInfo[i];
      var instt_code = mainProjectInfo[i]["instt_code"];
      var member_id  = mainProjectInfo[i]["pm"];
      var site_name = siteInfo.filter((info) => {
        return info.instt_code == instt_code;
      });

      if(site_name.length > 0){
        site_name = site_name[0]["instt_name"];
      }

      var pm_name = memberInfo.filter((info) => {
        return info.member_id == member_id;
      });

      if(pm_name.length > 0){
        pm_name = pm_name[0]["member_name"];
      }


      tempJSON["instt_name"]  = site_name;
      tempJSON["pm_name"] = pm_name;
      tempJSON["year"] = mainProjectInfo[i]["bgnde"].slice(0, 4) + " 년";
      tempJSON["term"] = mainProjectInfo[i]["bgnde"] + " ~ " + mainProjectInfo[i]["endde"];
      tempJSON["printMoney"] = (parseInt(mainProjectInfo[i]["transport_ct"])).toLocaleString() + " 원"; 
      projectInfo.push(tempJSON);
    }

    return projectInfo;


  }

/*
    개발 소스 db 연결 시 변경 및 수정 필요
*/



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
    height:300,
    overflowY: 'scroll'
  }
}));

export default function ManageView(props) {
  console.log("ManageView");
  console.log(props);
  const classes = mainStyles();

  const [projectOriginInfo, setProjectOriginInfo] = useState(makeProjectInfo());
  const [projectInfo, setProjectInfo] = useState(projectOriginInfo);
  const [condition, setCondition] = useState({
    searchType: 		[],
    searchDetailType:  "",
    searchDetailTypes: []
  });


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
        searchedInfo = projectOriginInfo.filter((info) => info.bgnde.slice(0,4) === conditions.searchDetailType);
        break;
      case "2":
        searchedInfo = projectOriginInfo.filter((info) => info.instt_code === conditions.searchDetailType);
        break;
      default:
        searchedInfo = projectOriginInfo;
        break;
      
    }
    setProjectInfo(searchedInfo);
  }

  return (
    <>
      <ProjectSearchDiv  condition={condition} updateCondition={updateCondition}/>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <ProjectGraph projectInfo={projectInfo} />
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
