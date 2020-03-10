import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

function createData(id,name, position, address, phone, career,entry, cert ) {
	return { id,name, position, address, phone, career,entry, cert };
}
const rows = [
	createData('1','최문걸','대표', '경기도 안양시 동안구 달안로 75 샛별한양아파트 304동 611호', '010-5174-2860', '3년', '2018.05.09','유'),
	createData('2','조현철','이사', '경기도 안양시 동안구 달안로 75 샛별한양아파트 304동 611호', '010-5174-2860', '3년', '2018.05.09','유'),
	createData('3','박종운', '이사','경기도 안양시 동안구 달안로 75 샛별한양아파트 304동 611호', '010-5174-2860', '3년', '2018.05.09','유'),
	createData('4','허중섭', '부장','경기도 안양시 동안구 달안로 75 샛별한양아파트 304동 611호', '010-5174-2860', '3년', '2018.05.09','유'),
	createData('5','신우인', '부장','경기도 안양시 동안구 달안로 75 샛별한양아파트 304동 611호', '010-5174-2860', '3년', '2018.05.09','유'),
];

const MemberReg = () => {
	console.log("화면이동");
	return (
		<div>
			<Card>
				<CardContent>
					사원등록
				</CardContent>
			</Card>
		</div>
	);
}

export default MemberReg;
