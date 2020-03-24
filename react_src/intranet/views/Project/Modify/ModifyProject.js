import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ProjectInfoForm from '../Manage/component/ProjectInfoForm'
import ProjectMemberTable from '../Manage/component/ProjectMemberTable';

function initData(location) {
	var urlSplitList = location.pathname.split("/");
	var currentLastPath = urlSplitList[urlSplitList.length - 1];
	return currentLastPath == "new" ? "new" : "modify";
}

export default function ModifyProject(props) {
	const screenType = initData(props.routeProps.location);
	return (
		<Fragment>
			<Card>
				<CardContent>
					<ProjectInfoForm routeProps={props}/>
					{ screenType == "modify" && <ProjectMemberTable   routeProps={ props.routeProps } />}
				</CardContent>
			</Card>
		</Fragment>
	);
}