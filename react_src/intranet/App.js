
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Switch, Redirect } from 'react-router-dom';
import { Main as MainLayout, Minimal as MinimalLayout  } from './layouts';
import {
	Code as Code,
	AddCode as AddCode,
	ModifyCode as ModifyCode,
	Dashboard as Dashboard,
	AnnualList as AnnualList,
	AnnualResister as AnnualResister,
	PayList as PayList,
	ApprovalList as ApprovalList,
	ApprovalDetail as ApprovalDetail,
	MonthlystatMemberSelectView as MonthlystatMemberSelectView,
	SignIn as SignIn,
	ResPassword as ResPassword,

	MemberList as MemberList,
	MemberReg as MemberReg,
	MemberMod_user as MemberMod_user,
	MemberMod_admin as MemberMod_admin,
	Notice as Notice,
	Member as Member,
	NoticeList as NoticeList,
	NoticeRegist as NoticeRegist,
  
	History as History,
	Manage as Manage,
	ResourceList as ResourceList,
	ResourceRegist as ResourceRegist,
	NotFound as NotFound
} from './views';

export default function App() {
	return (
		<Router>
			<div>
				<Switch>
					<Redirect
						exact
						from="/"
						to="/dashboard"
					/>
					<Route exact path="/dashboard">
						<MainLayout><Dashboard /></MainLayout>
					</Route>
					<Route exact path="/signIn">
						<MinimalLayout><SignIn /></MinimalLayout>
					</Route>
					<Route exact path="/resPassword">
						<MinimalLayout><ResPassword /></MinimalLayout>
					</Route>
					<Route exact path="/member/memberlist">
						<MainLayout><MemberList /></MainLayout>
					</Route>
					<Route exact path="/member/memberreg">
						<MainLayout><MemberReg /></MainLayout>
					</Route>
					<Route exact path="/member/membermod_admin">
						<MainLayout><MemberMod_admin /></MainLayout>
					</Route>
					<Route exact path="/member/membermod_user">
						<MainLayout><MemberMod_user /></MainLayout>
					</Route>
					<Route exact path="/resource">
						<MainLayout><ResourceList /></MainLayout>
					</Route>
					<Route exact path="/resource/regist">
						<MainLayout><ResourceRegist /></MainLayout>
					</Route>
					<Route exact path="/notice">
						<MainLayout><NoticeList /></MainLayout>
					</Route>
					<Route exact path="/notice/regist">
						<MainLayout><NoticeRegist /></MainLayout>
					</Route>
					<Route exact path="/project/history">
						<MainLayout><History /></MainLayout>
					</Route>
					<Route exact path="/project/manage">
						<MainLayout><Manage /></MainLayout>
					</Route>
					<Route exact path="/expense/annualList">
						<MainLayout><AnnualList /></MainLayout>
					</Route>
					<Route exact path="/expense/annualResister">
						<MainLayout><AnnualResister /></MainLayout>
					</Route>
					<Route exact path="/expense/monthyStatMSelectView">
						<MainLayout><MonthlystatMemberSelectView /></MainLayout>
					</Route>	
					<Route exact path="/expense/payList">
						<MainLayout><PayList /></MainLayout>
					</Route>
					<Route exact path="/expense/approvalList">
						<MainLayout><ApprovalList /></MainLayout>
					</Route>
					<Route exact path="/expense/approvalDetail">
						<MainLayout><ApprovalDetail /></MainLayout>
					</Route>
					<Route exact path="/admin/code">
						<MainLayout><Code /></MainLayout>
					</Route>
					<Route exact path="/admin/code/addCode">
						<MainLayout><AddCode /></MainLayout>
					</Route>
					<Route exact path="/admin/code/modifyCode">
						<MainLayout><ModifyCode /></MainLayout>
					</Route>
					<Route exact path="/notFound">
						<MinimalLayout><NotFound /></MinimalLayout>
					</Route>
					<Redirect to="/notFound" />
				</Switch>
			</div>
		</Router>
	);
}
