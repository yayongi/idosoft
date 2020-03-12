import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


import NoticeRegistLayout from './NoticeRegistLayout'

class Notice extends Component {
	render() {
		return (
			<Card>
				<CardContent>
					<NoticeRegistLayout/>
				</CardContent>
			</Card>
		);
	}
}

export default Notice;
