import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


import NoticeListLayout from './NoticeListLayout'


class NoticeList extends Component {
	render() {
		return (
			<Card>
				<CardContent>
					<NoticeListLayout/>
				</CardContent>
			</Card>
		);
	}
}

export default NoticeList;
