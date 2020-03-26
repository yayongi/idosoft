import React, { Fragment, useEffect } from 'react';
import Filter from './component/Filter'
import Body from './component/Body'
import Paper from '@material-ui/core/Paper';

import Axios from 'axios';
import { processErrCode, isEmpty } from '../../../../js/util'
export default function  List(props) {
	const [state, setState] = React.useState({
		name: "",
		expenseType: "-1",
		payStDt: "202003",
		payEdDt: "202003",
		status: "-1",
		memo: "",
	});
	const [rows, setRows] = React.useState([]);

	const [paging, setPaging] = React.useState({listCount : 0});
	useEffect(() => {
		console.log("call useEffect");

		Axios({
			url: '/intranet/getAnnaualList.exp',
			method: 'post',
			data: {
				currentPage : '1',
				limit : '10'
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			console.log(JSON.stringify(response.data));
			setRows(JSON.parse(response.data.list));
			setPaging(JSON.parse(response.data.result));
			
		}).catch(e => {
			processErrCode(e);
			console.log(e);
		});
		
	}, [state]);

	return (
		<Fragment>
			{console.log("call List.js -> return")}
			<Fragment>
				<Filter 
					filterRows={rows}
					state={state} setState={setState}
					routeProps={props.routeProps}
				/>
			</Fragment>
			<Paper>
				<Body 
					rows={rows} 
					setRows={setRows}
					routeProps={props.routeProps} 
					paging={paging} 
					setPaging={setPaging} 
				/>
			</Paper>
		</Fragment>
	);
}