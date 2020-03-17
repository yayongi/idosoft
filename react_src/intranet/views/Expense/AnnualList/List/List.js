import React, { Fragment, useEffect } from 'react';
import Filter from './component/Filter'
import Body from './component/Body'
import Paper from '@material-ui/core/Paper';
import { AnnualStorage } from '../data';

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

	useEffect(() => {
		console.log("call List.js -> useEffect");
		setRows(JSON.parse(AnnualStorage.getItem("ANNUAL_LIST")));
	}, [state]);

	// 검색 필터링된 데이터
	const getFilterRows = () => {
		console.log("call List.js -> filterRows");
		return (rows.filter((row) => {
			let result = true;
			let tmpPayDate = row.payDate.replace(/-/g, '').slice(0,6);
			
			if(state.name != "" && !row.register.includes(state.name)) {
				result = false;
			} else if(state.expenseType != "-1" && row.expenseType != state.expenseType) {
				result = false;
			} else if(Number(state.payStDt) > Number(tmpPayDate) 
					|| Number(state.payEdDt) < Number(tmpPayDate)) {
				result = false;
			} else if(state.status != "-1" && row.status != state.status) {
				result = false;
			} else if(state.memo != "" && !row.memo.includes(state.memo)) {
				result = false;
			}
			
			return result;
		})).map((row, i, arr) => {
			row.num = arr.length - i;
			return row;
		});
	}
	const filterRows = getFilterRows();


	return (
		<Fragment>
			{console.log("call List.js -> return")}
			<Fragment>
				<Filter 
					filterRows={filterRows}
					state={state} setState={setState}
				/>
			</Fragment>
			<Paper>
				<Body rows={filterRows} routeProps={props.routeProps} />
			</Paper>
		</Fragment>
	);
}