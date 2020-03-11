import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ApprovalListArea from './component/ApprovalListTableArea';
import SearchArea from './component/SearchArea';

class ApprovalList extends Component {
	render() {
		return (
			<Card>
				<CardContent>
					<SearchArea/>
					<div style={{height : 20}} />
					<ApprovalListArea/>
				</CardContent>
			</Card>
		);
	} 
}

export default ApprovalList;
