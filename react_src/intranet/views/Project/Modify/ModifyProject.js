import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ProjectInfoForm from '../Manage/component/ProjectInfoForm'

export default function ModifyProject(props) {
	return (
		<Fragment>
			<Card>
				<CardContent>
					<ProjectInfoForm routeProps={props}/>
				</CardContent>
			</Card>
		</Fragment>
	);
}