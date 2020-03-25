import axios from 'axios';

export const tableList = () => {
	axios({
		url: '/intranet/member/memberlist',
		method: 'post',
        headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
	}).then(response => {
		
	}).catch(e => {
		console.log(e);
	});
};
