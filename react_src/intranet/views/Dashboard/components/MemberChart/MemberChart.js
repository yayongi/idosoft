import React,{ useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,ResponsiveContainer } from 'recharts';
import { data_result } from './data'
import Title from '../Title';

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
			console.log("result : " + JSON.stringify(response));
			//etState(response.data)
;		}).catch(e => {
			console.log(e);
		});
	},[])

	return (
		<React.Fragment>
			<Title>투입인원현황</Title>
			<ResponsiveContainer>
				{state != null && (
				<BarChart  data={data_result}>
					<XAxis dataKey="projectsite" stroke="#8884d8" />
					<YAxis />
					<Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
					
					<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
					<Bar dataKey="인원" fill="#8884d8" barSize={30} />
				</BarChart>
				)}
			</ResponsiveContainer>
		</React.Fragment>
	);
}