import React, {useState, useReducer, useCallback, useEffect} from 'react';
import CodeInfoTable from '../component/CodeInfoTable';
import CodeSearchDiv from '../component/CodeSearchDiv';
import CodeTreeView from '../component/CodeTreeView';
import {getCodeInfoDB} from '../data';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

/*
    개발 소스 db 연결 시 변경 및 수정 필요
*/
function getCodeOriginInfoData(){
  if(!localStorage.getItem("resCodeData")){
    const sortedCodeInfo = getCodeInfoDB();
    sortedCodeInfo.sort((a, b) => {
      return parseInt(a.code_level) - parseInt(b.code_level);
    });

    localStorage.setItem('resCodeData', JSON.stringify(sortedCodeInfo));
    return sortedCodeInfo;
  }
  return JSON.parse(localStorage.getItem("resCodeData"));
}

function getRootList(codeOriginInfo){
  return codeOriginInfo.filter(info => (
      info["code_level"] === "1"
    ));
}


/*
    개발 소스 db 연결 시 변경 및 수정 필요
*/



const mainStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height:500,
    overflowY: 'scroll'
  },
}));

export default function CodeView(props) {
  console.log("CodeView");
  console.log(props);
  const classes = mainStyles();
  const [codeOriginInfo, setcodeOriginInfo] = useState(getCodeOriginInfoData());
  const rootCodeList = getRootList(codeOriginInfo);
  const [codeInfo, setCodeInfo] = useState(codeOriginInfo);
  const [condition, setCondition] = useState({
    searchType: "",
    searchKeyword: "",
  })


  const updateCondition = (conditions) => {
    console.log("updateCondition");
    console.log(conditions);
    setCondition(conditions);

    var searchedInfo = [];
    switch(conditions.searchType){
      case "0":
        searchedInfo = codeOriginInfo;
        break;
      case "1":
        searchedInfo = codeOriginInfo.filter((info) => info.code_id === conditions.searchKeyword);
        break;
      case "2":
        searchedInfo = codeOriginInfo.filter((info) => info.code_name === conditions.searchKeyword);
        break;
      case "3":
        searchedInfo = codeOriginInfo.filter((info) => info.code_level === conditions.searchKeyword);
        break;
      case "4":
        searchedInfo = codeOriginInfo.filter((info) => info.upper_code === conditions.searchKeyword);
        break;
      case "5":
        searchedInfo = codeOriginInfo.filter((info) => info.upper_code === "");
        break;
      default:
        searchedInfo = codeOriginInfo;
        break;
      
    }
    setCodeInfo(searchedInfo);
  };

  return (
    <>
      <CodeSearchDiv condition={condition} updateCondition={updateCondition}/>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6}>
          <Paper className={classes.paper}>
            <CodeTreeView codeInfo={codeInfo}/>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Paper className={classes.paper}>
            <CodeInfoTable codeInfo={codeInfo} rootCodeList={rootCodeList}/>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
