import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import CreditCard from '@material-ui/icons/CreditCard';
import DesktopMac from '@material-ui/icons/DesktopMac';


export const menus = [
	{
		title: 'Dashboard',
		href: '/dashboard',
		icon: <DashboardIcon />, 
	},
	{
		title: '사원관리',
		href: '/member',
		icon: <PeopleIcon />, 
	},
	{
		title: '자원관리',
		href: '/resource',
		icon: <DesktopMac />, 
	},
	{
		title: '공지사항',
		href: '/notice',
		icon: <AssignmentIcon />, 
	},
	{
		title: '프로젝트',
		href: '/project',
		icon: <BarChartIcon />, 
		submenu: [
			{
				title: '이력관리',
				href: '/project/history',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
			},
			{
				title: '프로젝트관리',
				href: '/project/manage',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
			},
		]
	},
	{
		title: '경비관리',
		href: '/expense',
		icon: <CreditCard />, 
		submenu: [
			{
				title: '경비관리목록',
				href: '/expense/annualList',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
			},
			{
				title: '경비결재관리목록',
				href: '/expense/approvalList',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
			},
			{
				title: '교통/통신비관리목록',
				href: '/expense/payList',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
			},
			{
				title: '경비월별통계',
				href: '/expense/monthyStatMSelectView',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
			},
		]
	},
	{
		title: '코드관리',
		href: '/admin/code',
		icon: <AccountTreeIcon />,
		admin: true, 
	},
]
