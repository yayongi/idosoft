import React, {useState, useReducer, useCallback, useEffect} from 'react';
import CodeInfoTable from '../component/CodeInfoTable';
import CodeSearchDiv from '../component/CodeSearchDiv';
import CodeTreeView from '../component/CodeTreeView';
import CodeInfo from '../component/CodeInfo';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import { LoadingBar } from '../component/utils';

import axios from 'axios';



/*
  level 순으로 정렬된 데이터를 아래와 같은 구조로 재구성 
  * Level1 ==> 배열에 그냥 추가
  [
    {lv1-rowdata1}, 
    {lv1-rowdata2}}  
    ... 
  ]
  *Level2 ==> ... 상위코드의 레벨1.subTrees 배열에 추가
     [
          {
            lv-1rowdata1.subTrees[{lv-2-rowdata1}, {lv-2-rowdata2}]
            ...
          }, {
            lv-1rowdata2.subTrees[{lv-2-rowdata1}, {lv-2-rowdata2}]
            ...
          }, ...   
        ]
  * Level3 ==> .... 상위코드의 레벨2.subTrees 배열에 추가
*/
function addTreeData(treeDatas, rowData) {
  if(rowData.CODE_LEVEL == "0") {
    treeDatas.push(rowData);
  } else {
    for(let i=0; i<treeDatas.length; i++) {
      const row = treeDatas[i];
      if(row.subTrees == undefined) {
        row.subTrees = [];
      }
      if(row.CODE_ID == rowData.UPPER_CODE) {
        if(row.subTrees.findIndex((item, idx) => item.CODE_ID === rowData.CODE_ID) == -1){
          row.subTrees.push(rowData);
        }
        break;
      } else {  // 하위 트리에 존재하는지 확인
        addTreeData(row.subTrees, rowData);
      }
    }
  }
  return treeDatas;
}

/**
 * 정렬된 데이터를 재구성
 */
function getRebuildSortedData(codeOriginInfo){
  console.log("call getRebuildSortedData");
  if(!codeOriginInfo){
    return "";
  }
  
  let sortedCodeInfo = codeOriginInfo;
  let rebuildDataList = [];
  sortedCodeInfo = [
      {
      "ID": 0,
      "CODE_ID": "",
      "CODE_NAME": "ROOT",
      "CODE_LEVEL": "0",
      "UPPER_CODE": "",
      "CODE_DC":"ROOT",
      "REG_DATETIME": "",
      "UPD_DATETIME": "",
      "REG_ID": "",
      "UPD_ID": "",
      "NOTE": "",
      "TEMP_COLUM": ""
    },
    ...sortedCodeInfo
  ]
  for(let i=0; i<sortedCodeInfo.length; i++) {
    const row = sortedCodeInfo[i];
    rebuildDataList = addTreeData(rebuildDataList, row) ; 
  }
  return rebuildDataList;
}


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

export default function CodeView(props) {
  const classes = mainStyles();
  const [isShowLoadingBar, setShowLoadingBar] = useState(true, []);    //loading bar
  const [codeOriginInfo, setCodeOriginInfo] = useState();
  const [rebuildSortedData, setRebuildSortedData] = useState();

  const [detailCodeInfo, setDetailCodeInfo] = useState();
  const [isShowTotalInfoTable, setShowTotalInfoTable] = useState(true);
  
  console.log("detailCodeInfo : ");
  console.log(detailCodeInfo);

  const [condition, setCondition] = useState({
    searchType: "",
    searchKeyword: "",
  });
  const [codeInfo, setCodeInfo] = useState();

  useEffect(() => {
    axios({
      url: '/intranet/allCode',
      method: 'post',
      data: {}
    }).then(response => {
      var result = JSON.parse(response.data.list);
      result.sort((a, b) => {
        return parseInt(a.CODE_LEVEL) - parseInt(b.CODE_LEVEL);
      });
      setCodeInfo(result);
      setCodeOriginInfo(result);
      setShowLoadingBar(false);
      setRebuildSortedData(getRebuildSortedData(result));

    }).catch(e => {
      console.log(e);
      setShowLoadingBar(false);
    });
  }, []);


  const updateCondition = (conditions) => {
    let searchedInfo = [];
    switch(conditions.searchType){
      case "0":
        searchedInfo = codeOriginInfo;
        break;
      case "1":
        searchedInfo = codeOriginInfo.filter((info) => info.CODE_ID === conditions.searchKeyword);
        break;
      case "2":
        searchedInfo = codeOriginInfo.filter((info) => info.CODE_NAME.includes(conditions.searchKeyword));
        break;
      case "3":
        searchedInfo = codeOriginInfo.filter((info) => info.CODE_LEVEL == conditions.searchKeyword);
        break;
      case "4":
        searchedInfo = codeOriginInfo.filter((info) => info.UPPER_CODE === conditions.searchKeyword);
        break;
      case "5":
        searchedInfo = codeOriginInfo.filter((info) => info.UPPER_CODE === "");
        break;
      default:
        searchedInfo = codeOriginInfo;
        break;
    }
    setCondition(conditions);
    setCodeInfo(searchedInfo);
    if(searchedInfo.length == 1){
       setShowTotalInfoTable(false);
       setDetailCodeInfo(searchedInfo);
    }else{
      setShowTotalInfoTable(true);
    }
  };

  const updateSelectedNodeId = (nodeid) => {
    setDetailCodeInfo(codeOriginInfo.filter((info) => info.CODE_ID == nodeid));
    setShowTotalInfoTable(false);
  }

  const rootCodeAdd = () => {
    setDetailCodeInfo([]);
    setShowTotalInfoTable(false);
  }

  return (
    <>
      <LoadingBar openLoading={isShowLoadingBar}/>
      <CodeSearchDiv condition={condition} updateCondition={updateCondition} rootCodeAdd={rootCodeAdd}/>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6}>
          <Paper className={classes.paperCode}>
            <CodeTreeView codeInfo={codeInfo} rebuildSortedData={rebuildSortedData} codeOriginInfo={codeOriginInfo} updateSelectedNodeId={updateSelectedNodeId}/>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Paper className={classes.paper}>
            {isShowTotalInfoTable && <CodeInfoTable codeInfo={codeInfo} rebuildSortedData={rebuildSortedData} routeProps={props.routeProps}/>}
            {!isShowTotalInfoTable && <CodeInfo detailCodeInfo={detailCodeInfo}  setShowTotalInfoTable={setShowTotalInfoTable}></CodeInfo>}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
