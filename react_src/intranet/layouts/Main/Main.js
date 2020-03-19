import React, {cloneElement} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';


import Top from './components/Top';		// 메뉴 목록
import Left from './components/Left';		// 메뉴 목록


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},

	title: {
		flexGrow: 1,
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	},
}));

export default function Main(props) {	
	const classes = useStyles();	
	const [open, setOpen] = React.useState(false);
	const {routeProps} = props;
	// 왼쪽 메뉴바 열기
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	// 왼쪽 메뉴바 닫기
	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<CssBaseline />
			<Top classes={classes} handleDrawerOpen={handleDrawerOpen}/>
			<Left classes={classes} open={open} handleDrawerClose={handleDrawerClose} routeProps={routeProps}/>
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth="lg" className={classes.container}>
					{/* 상위컴포넌트에서 child element를 포함하고 있을 경우에 children으로 넘어온다.*/}
					{cloneElement(props.children)}		
				</Container>
			</main>
		</div>
	);
}