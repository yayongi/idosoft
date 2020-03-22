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
  if(rowData.code_level == "0") {
    treeDatas.push(rowData);
  } else {
    for(let i=0; i<treeDatas.length; i++) {
      const row = treeDatas[i];
      if(row.subTrees == undefined) {
        row.subTrees = [];
      }
      if(row.code_id == rowData.upper_code) {
        row.subTrees.push(rowData);
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
  console.log("call getRebuildSortedData") ;
  let sortedCodeInfo = codeOriginInfo;
  let rebuildDataList = [];
  sortedCodeInfo = [
      {
      "id": 0,
      "code_id": "",
      "code_name": "ROOT",
      "code_level": "0",
      "upper_code": "",
      "code_dc":"ROOT",
      "reg_datetime": "",
      "upd_datetime": "",
      "reg_id": "",
      "upd_id": "",
      "note": "",
      "temp_colum": ""
    },
    ...sortedCodeInfo
  ]
  for(let i=0; i<sortedCodeInfo.length; i++) {
    const row = sortedCodeInfo[i];
    rebuildDataList = addTreeData(rebuildDataList, row) ; 
  }
  return rebuildDataList;
}
/**
 * 검색 조건에 해당하는 데이터를 기준으로 upper, lower 추출
 */
function getRebuildFilterData(codeOriginList, filteredList) {
  let rebuildDataList = [];
  let duplicateCheckList = [];
  for(let i=0; i<filteredList.length; i++) {
    const filteredRow= filteredList[i];
   
    duplicateCheckList.push(filteredRow.code_id);   // 중복 체크를 위해 code_id 저장

    rebuildDataList.push(filteredRow); // 필터된 자신은 먼저 저장
    getUpperCodeList(rebuildDataList, codeOriginList, filteredList[i].code_id, duplicateCheckList);  // 상위코드 정보 추가
  }

  rebuildDataList.sort((a, b) => {
    return parseInt(a.id) - parseInt(b.id);
  });
 
  return rebuildDataList;
}
/*
  상위 코드 조회
*/
function getUpperCodeList(rebuildDataList, codeOriginList, codeId, duplicateCheckList) {
  for(let i=0; i<codeOriginList.length; i++) {
    if(codeId == codeOriginList[i].code_id) {      
      const rebuildDataRow = codeOriginList[i];
      if(duplicateCheckList.findIndex((item, idx) => item == rebuildDataRow.code_id) == -1) {   // 이미 저장된 code id는 저장하지 않음.
        rebuildDataList.push(rebuildDataRow);  
        duplicateCheckList.push(rebuildDataRow.code_id);   // 중복 체크를 위해 code_id 저장
      }
      if(codeOriginList[i].upper_code != "") {
        getUpperCodeList(rebuildDataList, codeOriginList, codeOriginList[i].upper_code, duplicateCheckList);
      } 
      break;
    } 
  }
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
  console.log("CodeView");
  console.log(props);
  const classes = mainStyles();
  const [codeOriginInfo, setCodeOriginInfo] = useState(getCodeOriginInfoData());
  const rootCodeList = getRootList(codeOriginInfo);
  const [codeInfo, setCodeInfo] = useState(codeOriginInfo);
  const [condition, setCondition] = useState({
    searchType: "",
    searchKeyword: "",
  })
  const cloneCodeOriginInfo = JSON.parse(JSON.stringify(codeOriginInfo));     // 배열은 다른변수에 할당해도 레퍼런스 참조로 복사된다.
  const cloneCodeInfo = JSON.parse(JSON.stringify(codeInfo));
  let filterdData = getRebuildFilterData(cloneCodeOriginInfo, cloneCodeInfo);  // 필터링된 리스트형 데이터 (상위코드를 포함)
  let rebuildSortedData = getRebuildSortedData(filterdData);                      // 계층형 데이터로 재구성한 데이터, 코드별 하위 레벨을 포함하는 구조


  const updateCondition = (conditions) => {
    console.log("updateCondition");
    console.log(conditions);
    
    let searchedInfo = [];
    switch(conditions.searchType){
      case "0":
        searchedInfo = codeOriginInfo;
        break;
      case "1":
        searchedInfo = codeOriginInfo.filter((info) => info.code_id === conditions.searchKeyword);
        break;
      case "2":
        searchedInfo = codeOriginInfo.filter((info) => info.code_name.includes(conditions.searchKeyword));
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
    setCondition(conditions);
    setCodeInfo(searchedInfo);
  };

  return (
    <>
      <CodeSearchDiv condition={condition} updateCondition={updateCondition}/>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6}>
          <Paper className={classes.paperCode}>
            <CodeTreeView rebuildSortedData={rebuildSortedData}/>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Paper className={classes.paper}>
            <CodeInfoTable codeInfo={codeInfo} rootCodeList={rootCodeList} routeProps={props.routeProps}/>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
