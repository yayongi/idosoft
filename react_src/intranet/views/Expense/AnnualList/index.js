/*
	중첩 Router 로 구현 시, Left 메뉴의 state 가 유지 되지 않는 문제가 있음.
*/
// import React from 'react';
// import { Route } from "react-router-dom";
// import { Main as MainLayout } from 'layouts';
// import List  from './List';
// import View  from './View';

// // 중첩 Router 구현
// export default function AnnualList ({match}) {
// 	return (
// 		<>
// 			{/* 경비관리목록 화면 */}
// 			<Route exact path={match.path} render={(props) =>
// 				<MainLayout>
// 					<List routeProps={props} />
// 				</MainLayout>
// 			} />
// 			{/* 경비관리 상세화면 */}
// 			<Route path={`${match.path}/view/:id`} render={(props) =>
// 				<MainLayout>
// 					<View routeProps={props} screenType="view" />
// 				</MainLayout>
// 			} />
// 			{/* 경비관리 등록화면 */}
// 			<Route path={`${match.path}/new`} render={(props) =>
// 				<MainLayout>
// 					<View routeProps={props} screenType="new" />
// 				</MainLayout>
// 			} />
// 		</>
// 	);
// };

export {default as AnnualList} from './List';
export {default as AnnualView} from './View';
