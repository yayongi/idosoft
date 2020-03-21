import React, { Fragment, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
// import AccountTreeIcon from '@material-ui/icons/AccountTree';

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
		color: '#37474f',
	},
}));
let preUrl = "";
let menuCss = {};
export default function MenuList(props) {
	const classes = useStyles();
	const [active, setActive] = useState({});
	const {routeProps, handleDrawerClose} = props;		// handleDrawerClose : 메뉴바 열기/닫기 이벤트
	const {match} = routeProps;
	
	function urlMatch() {
		if(preUrl != match.url) {
			preUrl = match.url;
			
			for(let i=0; i<menus.length; i++) {
				let menu = menus[i], submenu = menus[i].submenu;
				// 메뉴 목록에서 url 이 포함되어 있는 목록의 타이틀을 추출
				// location.href 값은 이전 URL 을 가져오므로 Router의 Props를 이용해야 됨.
				if(match.url.includes(menu.href)) {
					menuCss[menu.title] = classes.active;
				} else {
					menuCss[menu.title] = classes.inactive;
				}
				if(submenu != undefined && submenu.length > 0) {
					for(let j=0; j<submenu.length; j++) {
						if(match.url.includes(submenu[j].href)) {
							menuCss[submenu[j].title] = classes.active;
						} else {
							menuCss[submenu[j].title] = classes.inactive;
						}
					}
				}
			}
		}
		
	}
	
	React.useEffect(()=>{
		urlMatch();
		setActive(match.url);	// URL이 변경될 때, 상태 변경을 한다.
	});
	
	
	return (
		<>
			<List>
				{menus.map((item, idx) => {

					
					if(item.submenu != undefined && item.submenu.length > 0) {
						{/* 2Depth를 포함하는 메뉴 출력 */}
						return (
							<Fragment key={idx}>
								{/* 1Depth 메뉴 */}		
								<ListItem button 
									component={RouterLink} to={item.submenu[0].href} onClick={handleDrawerClose}>
									<ListItemIcon className={menuCss[item.title]}>
										{item.icon}
									</ListItemIcon>
									<ListItemText primary={item.title} disableTypography={true} className={menuCss[item.title]}/>
								</ListItem>
								{/* 2Depth 메뉴 */}		
								<List component="div" disablePadding>
									{
										item.submenu.map((subItem, subIdx) => (
											<ListItem key={subIdx} button 
												className={classes.nested} component={RouterLink} to={subItem.href} onClick={handleDrawerClose}>
												<ListItemIcon className={menuCss[subItem.title]}>
													{subItem.icon}
												</ListItemIcon>
												<ListItemText secondary={subItem.title} disableTypography={true} className={menuCss[subItem.title]} />
											</ListItem>
										))
									}
								</List>
							</Fragment>
						)
					} else {
						{/* 1Depth 메뉴 출력 */}
						return (
							<Fragment key={idx}>
								{	// 관리자인 경우 => 관리자 메뉴가 늘어나면 이부분이 1번만 호출되도록 추가 개발이 필요!!!
									item.admin && (
										<Fragment key={'admin' + idx}>
											<Divider key={'adminDevider' + idx} />
											<ListSubheader key={'listSubHeader' + idx} inset>Administrator</ListSubheader>
										</Fragment>
									)
								}
								<ListItem key={'listItem' + idx} button 
									component={RouterLink} to={item.href} onClick={handleDrawerClose}>
									<ListItemIcon className={menuCss[item.title]}>
										{item.icon}
									</ListItemIcon>
									<ListItemText primary={item.title} disableTypography={true} className={menuCss[item.title]} />
								</ListItem>
							</Fragment>
						)
					}
				})}
			</List>
			<Divider />
			{/* <List>
					<ListSubheader inset>Administrator</ListSubheader>
					<ListItem button component={RouterLink} to="/admin/code">
						<ListItemIcon>
							<AccountTreeIcon />
						</ListItemIcon>
						<ListItemText primary="코드관리" />
					</ListItem>
			</List>
			<Divider /> */}
		</>		
	);
}
