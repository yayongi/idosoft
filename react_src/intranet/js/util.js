import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export const positions = [
  { label: '대표',value: 'A01', },
  { label: '이사',value: 'A02', },
  { label: '부장',value: 'A03', },
  { label: '차장',value: 'B01', },
  { label: '과장',value: 'B02', },
  { label: '대리',value: 'B03', },
  { label: '사원',value: 'B04', },
];

export const schCareer = [
  { label:'고졸',value:'A01'},
  { label:'초대졸',value:'A02'},
  { label:'대졸',value:'A03'},
  { label:'대학원졸',value:'A04'},
];

export const certYn = [
  { label:'유',value:'1' },
  { label:'무',value:'0' }
];

//주소 찾기
//작성자 : 강성우
//onClick={() => findAdress("address1")} > 주소가 입력될 컴포넌트 명을 넘긴다.
export function findAdress(component){
	daum.postcode.load(function(){
        new daum.Postcode({
            oncomplete: function(data) {
              document.getElementById(component).value = data.address;
            }
        }).open();
    });
}

//날자 포맷
//작성자 : 강성우
export function dateFormatter(param){
	if(param.length == 8){
		return `${param.substring(0,4)}.${param.substring(4,6)}.${param.substring(6,8)}`
	}else if(param.length == 6){
		return `${param.substring(0,4)}.${param.substring(4,6)}`
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

//최종학력  포맷
//작성자 : 강성우
export function schoolFormatter(param){
	let result;
	schCareer.map(position => {
    	if(schCareer.value == param){
			result = schCareer.label;
		}
	})
	return result;
}

export function Alert(props){

	console.log("props : " + JSON.stringify(props));
	debugger;
	const [state, setState] = React.useState({
    	onOff : props.onOff,
	});

	const handleClose = () => {
		setState({
			...state,
			onOff : true
		})
	};

	return (
		<div>
		<Dialog
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			open={state.onOff===undefined?false:state.onOff}
		>
			<DialogTitle id="alert-dialog-title" style={{minWidth:'400px'}}>{props.title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{props.content}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={()=>handleClose()} color="primary" autoFocus>
					확인
				</Button>
			</DialogActions>
		</Dialog>
		</div>
	);
}



























