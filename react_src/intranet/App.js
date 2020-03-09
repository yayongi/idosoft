import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Main as MainLayout, Minimal as MinimalLayout  } from './layouts';
import {
	Code as Code,
	Dashboard as Dashboard,
	AnnualList as AnnualList,
	PayList as PayList,
	Approval as Approval,
	SignIn as SignIn,
	Member as Member,
	Notice as Notice,
	History as History,
	Manage as Manage,
	Resource as Resource,
} from './views';

export default function App() {
	return (
		<Router>
			<MainLayout>
				<div>
					<Route exact path="/dashboard" component={Dashboard} />
					<Route exact path="/signIn" component={SignIn} />
					<Route exact path="/member" component={Member} />
					<Route exact path="/resource" component={Resource} />
					<Route exact path="/notice" component={Notice} />					
					<Route exact path="/project/history" component={History} />
					<Route exact path="/project/manage" component={Manage} />
					<Route exact path="/expense/annualList" component={AnnualList} />
					<Route exact path="/expense/payList" component={PayList} />
					<Route exact path="/expense/approval" component={Approval} />

					<Route exact path="/admin/code" component={Code} />
				</div>
			</MainLayout>
		</Router>
	);
}
