
/**
 *  yyyyMMdd 포맷으로 반환
 */
function getFormatDate(value){ 
	var i = 0, date = value.toString();
	var pattern = "####-##-##";
	return  pattern.replace(/#/g, _ => date[i++]);
}
