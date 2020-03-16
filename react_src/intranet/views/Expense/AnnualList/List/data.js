export const columnsUp = [
	{ id: 'num', label: '번호', minWidth: 100, align: 'center'},
	{ id: 'expenseTypeText', label: '경비유형', minWidth: 100, align: 'center' },
	{ id: 'memo', label: '내용', minWidth: 100, align: 'center' },
	{ id: 'statusText', label: '진행상태', minWidth: 100, align: 'center' },
	{ id: 'register', label: '등록자', minWidth: 100, align: 'center' },
	{ id: 'payDate', label: '결제일', minWidth: 100, align: 'center' },

];

export const columnsDown = [
	{ id: 'expenseTypeText', label: '경비유형', minWidth: 100, align: 'center' },
	{ id: 'statusText', label: '진행상태', minWidth: 100, align: 'center' },
	{ id: 'payDate', label: '결제일', minWidth: 100, align: 'center' },
];

function createData(seq, expenseType, expenseTypeText, memo, status, statusText, register, payDate, pay) {
  return { seq, expenseType, expenseTypeText, memo, status, statusText, register, payDate, pay};
}

export const rows = [
	createData('19', '0', '야간경비', '택시비', '0', '진행', '오경섭', getFormatDate('20200304'), '10000'),
	createData('18', '2', '식비', '야식','0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('17', '1', '물품구매', '명패','0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('16', '0', '야간경비', '모텔비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('15', '0', '야간경비', '찜질방', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('14', '1', '물품구매', '명함','0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('13', '0', '야간경비', '택시비','0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('12', '0', '야간경비', '택시비','0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('11', '1', '물품구매', 'A4 2박스, 볼펜 5개', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('10', '0', '야간경비', '택시비', '1', '1차결재완료', '김준선', getFormatDate('20200304'), '10000'),
	createData('9', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('8', '1', '물품구매', '주전부리', '2', '완료', '김준선', getFormatDate('20200304'), '10000'),
	createData('7', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('6', '2', '식비', '점심 회식', '3', '반려', '김준선', getFormatDate('20200304'), '10000'),
	createData('5', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('4', '1', '물품구매', '카드', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('3', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('2', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('1', '2', '식비', '저녁회식', '0', '진행', '김준선', getFormatDate('20190304'), '10000'),
];

/**
 *  yyyyMMdd 포맷으로 반환
 */
function getFormatDate(value){ 
	var i = 0, date = value.toString();
	var pattern = "####-##-##";
	return  pattern.replace(/#/g, _ => date[i++]);
}