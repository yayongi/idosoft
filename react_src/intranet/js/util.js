import axios from 'axios';

export const certYn = [
  { label:'유',value:1 },
  { label:'무',value:0 }
];

//주소 찾기
//작성자 : 강성우
//onClick={() => findAddress("address1")} > 주소가 입력될 컴포넌트 명을 넘긴다.
export function findAddress(component1,component2){
	daum.postcode.load(function(){
        new daum.Postcode({
            oncomplete: function(data) {
              document.getElementById(component1).value = data.address; //기본주소 입력
              document.getElementById(component2).value = data.zonecode; // 우편번호 입력
            }
        }).open();
    });
}

//날자 포맷
//작성자 : 강성우
export function dateFormatter(param){
	if(param.length == 8){
		return `${param.substring(0,4)}-${param.substring(4,6)}-${param.substring(6,8)}`
	}else if(param.length == 6){
		return `${param.substring(0,4)}-${param.substring(4,6)}`
	}
}

//전화번호 포맷 
//작성자 : 강성우
export function phoneFormatter(param){
	return `${param.substring(0,3)}-${param.substring(3,7)}-${param.substring(7,11)}`
}

//Unformatter
//작성자 : 강성우
export function unFormatter(param){
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    if(regExp.test(param)){
        param = param.replace(regExp, "");
	}
	return param;
}

//직급 포맷
//작성자 : 강성우
export function positionFormatter(param){
	let result;
	positions.map(position => {
    	if(position.value == param){
			result = position.label;
		}
	})
  return result;
}

//직급 역포맷
//작성자 : 강성우
export function positionUnFormatter(param){
	let result;
	positions.map(position => {
    	if(position.label == param){
			result = position.value;
		}
	})
  return result;
}
//이메일 Validation
//작성자 : 강성우
export function emailValidation(param){
  let emailValidation=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return emailValidation.test(param);
}

//경력 계산기
//작성자 : 강성우
export function dataCalculator(param){
  if(param == null || param == undefined) {
    return false;
  }
  let now = new Date();

  let startDate = param;
  let nowDate = String(now.getFullYear()) + (now.getMonth().length==2? "" : "0"+ String(now.getMonth()+1)) + String(now.getDate());

  //연도 
  let year = String(nowDate.substring(0,4)-startDate.substring(0,4));

  // let month = "";

  // if(nowDate.substring(4,6) > startDate.substring(4,6)){
  //   month = nowDate.substring(4,6) - startDate.substring(4,6);
  // }else{
  //   month = startDate.substring(4,6) -nowDate.substring(4,6) + 12;
  // }
  
  //if(month == 0){
    return year+"년";
  // }else{
  //   return year+"년 "+month+"개월";
  // }
}

// 전화번호 자릿수 
export function isValidNum(){
    var regexp = /[0-9]{11}/g;  
    document.getElementById("phone_num").value = unFormatter(document.getElementById("phone_num").value).replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3") 
    if (regexp.test(unFormatter(document.getElementById("phone_num").value))) {   
      document.getElementById("phone_num").value = unFormatter(document.getElementById("phone_num").value).substring(0,11).replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
    return false;   
  }  
}

// 파일 업로드
export function uploadFile(event,path,prefilename){
  const formData = new FormData();

  formData.append('file', event.target.files[0]);
  formData.append('path', path);
  formData.append('prefilename',prefilename);

  const property = {
    url : '/intranet/fileUpload',
    method : 'post',
    data : formData,
    header : {
      'enctype': 'multipart/form-data'
    }
  }
  
  axios(property).then(response => {
    }).catch(e => {
      processErrCode(e)
    });
} 

// 파일 다운로드
export function downloadFile(event,path){
  const formData = new FormData();
  formData.append('filename', event.target.children[0].value);
  formData.append('path', path);

  const property = {
    url : '/intranet/fileDownload',
    method : 'post',
    data : formData,
    responseType: 'blob',
  }

  axios(property).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers.filename);
      document.body.appendChild(link);
      link.click();
    }).catch(e => {
      processErrCode(e)
    });
} 
//엑셀 내보내기
export function excelExport(json){
		axios({
			url: '/intranet/downloadExcelFile',
      method: 'post',
      responseType: 'blob',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				title : 'TEST',
				jsonArrData : JSON.stringify(json)
			}
		}).then(response => {
			const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers.filename);
      document.body.appendChild(link);
      link.click();
		}).catch(e => {
      processErrCode(e);
		});
	}

  // 넘어온 값이 빈값인지 체크합니다.
  // !value 하면 생기는 논리적 오류를 제거하기 위해 
  // 명시적으로 value == 사용 
  // [], {} 도 빈값으로 처리
  //작성자 : 유기환
  export function isEmpty(value){ if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){return true}else{return false}};

  //  axios 공통 에러 코드 처리 프로세스
  //  작성자 : 유기환

  export function processErrCode(e){

    const errCode = e.response.status;

    if(errCode == 400){
      alert("세션이 만료되어 로그아웃 되었습니다. 다시 로그인 해주세요.");
      location.href = "/intranet/#/signIn";
    } else {
    }
  }

  //  로그인 회원정보 세션데이터 가져오기
  //  작성자 : 유기환
  export function getSessionMemberInfo(resPassSign){
    axios({
      url: '/intranet/getSession',
      method: 'get',
      data: {}
    }).then(response => {
      sessionStorage.setItem("loginSession",response.data.SESSION_DATA);
      if(resPassSign == 'true'){
        location.href="/intranet/#/resPassword";
      } else {
        location.href="/intranet/#/";
      }
    }).catch(e => {
      processErrCode(e);
      return null;
    });
  }
  
    //  개발미흡 alert
  //  작성자 : 유기환
  export function expectedDevelopment(resPassSign){
    alert("개발 진행중입니다.");
  }
  

//현재 경로가 개발인지 여부에 따라 /intranet 을 붙여줄지 여부에 따라 rootPath를 리턴해줌
//개발이면 /intranet이 X 
//운영이면 /intranet이 O
export function getRootPath(){
 return location.host.includes("localhost") || location.host.includes("127.0.0.1") ? "" : "/intranet";
}


