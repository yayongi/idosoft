import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import ResourceTable from './ResourceTable';

class ResourceList extends Component {
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

export default ResourceList;
