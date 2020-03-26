import React, {useState, useReducer, useCallback, useEffect} from 'react';
import CodeInfoTable from '../component/CodeInfoTable';
import CodeSearchDiv from '../component/CodeSearchDiv';
import CodeTreeView from '../component/CodeTreeView';
//import {getCodeInfoDB} from '../data';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import { LoadingBar } from '../component/utils';

import axios from 'axios';

/*
    개발 소스 db 연결 시 변경 및 수정 필요
*/
const mainStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height:600,
    overflowY: 'scroll'
  },
  paperCode: {
    padding: theme.spacing(2),
    height:600,
    overflowY: 'scroll'
  }
}));

function getRootList(codeOriginInfo){
  return codeOriginInfo.filter(info => (
    info["code_level"] === "1"
  ));
}

export default function CodeView(props) {
  console.log("CodeView");
  console.log(props);
  const classes = mainStyles();
  const [isShowLoadingBar, setShowLoadingBar] = React.useState(true);    //loading bar
  const [codeOriginInfo, setCodeOriginInfo] = React.useState([]);
  const [codeInfo, setCodeInfo] = useState([], []);
  
  const [condition, setCondition] = useState({
    searchType: "",
    searchKeyword: "",
  })

  useEffect(() => {
      axios({
        url: '/intranet/allCode',
        method: 'post',
        data: {}
      }).then(response => {
        setShowLoadingBar(false);
        var result = JSON.parse(response.data.list);
        result.sort((a, b) => {
          return parseInt(a.CODE_LEVEL) - parseInt(b.CODE_LEVEL);
        });
        setCodeOriginInfo(result);
        setCodeInfo(result);
      }).catch(e => {
        setShowLoadingBar(false);
      });
    }, []);

  const updateCondition = (conditions) => {
    console.log("updateCondition");
    console.log(conditions);
    
    let searchedInfo = [];
    var tempCodeInfo = [].concat(codeOriginInfo);
    switch(conditions.searchType){
      case "0":
        searchedInfo = tempCodeInfo;
        break;
      case "1":
        searchedInfo = tempCodeInfo.filter((info) => info.code_id === conditions.searchKeyword);
        break;
      case "2":
        searchedInfo = tempCodeInfo.filter((info) => info.code_name.includes(conditions.searchKeyword));
        break;
      case "3":
        searchedInfo = tempCodeInfo.filter((info) => info.code_level === conditions.searchKeyword);
        break;
      case "4":
        searchedInfo = tempCodeInfo.filter((info) => info.upper_code === conditions.searchKeyword);
        break;
      case "5":
        searchedInfo = tempCodeInfo.filter((info) => info.upper_code === "");
        break;
      default:
        searchedInfo = tempCodeInfo;
        break;
      
    }
    setCondition(conditions);
    setCodeInfo(searchedInfo);
  };

  return (
    <>
      <LoadingBar open={isShowLoadingBar}/>
      <CodeSearchDiv condition={condition} updateCondition={updateCondition}/>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6}>
          <Paper className={classes.paperCode}>
            {/* <CodeTreeView rebuildSortedData={rebuildSortedData}/> */}
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Paper className={classes.paper}>
            <CodeInfoTable codeInfo={codeInfo} routeProps={props.routeProps}/>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
