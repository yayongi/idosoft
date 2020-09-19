import React, {Fragment, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link'
import axios from 'axios';

import {
	MemberChart, Anniversary, Notice
} from './components'

import CommonDialog from '../../js/CommonDialog';
import { getRootPath, processErrCode } from '../../js/util';

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	fixedHeight: {
		height: 240,
	}
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

	//브라우저 뒤로가기 버튼 제어
	 history.pushState(null, null, location.href);
	 window.onpopstate = function () {
	 	handleOpenDialog(...confirmData);
	 };


	// confirm, alert 창 함수
  	// 초기값은 {}로 설정하고 온오프시  {title:'', content:'', onOff:'true of false'} 형식으로 setting됨.
	const [dialog, setDialog] = React.useState({});

	// Dialog창의 title과 content, confirm여부  담는 배열
	// 배열 없이도 파라미터 입력해서 사용가능
	const confirmData = ['로그아웃', '로그아웃하시겠습니까?', true];

	//Dialog open handler
	const handleOpenDialog = (title, content, isConfirm) => {
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	const handleCloseDialog = (title,result) => {
	setDialog({title:'', content:'', onOff:false, isConfirm:false});
		if(result){
			// 로그아웃 처리
			axios({
				url: '/intranet/logout',
				method: 'post',
				data: {}
			}).then(response => {
				sessionStorage.removeItem("loginSession");
				location.href = getRootPath() +'/#/signIn';
			}).catch(e => {
				processErrCode(e, false);
				console.log(e);
			});

		}else{
			return;
		}
	}

	return (
		<Fragment>
			<CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
			<Grid container spacing={3}>
				{/* Chart */}
				<Grid item xs={12}>
					<Paper className={fixedHeightPaper}>
						<MemberChart />
					</Paper>
				</Grid>
				{/* Notice*/}
				<Grid item xs={12} md={6} lg={6}>
					<Paper className={classes.paper}>
						<Notice/>
					</Paper>
				</Grid>
				{/* Date */}
				<Grid item xs={12} md={6} lg={6}>
					<Paper className={classes.paper}>
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