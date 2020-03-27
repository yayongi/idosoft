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
	seeMore: {
		marginTop: theme.spacing(3),
	},
}));

const Notice = () => {

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
			console.log(e);
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
			<Table size="x-small">
				<TableHead>
					<TableRow>
						<TableCell>제목</TableCell>
						<TableCell>일자</TableCell>
						<TableCell>작성자</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(state != null) && state.map(datum => (
						<TableRow key={datum.board_no} onClick={event => openContentModal(datum.title, datum.content)} style={{cursor : "pointer"}}>
							<TableCell>{datum.title}</TableCell>
							<TableCell>{datum.reg_datetime}</TableCell>
							<TableCell>{datum.writer}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</React.Fragment>
	);
}

export default Notice;
