import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import { Divider, Button, Grid, Hidden } from '@material-ui/core';

import { getSiteInfoDB } from '../../data';


import { Link as RouterLink } from 'react-router-dom';

const useToolbarStyles = makeStyles(theme => ({
	root: {
		// justifyContent: 'flex-end',
		 '& > *': {
			margin: theme.spacing(1),
		},
		flexGrow: 1,
	},
	title: {
		flex: '1',
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	button: {
		marginRight: '10px',
	}
}));

/*
	경비관리목록 검색영역
*/
export default function HistorySearchDiv(props) {
	
	const classes = useToolbarStyles();
	const {username, excelDownLoad} = props;

	const handleClickExcelBtn = () => {
		excelDownLoad();
	}

	return (
		<Fragment>
			<Toolbar className={classes.root}>
				<Typography className={classes.title} color="secondary" variant="subtitle2">					
					이력관리 - {username}
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						<RouterLink button="true" to="/project/history/new">
							<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} >
								이력 등록 
							</Button>
						</RouterLink>
						<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} className={classes.button} onClick={handleClickExcelBtn}>
							엑셀 내보내기
						</Button>
					</Hidden>
					<Hidden mdUp>
						<RouterLink button="true" to="/project/history/new">
							<IconButton color="primary" className={classes.button}>
								<AddIcon />
							</IconButton>
						</RouterLink>
						<IconButton color="primary" onClick={handleClickExcelBtn}>
							<SaveIcon />
						</IconButton>
					</Hidden>
				</div>
			</Toolbar>
		</Fragment>
				
	);
}