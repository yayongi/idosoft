import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import SelectType from '../component/SelectType';
import InputSearch from '../component/InputSearch';

const useToolbarStyles = makeStyles(theme => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	title: {
		flex: '1 1 100%',
	},	
	fab: {
		position: 'absolute',
		top: theme.spacing(13),
		right: theme.spacing(5),
	},
	saveIcon: {
		marginRight: theme.spacing(1)
	},
	buttonRoot: {
		position: 'absolute',
		top: theme.spacing(13),
		right: theme.spacing(5),
		margin: theme.spacing(1)
	},
	button: {
		// minWidth: 100,
		// minHeight: 40
	}
}));

const NoticeListTool = ({props}) => {
	const classes = useToolbarStyles();
	//   const { numSelected } = props;

	const setting= {label: "검색타입", list:[ {key:1, value:"test"}, {key:2, value:"test2"}, {key:3, value:"test3"} ] };

	// const excelDownload = (e) => {
	// 	alert('엑셀다운로드 실행');
	// }

	const handleDeleteRes = e => {
		// ResTestData.testData
		// for(var i=0; i<ResTestData.testData.length; i++){
		// 	if(ResTestData.testData[i].resNo == ...props)
		// }
	}


	return (
		<React.Fragment>
		{/* <Card> */}
			<CardContent>
				<Typography className={classes.title} variant="h6" id="tableTitle">
					공지사항
				</Typography>

				{/* <Tooltip title="Filter list"> */}
					{/* <IconButton aria-label="filter list">
						<FilterListIcon />
					</IconButton> */}
					<div className={classes.buttonRoot}>
					<RouterLink button="true" to="/resource/regist">
						<Button variant="contained" color="primary" className={classes.button}>
							등록
						</Button>
					</RouterLink>
					<Button variant="contained" color="secondary" className={classes.button} onClick={handleDeleteRes}>
							삭제
					</Button>
					</div>
			{/* </Tooltip> */}
			</CardContent>

			<CardContent>
				<Toolbar>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={3}>
							<SelectType props={setting}/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<InputSearch/>
						</Grid>
						<Grid item xs={12} sm={3} style={{textAlign:"right"}}>
						</Grid>
						<Grid item xs={12} sm={3} >
							조회건수
							{/* <Fab variant="extended" color="primary" aria-label="add" onClick={excelDownload}>
								<SaveIcon className={classes.saveIcon} />
								엑셀다운로드
							</Fab> */}
						</Grid>
					</Grid>
				</Toolbar>
			</CardContent>
		{/* </Card> */}
		</React.Fragment>
	);
};

NoticeListTool.propTypes = {
//   numSelected: PropTypes.number.isRequired,
};

export default NoticeListTool;