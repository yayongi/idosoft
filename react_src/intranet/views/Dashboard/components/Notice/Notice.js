import React from 'react';
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
import Title from '../Title';
import { data } from './data';

const useStyles = makeStyles(theme => ({
	seeMore: {
		marginTop: theme.spacing(3),
	},
}));

export default function Notice() {
	const classes = useStyles();
	return (
		<React.Fragment>
			<Title>
				<ResponsiveContainer>
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
				</ResponsiveContainer>
			</Title>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>제목</TableCell>
						<TableCell>일자</TableCell>
						<TableCell>작성자</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map(datum => (
						<TableRow key={datum.id}>
							<TableCell>{datum.title}</TableCell>
							<TableCell>{datum.date}</TableCell>
							<TableCell>{datum.writer}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</React.Fragment>
	);
}