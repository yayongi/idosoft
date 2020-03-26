function createData(seq, expenseType, expenseTypeText, memo, status, statusText, register, payDate, pay, rejectMemo, prevAuthPerson, authPerson, prevAuthDate, authDate) {
	return {seq, expenseType, expenseTypeText, memo, status, statusText, register, payDate, pay, rejectMemo, prevAuthPerson, authPerson, prevAuthDate, authDate};
}
/**
 *  yyyyMMdd 포맷으로 반환
 */
function getFormatDate(value){ 
	var i = 0, date = value.toString();
	var pattern = "####-##-##";
	return  pattern.replace(/#/g, _ => date[i++]);
}

const rows = [
	createData('19', '0', '야간경비', '택시비', '0', '진행', '오경섭', getFormatDate('20200304'), '10000', '', '조현철', '최문걸', '', ''),
	createData('18', '2', '식비', '야식','0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '조현철', '최문걸', '', ''),
	createData('17', '1', '물품구매', '명패','0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '박종운', '최문걸', '', ''),
	createData('16', '0', '야간경비', '모텔비', '0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '박종운', '최문걸', '', ''),
	createData('15', '0', '야간경비', '찜질방', '0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '박종운', '최문걸', '', ''),
	createData('14', '1', '물품구매', '명함','0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '박종운', '최문걸', '', ''),
	createData('13', '0', '야간경비', '택시비','0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '고성진', '최문걸', '', ''),
	createData('12', '0', '야간경비', '택시비','0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '고성진', '최문걸', '', ''),
	createData('11', '1', '물품구매', 'A4 2박스, 볼펜 5개', '0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '고성진', '최문걸', '', ''),
	createData('10', '0', '야간경비', '택시비', '1', '1차결재완료', '김준선', getFormatDate('20200304'), '10000', '', '조현철', '최문걸', getFormatDate('20200304'), ''),
	createData('9', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '조현철', '고성진', '', ''),
	createData('8', '1', '물품구매', '주전부리', '2', '완료', '김준선', getFormatDate('20200304'), '10000', '', '조현철', '최문걸', getFormatDate('20200304'), getFormatDate('20200304')),
	createData('7', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '조현철', '최문걸', '', ''),
	createData('6', '2', '식비', '점심 회식', '3', '반려', '김준선', getFormatDate('20200304'), '10000', '내용이 이상해서 반려합니다.\n 이상해이상', '조현철', '최문걸', '', ''),
	createData('5', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '조현철', '최문걸', '', ''),
	createData('4', '1', '물품구매', '카드', '0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '조현철', '최문걸', '', ''),
	createData('3', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '조현철', '최문걸', '', ''),
	createData('2', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000', '', '조현철', '최문걸', '', ''),
	createData('1', '2', '식비', '저녁회식', '0', '진행', '김준선', getFormatDate('20190304'), '10000', '', '조현철', '최문걸', '', ''),
];

sessionStorage.setItem("ANNUAL_LIST", JSON.stringify(rows));

export const AnnualStorage = sessionStorage; 


// 경비 유형 Select 값
export const expenseTypes = [
	{ value: '-1', label: '전체'  },
	{ value: '0', label: '야간경비' },
	{ value: '1', label: '물품구매' },
	{ value: '2', label: '저녁식비' },
];

// 진행상태값
export const statuses = [
	{ value: '-1', label: '전체' },
	{ value: '0', label: '진행' },
	{ value: '1', label: '1차결재완료' },
	{ value: '2', label: '완료' },
	{ value: '3', label: '반려' },
];



export function getStepInfo(row) {
	let stepInfo = {
		activeStep : 0,
		steps : [
			{label: '진행', isError: false},
			{label: '1차결재완료', isError: false},
			{label: '완료', isError: false},
		]
	}
	
	if(row.status == 'SS0000') {
		stepInfo.activeStep = 0; // activeStep 1
		stepInfo.steps[0].label = row.statusText;
		stepInfo.steps[0].isError = false;
	} else if(row.status == 'SS0001') {
		stepInfo.activeStep = row.statusText;
	} else if(row.status == 'SS00002') {
		stepInfo.activeStep = row.statusText;
	} else if(row.status == 'SS00003') {
		stepInfo.activeStep = row.statusText;
		stepInfo.steps[0].label = '반려';
		stepInfo.steps[0].isError = true;
	}
	return stepInfo
}
