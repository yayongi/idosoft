// Select로 구성할 년월 목록
const getListYyyyMm = (period) => {
	const d = new Date();
	d.setMonth(d.getMonth() + 1);

	const arr = new Array(period);
	return arr.fill(0).map( () => {
		d.setMonth(d.getMonth() - 1);
		let yyyy = d.getFullYear();
		let mm = d.getMonth()+1;
		mm = (mm.toString().length == 1)? "0" + mm: mm;

		const yyyymm = `${yyyy}${mm}`;		
		return {value: yyyymm, label: yyyymm};
	});
}

// 결제 기간 시작/종료 년월
const payDts = getListYyyyMm(12);