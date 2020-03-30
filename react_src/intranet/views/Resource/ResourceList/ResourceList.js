import React, {Component, useDebugValue, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';

import ResourceListTable from './ResourceListTable';
import Filter from '../component/Filter';
import { useStaticState } from '@material-ui/pickers';

import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));

const ResourceList = () => {
	
	const classes = useStyles();

	const initState = {
		holder: null,
		resType: '1',
		stDt: null,
		edDt: null,
	}
	const [state, setState] = React.useState(initState);
	const [resData, setResData] = useState([]);
	const [selected, setSelected] = useState([]);
	const [isAdmin, setIsAdmin] = useState(false);
	const [count, setCount] = useState(0);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const [temp, setTemp] = useState({
		state : initState,
		page : 0,
		rowsPerPage : 10
	});
	
	useEffect(() => {
		axios({
				url: '/intranet/resource/findlist',
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
					// console.log(JSON.stringify(response));
					setResData(response.data.resData);
					setIsAdmin(response.data.isAdmin);
					setCount(response.data.count);
				}).catch(e => {
					console.log(e);
			});
	}, []);

	useEffect(()=>{
		if(temp.state !== state || temp.rowsPerPage !== rowsPerPage || temp.page < page){
			axios({
					url: '/intranet/resource/findlist',
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
							setResData([...resData,...response.data.resData]);
						}else{
							setResData(response.data.resData);
						}
						setIsAdmin(response.data.isAdmin);
						setCount(response.data.count);
						setTemp({...temp, ['state']:state, ['rowsPerPage']:rowsPerPage, ['page']:page});
					}).catch(e => {
						console.log(e);
				});
		}
	}, [state, page, rowsPerPage]);
	

	const handleSelectedResNo = (selectedNo) => {
		setSelected(selectedNo);
	}

	return (
		<React.Fragment>
			<Filter 
				state={state} 
				setState={setState}
				selected={selected}
				setSelected={setSelected}
				setResData={setResData}
				resData={resData}
				setPage={setPage}
				count={count}
				setCount={setCount}
			/>
			{/* <Card> */}
			<Paper className={classes.root}>
				<ResourceListTable 
					count={count}
					setCount={setCount} 
					setResData={setResData} 
					resData={resData} 
					selectedResNo={handleSelectedResNo}
					page={page}
					setPage={setPage}
					rowsPerPage={rowsPerPage}
					setRowsPerPage={setRowsPerPage}
				/>
			{/* </Card> */}
			</Paper>
		</React.Fragment>
	);
}

export default ResourceList;
