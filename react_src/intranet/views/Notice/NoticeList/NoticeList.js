import React, {Component, useDebugValue} from 'react';
import Card from '@material-ui/core/Card';

import NoticeListTable from './NoticeListTable';

const NoticeList = () => {

	return (
		<Card>
			<NoticeListTable/>
		</Card>
	);
}

export default NoticeList;
