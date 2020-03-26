import React,{ useEffect } from 'react';
import Title from '../Title';
import { dateFormatter } from '../../../../js/util';
import { getLunarDate } from '../../../../js/LunarCalendar';

const Anniversary = () => {
	const [state, setState] =  React.useState(null);

	/* useEffect(() => {
		axios({
			url: '/intranet/member/memberlist',
			method: 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
		}).then(response => {
			console.log("positionResult : " + JSON.stringify(response));
			setState(response.data)
;		}).catch(e => {
			console.log(e);
		});
	},[]) */

	return (
		<React.Fragment>
			<Title>기념일</Title>
			
		</React.Fragment>
	);
}

export default Anniversary;