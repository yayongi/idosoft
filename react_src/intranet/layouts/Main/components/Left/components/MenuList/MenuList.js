import React, { Fragment, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { menus } from './data';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
	active: {
		color: '#1565c0',
		fontWeight: 600
	},
	inactive: {
		color: 'gray',
	},
}));
let temp = {};
export default function MenuList() {
	const classes = useStyles();
	const [active, setActive] = useState({"Dashboard":classes.active});
	
	const handleClick = (event, item) => {
		temp = {
			[item.title] : classes.active 
		}
		setActive(temp);
	}

	return (
		<>
			<List>
				{menus.map((item, idx) => {
					
					if(item.submenu != undefined && item.submenu.length > 0) {
						return (
							<Fragment key={idx}>
								<ListItem button component={RouterLink} to={item.href} 
									onClick={() => handleClick(event, item.submenu[0])}>
									<ListItemIcon>
										{item.icon}
									</ListItemIcon>
									<ListItemText primary={item.title}/>
								</ListItem>
								<Collapse in={true} timeout="auto" unmountOnExit>  
									<List component="div" disablePadding>
										{
											item.submenu.map((subItem, subIdx) => (
												<ListItem key={subIdx} button 
													className={classes.nested} component={RouterLink} to={subItem.href}
													onClick={() => handleClick(event, subItem)}>
													<ListItemIcon className={active[subItem.title]}>
														{subItem.icon}
													</ListItemIcon>
													<ListItemText secondary={subItem.title} disableTypography={true} className={active[subItem.title]} />
												</ListItem>
											))
										}
									</List>
								</Collapse>
							</Fragment>
						)
					} else {
						return (
							<ListItem key={idx} button 
								component={RouterLink} to={item.href} 
								onClick={() => handleClick(event, item)}>
								<ListItemIcon className={active[item.title]}>
									{item.icon}
								</ListItemIcon>
								<ListItemText primary={item.title} disableTypography={true} className={active[item.title]} />
							</ListItem>
						)
					}
				})}
			</List>
			<Divider />
		</>		
	);
}
