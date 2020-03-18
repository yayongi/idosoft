import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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

	console.log("test : " + data.birth);

	return (
		<React.Fragment>
			<Title>기념일</Title>
			<Typography color="textSecondary" className={classes.depositContext}>
				{dateFormatter(data.birth)}은 {data.name}님의 생일입니다.
      		</Typography>
		</React.Fragment>
	);
}