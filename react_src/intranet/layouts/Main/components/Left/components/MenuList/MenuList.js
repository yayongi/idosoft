import React, {Fragment} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import CreditCard from '@material-ui/icons/CreditCard';
import DesktopMac from '@material-ui/icons/DesktopMac';
// import menus from './data' 
// import ExpandLess from '@material-ui/icons/ExpandLess';
// import ExpandMore from '@material-ui/icons/ExpandMore';


const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
}));

export default function MenuList() {
	const classes = useStyles();
/* 	// 하위 메뉴 열고 닫는 이벤트 주석처리 - 20200319.오경섭
	const [openStep4, setOpenStep4] = React.useState(false);	
	const [openStep5, setOpenStep5] = React.useState(false);

	const handleToggle = (step) => {
		if(step == 4) {
			setOpenStep4(!openStep4);
		} else {
			setOpenStep5(!openStep5);
		}
		
	}; */

	const handleClick = (event) => {
		event.target.style.color="blue";
	}

	return (
		<Fragment>
			<List>
				<ListItem button component={RouterLink} to="/dashboard">
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary="Dashboard"/>
				</ListItem>
				<ListItem button component={RouterLink} to="/member/memberlist">
					<ListItemIcon>
						<PeopleIcon />
					</ListItemIcon>
					<ListItemText primary="사원관리" />
				</ListItem>
				<ListItem button component={RouterLink} to="/resource">
					<ListItemIcon>
						<DesktopMac />
					</ListItemIcon>
					<ListItemText primary="자원관리" />
				</ListItem>
				<ListItem button component={RouterLink} to="/notice">
					<ListItemIcon>
						<AssignmentIcon />
					</ListItemIcon>
					<ListItemText primary="공지사항" />
				</ListItem>
				<ListItem button onClick={() => handleToggle(4)}>
					<ListItemIcon>
						<BarChartIcon />
					</ListItemIcon>
					<ListItemText primary="프로젝트" />
					{/* 부모메뉴 우측 아이콘 표시 주석처리 - 20200319.오경섭*/}
					{/* {openStep4 ? <ExpandLess /> : <ExpandMore />} */}
				</ListItem>
				<Collapse in={true} timeout="auto" unmountOnExit>  
					<List component="div" disablePadding>
						<ListItem button className={classes.nested} component={RouterLink} to="/project/history">
							<ListItemIcon>
								<SubdirectoryArrowRightIcon fontSize="small"/>
							</ListItemIcon>
							<ListItemText secondary="이력관리" />
						</ListItem>
						<ListItem button className={classes.nested} component={RouterLink} to="/project/manage">
							<ListItemIcon>
								<SubdirectoryArrowRightIcon fontSize="small"/>
							</ListItemIcon>
							<ListItemText secondary="프로젝트관리" />
						</ListItem>
					</List>
				</Collapse>

				<ListItem button onClick={() => handleToggle(5)}>
					<ListItemIcon>
						<CreditCard />
					</ListItemIcon>
					<ListItemText primary="경비관리" />
					{/* 부모메뉴 우측 아이콘 표시 주석처리 - 20200319.오경섭*/}
					{/* {openStep4 ? <ExpandLess /> : <ExpandMore />} */}
				</ListItem>
				<Collapse in={true} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItem button className={classes.nested} component={RouterLink} to="/expense/annualList">
							<ListItemIcon>
								<SubdirectoryArrowRightIcon fontSize="small"/>
							</ListItemIcon>
							<ListItemText secondary="경비관리목록" />
						</ListItem>
						<ListItem button className={classes.nested} component={RouterLink} to="/expense/approvalList">
							<ListItemIcon>
								<SubdirectoryArrowRightIcon fontSize="small"/>
							</ListItemIcon>
							<ListItemText secondary="경비결재관리목록" />
						</ListItem>
						<ListItem button className={classes.nested} component={RouterLink} to="/expense/payList">
							<ListItemIcon>
								<SubdirectoryArrowRightIcon fontSize="small"/>
							</ListItemIcon>
							<ListItemText secondary="교통/통신비관리목록" />
						</ListItem>
						<ListItem button className={classes.nested} component={RouterLink} to="/expense/monthyStatMSelectView">
							<ListItemIcon>
								<SubdirectoryArrowRightIcon  fontSize="small"/>
							</ListItemIcon>
							<ListItemText secondary="경비월별통계" />
						</ListItem>
					</List>
				</Collapse>
			</List>
			<Divider />
			<List>
					<ListSubheader inset>Administrator</ListSubheader>
					<ListItem button component={RouterLink} to="/admin/code">
						<ListItemIcon>
							<AccountTreeIcon />
						</ListItemIcon>
						<ListItemText primary="코드관리"/>
					</ListItem>
			</List>
			<Divider />
		</Fragment>		
	);
}
