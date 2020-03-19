import React, {Component, useDebugValue, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import ResourceListTable from './ResourceListTable';
import {ResTestData, resTypeData, resProductData, resDisplaySizeData, resHolderData} from '../Data';

import Filter from '../component/Filter';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));


const ResourceList = () => {
	localStorage.setItem('resTypeData',JSON.stringify(resTypeData));
	localStorage.setItem('resProductData',JSON.stringify(resProductData));
	localStorage.setItem('resDisplaySizeData',JSON.stringify(resDisplaySizeData));
	localStorage.setItem('resHolderData',JSON.stringify(resHolderData));
	
	const classes = useStyles();
	const [state, setState] = React.useState({
		holder: undefined,
		resType: '-1',
		stDt: null,
		edDt: null,
	});
	const [resData, setResData] = useState([]);
	const [selected, setSelected] = useState([]);

	// if(localStorage.getItem('resData') !== null){
	// 	setResData(JSON.parse(localStorage.getItem("resData")));
	// }else{
	// 	localStorage.setItem('resData',JSON.stringify(ResTestData.testData));
	// 	setResData(localStorage.resData);
	// }

	// useEffect(()=>{
	// 	setResData(JSON.parse(localStorage.getItem("resData")));
	// })

	useEffect(() => {
		if(localStorage.getItem('resData') !== null){
			setResData(JSON.parse(localStorage.getItem("resData")));
		}else{
			localStorage.setItem('resData',JSON.stringify(ResTestData.testData));
			setResData(localStorage.resData)
		}
	}, [state]);

	
	const filterRows = '';

	const handleSelectedResNo = (selectedNo) => {
		setSelected(selectedNo);
	}

	return (
		<div className={classes.root}>
		<Filter 
			state={state} setState={setState}
			selected={selected}
		/>
		<Card>
			<ResourceListTable resData={resData} selectedResNo={handleSelectedResNo}/>
		</Card>
		</div>
	);
}

export default ResourceList;
