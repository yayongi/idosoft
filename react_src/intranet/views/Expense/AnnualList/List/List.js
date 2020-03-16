import React, { Fragment } from 'react';
import Filter from './component/Filter'
import Body from './component/Body'
import Paper from '@material-ui/core/Paper';
import { Divider } from '@material-ui/core';
import { rows } from './data';

export default function  List() {
	const [state, setState] = React.useState({
		name: "",
		expenseType: "-1",
		payStDt: "202003",
		payEdDt: "202003",
		status: "-1",
		memo: "",
	});

	// 총 결제금액
	let totalSum = 0; 
	rows.map((row) => {
		totalSum += Number(row.pay);
	});

	// 검색 필터링된 데이터
	const filterRows = () => {
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

	return (
		<Fragment>
			<Paper elevation={0} style={{marginBottom:"10px"}}>
				<Filter 
					totalSum={totalSum}
					state={state} setState={setState}					
				/>
			</Paper>
			<Divider />
			<Paper>
				<Body rows={filterRows()} />
			</Paper>
		</Fragment>
	);
}