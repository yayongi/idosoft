import React, { Fragment, useEffect } from 'react';
import Filter from './component/Filter'
import Body from './component/Body'
import Paper from '@material-ui/core/Paper';

import Axios from 'axios';

import ko from "date-fns/locale/ko";

import Moment from "moment";



import { processErrCode, isEmpty } from '../../../../js/util'

export default function  List(props) {
	const [state, setState] = React.useState({
		name: "",
		expenseType: "-1",
		payStDt: Moment().format('YYYY')+'01',
		payEdDt: Moment().format('YYYYMM'),
		status: "-1",
		memo: "",
	});

	const [rows, setRows] = React.useState([]);
	const [totalAmount, setTotalAmount] = React.useState(0);
	const [paging, setPaging] = React.useState({listCount : 0});
	const [ holdUp, setHoldUp ] = React.useState(0);     // 이미 가지고있는 페이지를 다시 호출하는 것을 막기 위해 사용
	
	// 페이징
    const [ page, setPage ] = React.useState(0);                 // 초기페이지가 0부터 시작
	const [ rowsPerPage, setRowsPerPage ] = React.useState(10); 
	
	useEffect(() => {
		console.log("call useEffect");

		Axios({
			url: '/intranet/getAnnaualList.exp',
			method: 'post',
			data: {
				currentPage : '1',
				limit : '10',
				payStDt: Moment().format('YYYY')+'01',
				payEdDt: Moment().format('YYYYMM'),
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			console.log(JSON.stringify(response.data));
			setRows(JSON.parse(response.data.list));
			setPaging(JSON.parse(response.data.result));
			setTotalAmount(response.data.totalAmount);
		}).catch(e => {
			processErrCode(e);
			console.log(e);
		});
		
	}, []);

	return (
		<Fragment>
			{console.log("call List.js -> return")}
			<Fragment>
				<Filter 
					filterRows={rows} filterSetRows={setRows}
					paging={paging} setPaging={setPaging}
					state={state} setState={setState}
					routeProps={props.routeProps}
					totalAmount={totalAmount} setTotalAmount={setTotalAmount}
					holdUp={holdUp} setHoldUp={setHoldUp}
					setPage={setPage} setRowsPerPage={setRowsPerPage}
				/>
			</Fragment>
			<Paper>
				<Body 
					rows={rows} 
					state={state}
					setRows={setRows}
					routeProps={props.routeProps} 
					paging={paging} setPaging={setPaging} 
					holdUp={holdUp} setHoldUp={setHoldUp}
					page={page} setPage={setPage}
					rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
				/>
			</Paper>
		</Fragment>
	);
}