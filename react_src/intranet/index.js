import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import Dashboard from './main';									// Dashboard
import SignIn from './login/SignIn';									// 로그인
import Main from './main/Main';									// 메인
import Member from './member';									// 사원관리
import Resource from './resource';									// 자원관리
import Notice from './notice';										// 공지사항
import ProjectHistory from './project/history/';					// 프로젝트 -> 프로젝트이력
import ProjectManage from './project/manage/';				// 프로젝트 -> 프로젝트관리
import ExpenseAnnualList from './expense/annualList/';			// 경비관리 -> 경비관리목록
import ExpensePayList from './expense/payList/';				// 경비관리 -> 교통/통신비관리
import ExpenseApproval from './expense/approval/';			// 경비관리 -> 경비결재관리
import AdminCode from './admin/code/';							// 관리자 -> 코드관리

function App() {
	return (
		<Router>
			<Dashboard>
				<div>
					<Route exact path="/main" component={Main} />
					<Route exact path="/signIn" component={SignIn} />
					<Route exact path="/member" component={Member} />
					<Route exact path="/resource" component={Resource} />
					<Route exact path="/notice" component={Notice} />					
					<Route exact path="/project/history" component={ProjectHistory} />
					<Route exact path="/project/manage" component={ProjectManage} />
					<Route exact path="/expense/annualList" component={ExpenseAnnualList} />
					<Route exact path="/expense/payList" component={ExpensePayList} />
					<Route exact path="/expense/approval" component={ExpenseApproval} />

					<Route exact path="/admin/code" component={AdminCode} />
				</div>
			</Dashboard>
		</Router>
	);
}

ReactDOM.render(<App />, document.getElementById('root'));
