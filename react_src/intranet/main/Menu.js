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
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


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

export default function Menu() {
	const classes = useStyles();
	const [openStep4, setOpenStep4] = React.useState(false);	// React Hooks 참조 필
	const [openStep5, setOpenStep5] = React.useState(false);

	const handleToggle = (step) => {
		if(step == 4) {
			setOpenStep4(!openStep4);
		} else {
			setOpenStep5(!openStep5);
		}
		
	};

	return (
		<Fragment>
			<List>
				<ListItem button component={RouterLink} to="/main">
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary="Dashboard"/>
				</ListItem>
				<ListItem button component={RouterLink} to="/member">
					<ListItemIcon>
						<PeopleIcon />
					</ListItemIcon>
					<ListItemText primary="사원관리" />
				</ListItem>
				<ListItem button component={RouterLink} to="/resource">
					<ListItemIcon>
						<PeopleIcon />
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
					{openStep4 ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={openStep4} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItem button className={classes.nested} component={RouterLink} to="/project/history">
							<ListItemIcon>
								<SubdirectoryArrowRightIcon />
							</ListItemIcon>
							<ListItemText primary="이력관리" />
						</ListItem>
						<ListItem button className={classes.nested} component={RouterLink} to="/project/manage">
							<ListItemIcon>
								<SubdirectoryArrowRightIcon />
							</ListItemIcon>
							<ListItemText primary="프로젝트관리" />
						</ListItem>
					</List>
				</Collapse>

				<ListItem button onClick={() => handleToggle(5)}>
					<ListItemIcon>
						<AccountBalanceWalletIcon />
					</ListItemIcon>
					<ListItemText primary="경비관리" />
					{openStep5 ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={openStep5} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItem button className={classes.nested} component={RouterLink} to="/expense/annualList">
							<ListItemIcon>
								<SubdirectoryArrowRightIcon />
							</ListItemIcon>
							<ListItemText primary="경비관리목록" />
						</ListItem>
						<ListItem button className={classes.nested} component={RouterLink} to="/expense/payList">
							<ListItemIcon>
								<SubdirectoryArrowRightIcon />
							</ListItemIcon>
							<ListItemText primary="교통/통신비관리" />
						</ListItem>
						<ListItem button className={classes.nested} component={RouterLink} to="/expense/approval">
							<ListItemIcon>
								<SubdirectoryArrowRightIcon />
							</ListItemIcon>
							<ListItemText primary="경비결재관리" />
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
						<ListItemText primary="코드관리" />
					</ListItem>
			</List>
			<Divider />
		</Fragment>		
	);
}
