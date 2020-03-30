import React, {Component, useDebugValue, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { useStaticState } from '@material-ui/pickers';
import Paper from '@material-ui/core/Paper';
import NoticeListTable from './NoticeListTable';
import Filter from '../component/Filter';
import { LoadingBar } from '../../../common/LoadingBar/LoadingBar';

import Moment from "moment"

import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));

const loginData = JSON.parse(sessionStorage.getItem('loginSession'));

const NoticeList = () => {

	const initState = {
		searchType: '1',
		search: "",
		stDt: null,
		edDt: null,
	}

	const classes = useStyles();
	const [state, setState] = useState(initState);
	const [noticeData, setNoticeData] = useState([]);
	const [selected, setSelected] = useState([]);

	const [isAdmin, setIsAdmin] = useState(false);
	const [count, setCount] = useState(0);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const [memberNo, setMemberNo] = useState(loginData.member_NO);

	const [isShowLoadingBar, setShowLoadingBar] = useState(true);//로딩바

	const [temp, setTemp] = useState({
		state : initState,
		page : 0,
		rowsPerPage : 10
	});

	useEffect(() => {
		// setNoticeData(temp);
		// setShowLoadingBar(true);
		axios({
			url: '/intranet/notice/findlist',
			method : 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			data :{
					state : state,
					rowsPerPage : rowsPerPage,
					page : page
			},
			}).then(response => {
				console.log(response.data);
				setNoticeData(response.data.noticeData);
				setIsAdmin(response.data.isAdmin);
				setCount(response.data.count);
				setShowLoadingBar(false);
			}).catch(e => {
				setShowLoadingBar(false);
				console.log(e);
		});
	}, []);

	useEffect(()=>{
		if(temp.state !== state || temp.rowsPerPage !== rowsPerPage || temp.page < page){
		setShowLoadingBar(true);
			axios({
					url: '/intranet/notice/findlist',
					method : 'post',
					headers: {
						'Content-Type': 'application/json;charset=UTF-8'
					},
					data :{
						state : state,
						rowsPerPage : rowsPerPage,
						page : page
					},
					}).then(response => {
						//페이지가 0이아니면 누적
						console.log(response.data);
						console.log('page : '+page);
						if(page !== 0){
							setNoticeData([...noticeData,...response.data.noticeData]);
						}else{
							setNoticeData(response.data.noticeData);
						}
						setIsAdmin(response.data.isAdmin);
						setCount(response.data.count);
						setTemp({...temp, ['state']:state, ['rowsPerPage']:rowsPerPage, ['page']:page});
						setShowLoadingBar(false);
					}).catch(e => {
						setShowLoadingBar(false);
						console.log(e);
				});
		}
	}, [state, page, rowsPerPage])

	
	const handleSelectedNoticeNo = (selectedNo) => {
		setSelected(selectedNo);
	}

	return (
		<div className={classes.root}>
			<LoadingBar openLoading={isShowLoadingBar}/>  
			<Filter 
				// noticeData={noticeData}
				// state={state} 
				// setState={setState}
				// selected={selected}
				// setNoticeData={setNoticeData}
				isAdmin={isAdmin}
				state={state} 
				setState={setState}
				selected={selected}
				setSelected={setSelected}
				setNoticeData={setNoticeData}
				noticeData={noticeData}
				setPage={setPage}
				count={count}
				setCount={setCount}
			/>
			<Card>
				<NoticeListTable 
					// setNoticeData={setNoticeData} 
					// noticeData={noticeData} 
					// selectedNoticeNo={handleSelectedNoticeNo}
					memberNo={memberNo}
					isAdmin={isAdmin}
					count={count}
					setCount={setCount} 
					setNoticeData={setNoticeData} 
					noticeData={noticeData} 
					selectedNoticeNo={handleSelectedNoticeNo}
					page={page}
					setPage={setPage}
					rowsPerPage={rowsPerPage}
					setRowsPerPage={setRowsPerPage}
				/>
			</Card>
		</div>
	);
}

export default NoticeList;
