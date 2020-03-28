import React, {Component, useDebugValue, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

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
		holder: "",
		resType: '-1',
		stDt: null,
		edDt: null,
	}
	const [state, setState] = React.useState(initState);
	const [resData, setResData] = useState([]);
	const [selected, setSelected] = useState([]);
	const [isAdmin, setIsAdmin] = useState(false);
	
	useEffect(() => {
		axios({
				url: '/intranet/resource/findlist',
				method : 'post',
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
				},
				}).then(response => {
					console.log(response);
					console.log(JSON.stringify(response));
					setResData(response.data.resData);
					setIsAdmin(response.data.isAdmin);
				}).catch(e => {
					console.log(e);
			});
	}, []);
	
	useEffect(() => {
		
	}, [resData])

	useEffect(()=>{
		
	}, [state]);

	const handleSelectedResNo = (selectedNo) => {
		setSelected(selectedNo);
	}

	return (
		<div className={classes.root}>
		<Filter 
			state={state} setState={setState}
			selected={selected}
			setResData={setResData}
			resData={resData}
		/>
		<Card>
			<ResourceListTable setResData={setResData} resData={resData} selectedResNo={handleSelectedResNo}/>
		</Card>
		</div>
	);
}

export default ResourceList;
