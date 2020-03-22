import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import HistoryInfoForm from '../History/component/HistoryInfoForm'

export default function ModifyHistory(props) {
  return (
    <Fragment>
		<Card>
			<CardContent>
				<HistoryInfoForm routeProps={props}/>
			</CardContent>
		</Card>
	</Fragment>
  );
}