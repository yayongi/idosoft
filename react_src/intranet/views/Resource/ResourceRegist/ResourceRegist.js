import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import ResourceRegistLayout from './ResourceRegistLayout';

class ResourceRegist extends Component {
	render() {
		return (
			<Card>
				<CardContent>
					<ResourceRegistLayout/>
				</CardContent>
			</Card>
		);
	}
}

export default ResourceRegist;
