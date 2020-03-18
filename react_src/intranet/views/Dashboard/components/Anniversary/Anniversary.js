import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../Title';
import { data } from './data';
import { dateFormatter } from '../../../../js/util';

const useStyles = makeStyles({
	depositContext: {
		flex: 1,
	},
});

export default function Anniversary() {
	const classes = useStyles();

	return (
		<React.Fragment>
			<Title>기념일</Title>
			{data.map(datum => (
				<h3>
					{
						datum.birth !== undefined? 
						dateFormatter(datum.birth).substring(5,10)+"은 "+datum.name+"님의 생일입니다."
						: dateFormatter(datum.mar_date).substring(5,10)+"은 "+datum.name+"님의 결혼기념일입니다." 
					}				
				</h3>
			))}
		</React.Fragment>
	);
}