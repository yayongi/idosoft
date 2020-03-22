import React, {Fragment} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CodeInfo from '../component/CodeInfo';

const useStyles = makeStyles({
});

export default function ModifyCode(props) {
  const classes = useStyles();

  return (
    <Fragment>
		<Card>
			<CardContent>
				<CodeInfo routeProps={props}/>
			</CardContent>
		</Card>
	</Fragment>
  );
}