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
function getCodeInfoData(){
  const sortedCodeInfo = getCodeInfoDB();
  return sortedCodeInfo.sort((a, b) => {
    return parseInt(a.code_level) - parseInt(b.code_level);
  });
}

/*
    개발 소스 db 연결 시 변경 및 수정 필요
*/



const mainStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function CodeView() {
  console.log("CodeView");
  const classes = mainStyles();
  const [codeInfo, setCodeInfo] = useState(getCodeInfoData());
  const [codeInfoCopy, setcodeInfoCopy] = useState(codeInfo);
  const [searchType, setSearchType] = useState('');

  useEffect(() => {
    console.log("useEffect");
  }, []);

  function codeUpdate(updateCodeInfo){
    console.log("codeUpdate");
    setCodeInfo(updateCodeInfo);
  }

  const searchCode = (searchKeyWord) => {
     
    if(!searchKeyWord && searchType != "upper_code"){
      alert("검색어를 입력해주세요");
      return;
    }

    if(!searchType){
      alert("검색 조건을 선택해주세요");
      return;
    }

    searchKeyWord = searchKeyWord ? searchKeyWord : "";
    setcodeInfoCopy(codeInfo.filter(info => (
      info[searchType] === searchKeyWord
    )));
  }

  const selectSearchType = (selectType) => {
    setSearchType(selectType);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <CodeSearchDiv searchCode={searchCode} selectSearchType={selectSearchType}/>
        </Paper>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Paper className={classes.paper}>
          <CodeTreeView props={codeInfoCopy}/>
        </Paper>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Paper className={classes.paper}>
          <CodeInfoTable props={codeInfoCopy}/>
        </Paper>
      </Grid>
    </Grid>
  );
}
