import React,{ useEffect } from 'react';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Title from '../Title';
import { getLunarDate } from '../../../../js/LunarCalendar';

import {processErrCode } from '../../../../js/util';

const Anniversary = () => {
	const [state, setState] =  React.useState(null);
	
	useEffect(() => {
		const date = getLunarDate();

		axios({
			url: '/intranet/member/getdate',
			method: 'post',
			data : {
				solarDate : date.split("/")[0],
				moonDate : date.split("/")[1]
			},
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
		}).then(response => {
			setState(response.data)
;		}).catch(e => {
			processErrCode(e, false);
		});
	},[])

	return (
		<React.Fragment>
			<Title>기념일</Title>
			{(state != null) && state.birthDate.map((datum,index) => (
				<Typography key={index} variant="body1" gutterBottom>
					{"오늘은 "+datum.NAME+datum.POSITION+"님의 생일입니다."}
				</Typography>
			))}
			{(state != null) && state.marriageDate.map((datum,index) => (
				<Typography key={index} variant="body1" gutterBottom>
					{"오늘은 "+datum.NAME+datum.POSITION+"님의 결혼기념일입니다."}				
				</Typography>
			))}
		</React.Fragment>
	);
}

export default Anniversary;