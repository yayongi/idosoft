import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ApprovalView from './component/ApprovalView';

class ApprovalDetail extends Component {
	render() {
		return (
			<Card>
				<CardContent>
					<ApprovalView/>
				</CardContent>
			</Card>
		);
	} 
}

export default ApprovalDetail;
