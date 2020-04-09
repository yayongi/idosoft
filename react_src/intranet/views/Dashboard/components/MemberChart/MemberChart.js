import React,{ useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import { LabelList,BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,ResponsiveContainer } from 'recharts';
import Title from '../Title';

import {processErrCode } from '../../../../js/util';

export default function MemberChart(){
	const theme = useTheme();

	const [state, setState] =  React.useState(null);

	useEffect(() => {
		axios({
			url: '/intranet/projectDashboard',
			method: 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
		}).then(response => {
			let temp = response.data;
			temp = temp.filter(temp => temp.memberCount != "0");
			setState({
				data : temp
			});
;		}).catch(e => {
			processErrCode(e, false);
		});
	},[])

	return (
		<React.Fragment>
			<Title>투입인원현황</Title>
			{state != null && (
			<ResponsiveContainer>
				<BarChart height={250} data={state.data}>
					<XAxis dataKey="PROJECT_NM" stroke="#8884d8" tick={{ fontSize: '9px', width: '5px', maxChars : '3', wordWrap: 'break-word',display:"none" }}/>
					<YAxis interval={1}/>
					<Tooltip dataKey="PROJECT_NM" wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
					
					<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
					<Bar dataKey="memberCount" name="인원" fill="#8884d8" barSize={30}>
						<LabelList dataKey="PROJECT_NM" position="middle" />
					</Bar>
				</BarChart>
			</ResponsiveContainer>
			)}
		</React.Fragment>
	);
}