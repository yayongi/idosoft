
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Switch, Redirect } from 'react-router-dom';
import { Main as MainLayout, Minimal as MinimalLayout  } from './layouts';
import {
	Code as Code,
	ModifyCode as ModifyCode,
	Dashboard as Dashboard,
	AnnualList as AnnualList,
	AnnualView as AnnualView,
	ApprovalList as ApprovalList,
	ApprovalView as ApprovalView,
	PayList as PayList,
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
	ModifyProject as ModifyProject,
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
					<Route exact path="/signIn">
						<MinimalLayout><SignIn /></MinimalLayout>
					</Route>
					<Route exact path="/resPassword">
						<MinimalLayout><ResPassword /></MinimalLayout>
					</Route>
					<Route exact path="/member/">
						<MainLayout><MemberList /></MainLayout>
					</Route>
					<Route exact path="/member/memberreg">
						<MainLayout><MemberReg /></MainLayout>
					</Route>
					<Route exact path="/member/membermod/admin">
						<MainLayout><MemberMod_admin /></MainLayout>
					</Route>
					<Route exact path="/member/membermod/user">
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

					{/* 사원관리 수정 - 사용자 */}
					<Route exact path='/member/membermod_user' render={(props) =>
						<MainLayout routeProps={props}>
							<MemberMod_user routeProps={props} />
						</MainLayout>
					} />

					{/* 자원관리 목록*/}
					<Route exact path='/resource' render={(props) =>
						<MainLayout routeProps={props}>
							<ResourceList routeProps={props} />
						</MainLayout>
					} />
					{/* 자원관리 등록*/}
					<Route exact path='/resource/regist' render={(props) =>
						<MainLayout routeProps={props}>
							<ResourceRegist routeProps={props} />
						</MainLayout>
					} />
					{/* 공지사항 목록*/}
					<Route exact path='/notice' render={(props) =>
						<MainLayout routeProps={props}>
							<NoticeList routeProps={props} />
						</MainLayout>
					} />
					{/* 공지사항 등록화면 */}
					<Route path='/notice/regist' render={(props) =>
						<MainLayout routeProps={props}>
							<NoticeRegist routeProps={props} />
						</MainLayout>
					} />
					{/* 이력관리 */}
					<Route exact path='/project/history' render={(props) =>
						<MainLayout routeProps={props}>
							<History routeProps={props} />
						</MainLayout>
					} />
					{/* 중첩 Router 적용 - state Left 메뉴의 state가 유실되는 문제가 있어서 폐기 - 20200319: 오경섭*/}
					{/* <Route path="/expense/annualList" component={AnnualList} />> */}
					{/* <Route path="/expense/approvalList" component={ApprovalList} />> */}
					{/* 중첩 Router 적용*/}

					{/* 프로젝트 관리 */}
					<Route exact path='/project/manage' render={(props) =>
						<MainLayout routeProps={props}>
							<Manage routeProps={props} />
						</MainLayout>
					} />
					{/* 프로젝트 등록 */}
					<Route exact path='/project/manage/new' render={(props) =>
						<MainLayout routeProps={props}>
							<ModifyProject routeProps={props} />
						</MainLayout>
					} />
					{/* 프로젝트 수정 */}
					<Route exact path='/project/manage/view' render={(props) =>
						<MainLayout routeProps={props}>
							<ModifyProject routeProps={props} />
						</MainLayout>
					} />
					{/* 경비관리 목록 화면 */}
					<Route exact path='/expense/annualList' render={(props) =>
						<MainLayout routeProps={props}>
							<AnnualList routeProps={props} />
						</MainLayout>
					} />
					{/* 경비관리 상세화면 */}
					<Route path='/expense/annualList/view/:id' render={(props) =>
						<MainLayout routeProps={props}>
							<AnnualView routeProps={props} />
						</MainLayout>
					} />
					{/* 경비관리 등록화면 */}
					<Route path='/expense/annualList/new' render={(props) =>
						<MainLayout routeProps={props}>
							<AnnualView routeProps={props} screenType="new"/>
						</MainLayout>
					} />

					{/* 경비결재관리 목록 화면 */}
					<Route exact path='/expense/approvalList' render={(props) =>
						<MainLayout routeProps={props}>
							<ApprovalList routeProps={props} />
						</MainLayout>
					} />
					{/* 경비결재관리 상세화면 */}
					<Route path='/expense/approvalList/view/:id' render={(props) =>
						<MainLayout routeProps={props}>
							<ApprovalView routeProps={props} />
						</MainLayout>
					} />
					{/* 교통/통신비 관리목록 */}
					<Route path='/expense/payList' render={(props) =>
						<MainLayout routeProps={props}>
							<PayList routeProps={props} />
						</MainLayout>
					} />
					{/* 경비월별통계 */}
					<Route path='/expense/monthyStatMSelectView' render={(props) =>
						<MainLayout routeProps={props}>
							<MonthlystatMemberSelectView routeProps={props} />
						</MainLayout>
					} />
					{/* 코드관리 */}
					<Route path='/admin/code' render={(props) =>
						<MainLayout routeProps={props}>
							<Code routeProps={props} />
						</MainLayout>
					} />
					{/* 코드 추가*/}
					<Route path='/admin/modifyCode/new' render={(props) =>
						<MainLayout routeProps={props}>
							<ModifyCode routeProps={props} screenType="new"/>
						</MainLayout>
					} />
					{/* 코드 수정*/}
					<Route path='/admin/modifyCode/view' render={(props) =>
						<MainLayout routeProps={props}>
							<ModifyCode routeProps={props}/>
						</MainLayout>
					} />
					<Route  path="/notFound">
						<MinimalLayout><NotFound /></MinimalLayout>
					</Route>
					<Redirect to="/notFound" />
				</Switch>
			</div>
		</Router>
	);
}
