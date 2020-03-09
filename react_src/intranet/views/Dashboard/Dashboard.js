import React, {Fragment} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import {
	Chart, Deposits, Orders
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
				<Grid item xs={12} md={8} lg={9}>
					<Paper className={fixedHeightPaper}>
						<Chart />
					</Paper>
				</Grid>
				{/* Recent Deposits */}
				<Grid item xs={12} md={4} lg={3}>
					<Paper className={fixedHeightPaper}>
						<Deposits />
					</Paper>
				</Grid>
				{/* Recent Orders */}
				<Grid item xs={12}>
					<Paper className={classes.paper}>
						<Orders />
					</Paper>
				</Grid>
			</Grid>
			<Box pt={4}>
				<Copyright />
			</Box>
		</Fragment>
	);
}