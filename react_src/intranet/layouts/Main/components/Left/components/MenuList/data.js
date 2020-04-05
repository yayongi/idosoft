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
		isAdminMenu: false,
	},
	{
		title: '사원관리',
		href: '/member',
		icon: <PeopleIcon />, 
		isAdminMenu: false,
	},
	{
		title: '자원관리',
		href: '/resource',
		icon: <DesktopMac />, 
		isAdminMenu: false,
	},
	{
		title: '공지사항',
		href: '/notice',
		icon: <AssignmentIcon />,
		isAdminMenu: false, 
	},
	{
		title: '프로젝트',
		href: '/project',
		icon: <BarChartIcon />, 
		isAdminMenu: false,
		submenu: [
			{
				title: '이력관리',
				href: '/project/history',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
				isAdminMenu: false,
			},
			{
				title: '프로젝트관리',
				href: '/project/manage',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
				isAdminMenu: false,
			},
		]
	},
	{
		title: '경비',
		href: '/expense',
		icon: <CreditCard />, 
		isAdminMenu: false,
		submenu: [
			{
				title: '경비관리',
				href: '/expense/annualList',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
				isAdminMenu: false,
			},
			{
				title: '경비결재관리',
				href: '/expense/approvalList',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
				isAdminMenu: false,
			},
			{
				title: '교통/통신비 조회',
				href: '/expense/payList',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
				isAdminMenu: false,
			},
			{
				title: '경비월별통계',
				href: '/expense/monthyStatMSelectView',
				icon: <SubdirectoryArrowRightIcon fontSize="small"/>, 
				isAdminMenu: true,
			},
		]
	},
	{
		title: '코드관리',
		href: '/admin/code',
		icon: <AccountTreeIcon />,
		isAdminMenu: true, 
	},
]
