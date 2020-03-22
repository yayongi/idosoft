import React, {Component} from 'react';
import Card from '@material-ui/core/Card';

import NoticeRegistLayout from './NoticeRegistLayout'

class Notice extends Component {
	render() {
		return (
			<Card>
				<NoticeRegistLayout/>
			</Card>
		);
	}
}

export default Notice;
