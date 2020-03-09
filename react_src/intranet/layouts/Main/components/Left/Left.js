import React from 'react';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuList from './components/MenuList'

export default function Left(props) {
	const {classes, handleDrawerClose, open} = props;

		// 왼쪽 메뉴 리스트 
	const drawer = (
		<div>
			<div className={classes.toolbarIcon}>
				<IconButton onClick={handleDrawerClose}>
					<ChevronLeftIcon />
				</IconButton>
			</div>
			<Divider />
			<MenuList/>
		</div>
	);

	return (
		<nav className={classes.drawer} aria-label="mailbox folders">
			{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
			<Hidden smUp implementation="css">
				<Drawer
					variant="temporary"
					anchor={classes.direction === 'rtl' ? 'right' : 'left'}
					open={open}
					onClose={handleDrawerClose}
					classes={{
						paper: classes.drawerPaper,
					}}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
				>
					{drawer}
				</Drawer>
			</Hidden>
			<Hidden xsDown implementation="css">
				<Drawer
					classes={{
						paper: classes.drawerPaper,
					}}
					variant="permanent"
					open
				>
					{drawer}
				</Drawer>
			</Hidden>
		</nav>	
	);
}
