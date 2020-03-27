import React, {Component, useDebugValue, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import ResourceListTable from './ResourceListTable';
import Filter from '../component/Filter';
import { useStaticState } from '@material-ui/pickers';

import axios from 'axios';

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
	
	const classes = useStyles();

	const initState = {
		holder: "",
		resType: '-1',
		stDt: null,
		edDt: null,
	}
	const [state, setState] = React.useState(initState);
	const [resData, setResData] = useState([{}]);
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
