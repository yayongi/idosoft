import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Switch, Redirect } from 'react-router-dom';
import { Main as MainLayout, Minimal as MinimalLayout  } from './layouts';
import {
	Code as Code,
	Dashboard as Dashboard,
	AnnualList as AnnualList,
	PayList as PayList,
	Approval as Approval,
	SignIn as SignIn,
	MemberList as MemberList, 
	MemberReg as MemberReg,
	MemberMod_admin as MemberMod_admin,
	MemberMod_user as MemberMod_user,
	Notice as Notice,
	History as History,
	Manage as Manage,
	Resource as Resource,
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
					{/* 사원관리 리스트 */}
					<Route exact path="/member/memberlist">
						<MainLayout><MemberList /></MainLayout>
					</Route>
					{/* 사원관리 등록 */}
					<Route exact path="/member/memberreg">
						<MainLayout><MemberReg /></MainLayout>
					</Route>
					{/* 사원관리 상세_관리자 */}
					<Route exact path="/member/membermod_admin">
						<MainLayout><MemberMod_admin /></MainLayout>
					</Route>
					{/* 사원관리 상세_유저 */}
					<Route exact path="/member/membermod_user">
						<MainLayout><MemberMod_user /></MainLayout>
					</Route>
					<Route exact path="/resource">
						<MainLayout><Resource /></MainLayout>
					</Route>
					<Route exact path="/notice">
						<MainLayout><Notice /></MainLayout>
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
					<Route exact path="/expense/payList">
						<MainLayout><PayList /></MainLayout>
					</Route>
					<Route exact path="/expense/approval">
						<MainLayout><Approval /></MainLayout>
					</Route>
					<Route exact path="/admin/code">
						<MainLayout><Code /></MainLayout>
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
