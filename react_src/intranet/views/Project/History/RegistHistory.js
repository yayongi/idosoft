import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import HistoryInfoRegist from './component/HistoryInfoRegist'

const RegistHistory = (props) => {
  return (
    <Fragment>
		<Card>
			<CardContent>
				<HistoryInfoRegist routeProps={props}/>
			</CardContent>
		</Card>
	</Fragment>
  );
}
export default RegistHistory;