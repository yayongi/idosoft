import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FaceIcon from '@material-ui/icons/Face';

export default function Top(props) {
	const {classes} = props;
	return (
		<AppBar position="fixed" className={classes.appBar}>
			<Toolbar>
				<Typography variant="h6" noWrap className={classes.title}>
					IDO-SOFT 인트라넷
				</Typography>
				<IconButton color="inherit" component={RouterLink} to="/signIn">
					<FaceIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}