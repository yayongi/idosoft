
// Mac주소 Validation
export function MacAddrCheck(str){
	if(str !== undefined){
		const regex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
		return regex.test(str);
	}else{
		return true;
	}
}

// 년월 Validation
export function YearMonthCheck(str){
	if(str === undefined) {return true}
	else if(str.length !== 8) {return false}

	const regex = /[0-9]{4}(0[1-9]|1[0-2])/;
	return regex.test(str);
}

// {resNo, resCode, modelNm, markCode, productMtn, purchaseMtn, displaySizeCode, serialNo, macAddr, holder};
export function resDataCheck(resData){
	const arr = [resData.resCode, resData.modelNm, resData.markCode, resData.displaySizeCode, resData.serialNo, resData.holder];
	for(var i=0; i<arr.length; i++){
		if(arr[i]===undefined) return false;
	}
	if(1===MacAddrCheck(resData.macAddr)*YearMonthCheck(resData.productMtn)*YearMonthCheck(resData.purchaseMtn)){
		return true;
	}else{
		return false;
	}
}

export const returnValue = (obj, key) => {
	const value = obj.filter(item=>{return item.key === key});
	return value[0].str;
}