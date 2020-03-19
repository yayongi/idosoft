import React from 'react';
import Button from '@material-ui/core/Button';

import CommonDialog from './CommonDialog';

//결과를 담을 변수
let resultValue;

export default function DialogTest() {
	// 초기값은 {}로 설정하고 온오프시  {title:'', content:'', onOff:'true of false'} 형식으로 setting됨.
	const [dialog, setDialog] = React.useState({});

	// Dialog창의 title과 content, confirm여부  담는 배열
	// 배열 없이도 파라미터 입력해서 사용가능
	const confirmData = ['confirm', '확인 또는 취소버튼을 눌러주세요.', true];

	//Dialog open handler
	const handleOpenDialog = (title, content, isConfirm) => {
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	//Dialog close handler
	//확인:true 취소:false 리턴
	const handleCloseDialog = (result) => {
		setDialog({title:'', content:'', onOff:false, isConfirm:false});
    	return resultValue=result;
	}

	return (
		<div>
			<p>
				{`확인결과${resultValue}`}
			</p>
			<Button variant="outlined" color="primary" onClick={()=>handleOpenDialog(...confirmData)}>
				Confirm
			</Button>
			<Button variant="outlined" color="primary" onClick={()=>handleOpenDialog('Alert','확인버튼을 눌러주세요.')}>
				Alert
			</Button>

			<CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>

		</div>
	);
}
