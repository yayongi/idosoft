import React from 'react';
import Title from '../Title';
import { data } from './data';
import { dateFormatter } from '../../../../js/util';

export default function Anniversary() {
	return (
		<React.Fragment>
			<Title>기념일</Title>
			{data.map(datum => (
				<h3 key={datum.id}>	
					{
						datum.birth !== undefined? 
						dateFormatter(datum.birth).substring(5,10)+"은 "+datum.name+"님의 생일입니다."
						: dateFormatter(datum.mar_date).substring(5,10)+"은 "+datum.name+"님의 결혼기념일입니다." 
					}		
				</h3>
			))}
		</React.Fragment>
	);
}