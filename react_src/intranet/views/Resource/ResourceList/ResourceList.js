import React, {Component, useDebugValue, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import ResourceListTable from './ResourceListTable';
// import {ResTestData, resTypeData, resProductData, resDisplaySizeData, resHolderData} from '../Data';
import {ResTestData} from '../Data';

import Filter from '../component/Filter';
import { useStaticState } from '@material-ui/pickers';

import {returnValue} from '../uitl/ResUtil';

const resTypeData= [ {key:'a1', value:"모니터"}, {key:'a2', value:"노트북"}, {key:'a3', value:"테스트폰"} ];
const resProductData= [ {key:'b1', value:"삼성"}, {key:'b2', value:"엘지"}, {key: 'b3', value:"애플"} ];
const resDisplaySizeData= [{key:'c0', value:"화면사이즈미설정"}, {key:'c1', value:"18인치"}, {key:'c2', value:"21인치"}, {key: 'c3', value:"24인치"}, {key: 'c4', value:"28인치"} ];
const resHolderData= 
							[ 
								{key:'d1', value:"최문걸"}, 
								{key:'d2', value:"조현철"}, 
								{key: 'd3', value:"이인성"}, 
								{key: 'd4', value:"신우인"},
								{key: 'd5', value: "오경섭"},
								{key: 'd6', value: "송원회"},
								{key: 'd7', value: "강성우"},
								{key: 'd8', value: "유기환"},
								{key: 'd9', value: "김준선"}
							];						


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));

const ResourceList = () => {

	const initTemp= () =>{
		const data = ResTestData.testData;
		if(localStorage.getItem('resData') !== null){
			return JSON.parse(localStorage.getItem("resData"));
		}else{
			localStorage.setItem('resData',JSON.stringify(data));
			return data;
		}
	}
	
	const yyyyMmDate = (str) =>{
		return str.substr(0,4)+str.substr(5,7);
	}

	const initState = {
		holder: "",
		resType: '-1',
		stDt: null,
		edDt: null,
	}

	const classes = useStyles();
	const [state, setState] = React.useState(
		// {
		// holder: undefined,
		// resType: '-1',
		// stDt: null,
		// edDt: null,
		// }
		initState
	);
	const [temp, setTemp] = useState(initTemp());
	const [resData, setResData] = useState([{}]);
	const [selected, setSelected] = useState([]);
	
	const [mappingData, setMappingData] = useState([{}])
	const [filterData, setFilterData] = useState([]);

	useEffect(() => {
		setResData(temp);
	}, [temp]);
	
	useEffect(() => {
		setMappingData(mappingList(resData));
	}, [resData])

	useEffect(()=>{
		// console.log(state);

		if(JSON.stringify(mappingData) !== '[{}]'){
			const resFillterData = mappingData.filter((res=>{
				let result = true;
				if(Number(state.resType) !== -1 && returnValue(resTypeData, state.resType, 'value') !== res.resCode ){
					result = false;
				}else if(state.holder !== '' && res.holder.indexOf(state.holder) !== 0 ){
					result = false;
				}else if(state.stDt !== "Invalid date" &&  state.stDt !== null && eval(state.stDt > yyyyMmDate(res.purchaseMtn))){
					console.log(`${state.stDt} > ${yyyyMmDate(res.purchaseMtn)} : ${eval(state.stDt > res.purchaseMtn)}`);
					result = false;
				}else if(state.edDt !== "Invalid date" &&  state.edDt !== null && eval(state.edDt < yyyyMmDate(res.purchaseMtn))){
					console.log(`${state.edDt} < ${yyyyMmDate(res.purchaseMtn)} : ${eval(state.edDt < res.purchaseMtn)}`);
					result = false;
				}
				return result;
			}));
			// console.log(resFillterData);
			setFilterData(resFillterData.reverse());
		}
	}, [mappingData, state]);

	const handleSelectedResNo = (selectedNo) => {
		setSelected(selectedNo);
	}

	//Code를 해당하는 타입으로 바꿔줌.
	const mappingList = (resData) => {
		// console.log(`mappnigList에서의 파라미터 : ${JSON.stringify(resData)}`);
		let mappingData = [];
		if(resData!==undefined && resData[0].hasOwnProperty('resNo')){
			for(var i=0; i<resData.length; i++){
				var obj = resData[i];
				resData[i] = {...obj, 
								resCode:returnValue(resTypeData, obj.resCode, 'value'),
								markCode:returnValue(resProductData, obj.markCode , 'value'),
								productMtn:obj.productMtn!==''&&obj.productMtn.substr(0,4)+'-'+obj.productMtn.substr(4,2),
								purchaseMtn:obj.purchaseMtn!==''&&obj.purchaseMtn.substr(0,4)+'-'+obj.purchaseMtn.substr(4,2),
								displaySizeCode:returnValue(resDisplaySizeData, obj.displaySizeCode , 'value'),
								holder:returnValue(resHolderData, obj.holder , 'value')
							};
				mappingData.push(resData[i]);
			}
		}
		// return mappingData !== undefined ? setResData(mappingData.reverse()) : resData;
		return mappingData !== undefined ? mappingData:[{}];
		// return mappingData;
	}

	return (
		<div className={classes.root}>
		<Filter 
			state={state} setState={setState}
			selected={selected}
			setResData={setResData}
		/>
		<Card>
			<ResourceListTable setResData={setResData} resData={filterData} selectedResNo={handleSelectedResNo}/>
		</Card>
		</div>
	);
}

export default ResourceList;
