import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AnnualListTableArea from './component/AnnualListTableArea'

class AnnualList extends Component {
	render() {
		return (
			<Card>
				<CardContent>
					<AnnualListTableArea/>
				</CardContent>
			</Card>
		);
	}
}

export default AnnualList;
