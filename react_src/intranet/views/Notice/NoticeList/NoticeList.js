import React, {Component, useDebugValue, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import NoticeListTable from './NoticeListTable';

import Filter from '../component/Filter';
import { useStaticState } from '@material-ui/pickers';

import {noticeTestData} from '../Data';

import Moment from "moment"

import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));

const NoticeList = () => {

	const initState = {
		searchType: '-1',
		search: "",
		stDt: null,
		edDt: null,
	}

	const classes = useStyles();
	const [state, setState] = React.useState(
		initState
	);
	// const [temp, setTemp] = useState(initTemp());
	const [noticeData, setNoticeData] = useState([]);
	const [selected, setSelected] = useState([]);

	// const [filterData, setFilterData] = useState([]);


	useEffect(() => {
		// setNoticeData(temp);
		axios({
			url: '/intranet/notice/findlist',
			method : 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			}).then(response => {
				console.log(response);
				console.log(JSON.stringify(response));
				setNoticeData(response.data.noticeData);
				setIsAdmin(response.data.isAdmin);
			}).catch(e => {
				console.log(e);
		});
	}, []);

	// const nowDate = Moment(new Date()).format('YYYYMMDD');

	// const dateStr = (date) => {
	// 	return date.substr(0,4)+date.substr(5,2)+date.substr(8,2);
	// }

	// const initTemp= () =>{
	// 	const data = noticeTestData;
	// 	if(localStorage.getItem('noticeTestData') !== null){
	// 		return JSON.parse(localStorage.getItem("noticeTestData"));
	// 	}else{
	// 		localStorage.setItem('noticeTestData',JSON.stringify(data));
	// 		return data;
	// 	}
	// }
	
	// useEffect(()=>{
	// 	let filtering = [];
	// 	if(noticeData!==undefined && JSON.stringify(noticeData) !== '[{}]'){
	// 		filtering = noticeData.filter((obj) => {
	// 			let result = true;
	// 			if(state.searchType === '-1' && !obj.title.includes(state.search) && !obj.content.includes(state.search) && !obj.regId.includes(state.search) ){
	// 				result = false;
	// 			}else if(state.searchType === 'title' && !obj.title.includes(state.search)){
	// 				result = false;
	// 			}else if(state.searchType === 'content' && !obj.content.includes(state.search)){
	// 				result = false;
	// 			}else if(state.searchType === 'regId' && !obj.regId.includes(state.search)){
	// 				result = false;
	// 			}else if(state.stDt !== "Invalid date" &&  state.stDt !== null && eval(state.stDt > dateStr(obj.regDateTime).substr(0,6))){
	// 				result = false;
	// 			}else if(state.edDt !== "Invalid date" &&  state.edDt !== null && eval(state.edDt < dateStr(obj.regDateTime).substr(0,6))){
	// 				result = false;
	// 			}
	// 			return result;
	// 		});
	// 		// console.log(JSON.stringify(filtering));
	// 		setFilterData([
	// 			...(filtering).filter((obj) => {
	// 					if(obj.majorYn && eval(nowDate <= dateStr(obj.majorPeriodDate)) ) {
	// 						return true;
	// 					} 
	// 			}).reverse()
				
	// 			, ...(filtering).filter((obj)=>{
	// 					if(!obj.majorYn || eval(nowDate > dateStr(obj.majorPeriodDate)) ) {
	// 						return true;
	// 					}
	// 			}).reverse()
	// 		]);
		
	// 	}else{
	// 		setFilterData(noticeData);
	// 	}
	// }, [noticeData, state]);

	const handleSelectedNoticeNo = (selectedNo) => {
		setSelected(selectedNo);
	}

	return (
		<div className={classes.root}>
		<Filter 
			noticeData={noticeData}
			state={state} setState={setState}
			selected={selected}
			setNoticeData={setNoticeData}
		/>
		<Card>
			<NoticeListTable setNoticeData={setNoticeData} noticeData={noticeData} selectedNoticeNo={handleSelectedNoticeNo}/>
		</Card>
		</div>
	);
}

export default NoticeList;
