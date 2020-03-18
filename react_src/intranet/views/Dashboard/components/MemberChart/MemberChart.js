import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,ResponsiveContainer } from 'recharts';
import { data_result } from './data'
import Title from '../Title';

export default function MemberChart(){
	const theme = useTheme();


	return (
		<React.Fragment>
			<Title>투입인원현황</Title>
			<ResponsiveContainer>
				<BarChart  data={data_result}>
					<XAxis dataKey="projectsite" stroke="#8884d8" />
					<YAxis />
					<Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
					
					<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
					<Bar dataKey="number" fill="#8884d8" barSize={30} />
				</BarChart>
			</ResponsiveContainer>
		</React.Fragment>
	);
}