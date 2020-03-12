import React, {Component} from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import AnnualRegView from './component/AnnualRegView';

class AnnualResister extends Component {
	render() {
		return (
			<Card>
				<CardContent>
					<AnnualRegView/>
				</CardContent>
			</Card>
		);
	} 
}

export default AnnualResister;
