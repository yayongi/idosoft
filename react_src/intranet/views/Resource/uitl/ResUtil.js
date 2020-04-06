
// Mac주소 Validation
export function MacAddrCheck(str){
	if(str !== undefined){
		const regex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
		return !regex.test(str);
	}else{
		return true;
	}
}

export function SerialNoCheck(str){
	if(str != undefined){
		const regex = /^[A-Za-z0-9+]*$/;
		return !regex.test(str);
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

// export const returnValue = (obj=[{key:-1, value:false}], key=-1, valueName='value') => {
export const returnValue = (obj=[{key:-1, value:false}], key=-1, valueName='value') => {
	if((obj.filter(item=>{return item.key === key}))[0] == undefined){
		return false;
	}else{
		let result = (obj.filter(item=>{return item.key === key}))[0][valueName];
		// console.log(result);
		return result;
	}
}

export const getUrlParams = function (url, paramName) {
    // 리턴값을 위한 변수 선언
    var returnValue;

    // get 파라미터 값을 가져올 수 있는 ? 를 기점으로 slice 한 후 split 으로 나눔
    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

    // 나누어진 값의 비교를 통해 paramName 으로 요청된 데이터의 값만 return
    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == paramName.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            return decodeURIComponent(returnValue);
        }
    }
};
