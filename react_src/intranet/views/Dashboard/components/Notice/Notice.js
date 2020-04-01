import React ,{ useEffect }from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import { Link as RouterLink, } from 'react-router-dom';
import { ResponsiveContainer } from 'recharts';
import AddIcon from '@material-ui/icons/Add';
import ContentModal from "./ContentModal";

import Title from '../Title';
import { data } from './data';

const useStyles = makeStyles(theme => ({
	alignCenter : {
		textAlign:"center"
	},
	maxWidth : {
		maxWidth : "100px"
	},
	overflowCon : {
		whiteSpace:"nowrap",
		overflow:"hidden",
		textOverflow:"ellipsis"
	},
	textBold : {
		fontWeight:600
	}
}));

const Notice = () => {
	const classes = useStyles();
	
	const [state, setState] =  React.useState(null);
	
	useEffect(() => {
		axios({
			url: '/intranet/notice/dashboardList',
			method: 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
		}).then(response => {
			setState(response.data)
;		}).catch(e => {
		});
	},[])

	const [openModal, setOpenModal] = React.useState({
		title:'', 
		content:'', 
		openModal:false,
	});

	const openContentModal = (Title, Content) => {
		return setOpenModal({
			title:Title, 
			content:Content, 
			openModal:true,
		});
	  }
	  
	const handleCloseModal = (trigger) => {
		return setOpenModal({
			title:'', 
			content:'', 
			openModal:trigger,
		});

	}

	return (
		<React.Fragment>
			<ContentModal props={openModal} closeModal={handleCloseModal}/>
			<Title>
				<Grid container spacing={2}>
					<Grid item xs={12} xs={6} >
						공지사항 
					</Grid>
					<Grid item xs={12} xs={6}  style={{textAlign:"right"}}>
						<RouterLink button="true" to="/notice">
							<AddIcon style={{verticalAlign:"center"}}/>
						</RouterLink>
					</Grid>
				</Grid>
			</Title>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell className={`${classes.alignCenter} ${classes.maxWidth}`}>제목</TableCell>
						<TableCell className={classes.alignCenter}>일자</TableCell>
						<TableCell className={classes.alignCenter}>작성자</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(state != null) && state.map(datum => (
						<TableRow key={datum.board_no} onClick={event => openContentModal(datum.title, datum.content)} style={{cursor : "pointer"}}>
							<TableCell className={`${classes.alignCenter} ${classes.maxWidth} ${classes.overflowCon} ${datum.major_period_date != null?  classes.textBold: null}`}>{datum.title}</TableCell>
							<TableCell className={`${classes.alignCenter} ${datum.major_period_date != null?  classes.textBold: null}`}>{datum.reg_datetime}</TableCell>
							<TableCell className={`${classes.alignCenter} ${datum.major_period_date != null?  classes.textBold: null}`}>{datum.writer}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</React.Fragment>
	);
}

export default Notice;
