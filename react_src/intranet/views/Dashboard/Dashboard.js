import React, {Fragment, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link'

import {getSessionMemberInfo} from '../../js/util';

import {
	MemberChart, Anniversary, Notice
} from './components'

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	fixedHeight: {
		height: 240,
	},
}));

function Copyright() {

	/* useEffect(() => {		// render 완료 후, 호출
		getSessionMemberInfo(); // 회원정보 세션을 세션스토리지에 저장
	}, []); */

	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="http://www.ido-soft.co.kr/">
				IDO-SOFT
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

export default function Dashboard() {
	const classes = useStyles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

	return (
		<Fragment>
			<Grid container spacing={3}>
				{/* Chart */}
				<Grid item xs={12}>
					<Paper className={fixedHeightPaper}>
						<MemberChart />
					</Paper>
				</Grid>
				{/* Notice*/}
				<Grid item xs={12} md={6} lg={6}>
					<Paper className={fixedHeightPaper}>
						<Notice/>
					</Paper>
				</Grid>
				{/* Date */}
				<Grid item xs={12} md={6} lg={6}>
					<Paper className={fixedHeightPaper}>
						<Anniversary />
					</Paper>
				</Grid>
			</Grid>
			<Box pt={4}>
				<Copyright />
			</Box>
		</Fragment>
	);
}