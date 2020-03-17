import React from 'react';
import { Route } from "react-router-dom";
import { Main as MainLayout } from 'layouts';
import List  from './List';
import View  from './View';

// 중첩 Router 구현
export default function AnnualList ({match}) {
	return (
		<>
			{/* 경비관리목록 화면 */}
			<Route exact path={match.path} render={(props) =>
				<MainLayout>
					<List routeProps={props} />
				</MainLayout>
			} />
			{/* 경비관리 상세화면 */}
			<Route path={`${match.path}/:id`} render={(props) =>
				<MainLayout>
					<View routeProps={props} />
				</MainLayout>
			} />
		</>
	);
};
