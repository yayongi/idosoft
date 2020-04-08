import React, {useState, useReducer, useCallback, useEffect} from 'react';
import CodeInfo from '../component/CodeInfo';
import CodeSearchDiv from '../component/CodeSearchDiv';
import CodeTreeView from '../component/CodeTreeView';
import {getCodeInfoDB} from '../data';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import { LoadingBar } from '../../../common/LoadingBar/LoadingBar';
import { processErrCode } from '../../../js/util';

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
/**
 * 검색 조건에 해당하는 데이터를 기준으로 upper, lower 추출
 */
function getRebuildFilterData(codeOriginList, filteredList) {
  let rebuildDataList = [];
  let duplicateCheckList = [];
  for(let i=0; i<filteredList.length; i++) {
    const filteredRow= filteredList[i];
   
    duplicateCheckList.push(filteredRow.CODE_ID);   // 중복 체크를 위해 code_id 저장

    rebuildDataList.push(filteredRow); // 필터된 자신은 먼저 저장
    getUpperCodeList(rebuildDataList, codeOriginList, filteredList[i].CODE_ID, duplicateCheckList);  // 상위코드 정보 추가
  }
  
  rebuildDataList.sort((a, b) => {
    return parseInt(a.CODE_LEVEL) - parseInt(b.CODE_LEVEL);
  });
  return rebuildDataList;
}
/*
  상위 코드 조회
*/
function getUpperCodeList(rebuildDataList, codeOriginList, codeId, duplicateCheckList) {
  for(let i=0; i<codeOriginList.length; i++) {
    if(codeId == codeOriginList[i].CODE_ID) {      
      const rebuildDataRow = codeOriginList[i];
      if(duplicateCheckList.findIndex((item, idx) => item == rebuildDataRow.CODE_ID) == -1) {   // 이미 저장된 code id는 저장하지 않음.
        rebuildDataList.push(rebuildDataRow);  
        duplicateCheckList.push(rebuildDataRow.CODE_ID);   // 중복 체크를 위해 code_id 저장
      }
      if(codeOriginList[i].UPPER_CODE != "") {
        getUpperCodeList(rebuildDataList, codeOriginList, codeOriginList[i].UPPER_CODE, duplicateCheckList);
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
		const [isShowLoadingBar, setShowLoadingBar] = React.useState(false, []);    //loading bar
		const classes = mainStyles();
		const [codeOriginInfo, setCodeOriginInfo] = useState([]);
		const [codeInfo, setCodeInfo] = useState([]);
		const [condition, setCondition] = useState({
		  searchType: "0",
		  searchKeyword: "",
		});
		const [selectNodeInfo, setSelectNodeInfo] = useState({});
		
		
		
		const cloneCodeOriginInfo = JSON.parse(JSON.stringify(codeOriginInfo));     // 배열은 다른변수에 할당해도 레퍼런스 참조로 복사된다.
		const cloneCodeInfo = JSON.parse(JSON.stringify(codeInfo));
		let filterdData = getRebuildFilterData(cloneCodeOriginInfo, cloneCodeInfo);  // 필터링된 리스트형 데이터 (상위코드를 포함)
		let rebuildSortedData = getRebuildSortedData(filterdData);                      // 계층형 데이터로 재구성한 데이터, 코드별 하위 레벨을 포함하는 구조

		
		const getOriginCode = () => {
			setShowLoadingBar(true);
			axios({
			    url: '/intranet/allCode',
			    method: 'post',
			    data: {}
			}).then(response => {
			    var result = JSON.parse(response.data.list);
			    result.sort((a, b) => {
			      return parseInt(a.CODE_LEVEL) - parseInt(b.CODE_LEVEL);
			    });
			    setCodeInfo([].concat(result));
			    setCodeOriginInfo([].concat(result));
			    setShowLoadingBar(false);
			
			}).catch(e => {
			    setShowLoadingBar(false);
			    processErrCode(e);
			});
		}
  
  
		useEffect(() => {
			getOriginCode();
		}, []);

		const updateCondition = (conditions) => {
			let searchedInfo = [];
			switch(conditions.searchType){
				case "0":
					searchedInfo = [].concat(codeOriginInfo);
					break;
				case "1":
					searchedInfo = codeOriginInfo.filter((info) => info.CODE_ID.includes(conditions.searchKeyword));
					break;
				case "2":
					searchedInfo = codeOriginInfo.filter((info) => info.CODE_NAME.includes(conditions.searchKeyword));
					break;
				case "3":
					searchedInfo = codeOriginInfo.filter((info) => info.CODE_LEVEL === conditions.searchKeyword);
					break;
				case "4":
					searchedInfo = codeOriginInfo.filter((info) => info.UPPER_CODE === conditions.searchKeyword);
					break;
				case "5":
					searchedInfo = codeOriginInfo.filter((info) => info.UPPER_CODE === "");
					break;
				default:
					searchedInfo = [].concat(codeOriginInfo);
					break;
		}
		setCondition(conditions);
		setCodeInfo(searchedInfo);
	};
	
	const updateSelectedNodeId = (nodeId) => {
		if(!nodeId || nodeId == "root"){
			setSelectNodeInfo({"CODE_ID":"root"});
		}else{
			setSelectNodeInfo(codeOriginInfo.filter((info) => info.CODE_ID === nodeId));
		}
	}
	
	const reGetOriginData = () => {
		getOriginCode();
	}

	return (
	  <>
	    <CodeSearchDiv condition={condition} updateCondition={updateCondition}/>
	    <Grid container spacing={2}>
	      <Grid item xs={12} sm={12} md={6}>
	        <Paper className={classes.paperCode}>
	          <CodeTreeView rebuildSortedData={rebuildSortedData} updateSelectedNodeId={updateSelectedNodeId}/>
	        </Paper>
	      </Grid>
	      <Grid item xs={12} sm={12} md={6}>
	        <Paper className={classes.paper}>
	          <CodeInfo routeProps={props.routeProps} selectNodeInfo={selectNodeInfo} reGetOriginData={reGetOriginData}/>
	        </Paper>
	      </Grid>
	    </Grid>
	  </>
	);
}
