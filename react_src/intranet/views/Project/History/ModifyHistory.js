import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import HistoryInfoDetail from './component/HistoryInfoDetail'

const ModifyHistory = (props) => {
  return (
    <Fragment>
		<Card>
			<CardContent>
				<HistoryInfoDetail routeProps={props}/>
			</CardContent>
		</Card>
	</Fragment>
  );
}
export default ModifyHistory;