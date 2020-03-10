import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import ResourceTable from './list/ResourceTable';

class Resource extends Component {
	render() {
		return (
			<Card>
				<CardContent>
					<ResourceTable/>
				</CardContent>
			</Card>
		);
	}
}

export default Resource;
