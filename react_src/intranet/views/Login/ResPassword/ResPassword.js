import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

// Server
import axios from 'axios';
import { isEqual } from 'date-fns';

class ResPassword extends Component {
	
	constructor(props){
		super(props);

		// prevPassword : 이메일
		// password : 비밀번호
		// errors : 에러 배열
		// open : 팝업 열기 flag
		// errMsg : 팝업 내용
		this.state = {
			prevPassword: '',
			password: '',
			errors: [],
			open: false,
			errMsg: '',
		}
	}
	
	// errorArart 열기
	errorArartOpen(errMsg){

		this.setState({
			open : true,
			errMsg : errMsg,
		});
		this.forceUpdate();
	}

	// errorArart 닫기 
	errorArartClose(){
		this.setState({open : false,});
		this.forceUpdate();
	}

	// 입력값 미입력시, 에러처리
	showValidationErr(elm, msg){
		this.setState((prevState) => ( {errors: [...prevState.errors, {elm, msg}] } ));
	}

	// 에러처리된 입력값 입력시, 에러처리
	clearValidationErr(elm){
		this.setState((prevState) => {
			let newArr = [];
			for(let err of prevState.errors){
				if(elm != err.elm){
					newArr.push(err);
				}
			}

			return {errors : newArr};
		});
	}

	// prevPassword 입력창에 onchange 이벤트 발생 시, 호출
	prevPasswordHandleChange = (e) => {
		this.setState({prevPassword: e.target.value,});
		this.clearValidationErr("prevPassword");

		
	}

	// password 입력창에 onchange 이벤트 발생 시, 호출
	pwHandleChange = (e) => {
		this.setState({password: e.target.value,});
		this.clearValidationErr("password");
	}

	// 로그인 버튼 클릭 시, 호출
	resetPasswordHandleClick = (e) => {
		const { prevPassword, password} = this.state;
		
		let prevPassCheck = true;
		let passwordCheck = true;
		
		// 비밀번호 정규표현식
		const regExpPw = /(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/;

		if(!regExpPw.test(prevPassword)){

			prevPassCheck = false;

			this.showValidationErr("prevPassword", "숫자, 특문 각 1회 이상, 영문은 2개 이상 사용하여 8자리 이상 입력해주세요.");
		}

		if(!regExpPw.test(password)){

			passwordCheck = false;

			this.showValidationErr("password", "숫자, 특문 각 1회 이상, 영문은 2개 이상 사용하여 8자리 이상 입력해주세요.");
		}
		
		if(prevPassCheck && passwordCheck){
			if(prevPassword != "" && password != "") {
					axios({
						url: '/intranet/resPassword',
						method: 'post',
						data: {
							prevPassword : prevPassword,
							password : password
						}
					}).then(response => {
						const isError = response.data.isError;
						
						if(isError == "true"){
							const errMessage = response.data.errMessage;
							const errorArartOpen = this.errorArartOpen.bind(this);

							errorArartOpen(errMessage);
						} else {
							location.href="/intranet/#/signIn";
						}
						
					}).catch(e => {
						processErrCode(e);
					});
			}
		}
	} 

	useStyles = makeStyles(theme => ({
				paper: {
					marginTop: theme.spacing(8),
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				},
				avatar: {
					margin: theme.spacing(1),
					backgroundColor: theme.palette.secondary.main,
				},
				form: {
					width: '100%', // Fix IE 11 issue.
					marginTop: theme.spacing(1),
				},
				submit: {

					margin: theme.spacing(3, 0, 2),
				},
			}));	

	render(){
	
		const classes = this.useStyles.bind(this);

		let prevPasswordErr = null, passwordErr = null;
		
		let open = this.state.open;
		let errMsg = this.state.errMsg;
		
		for(let err of this.state.errors){
			if(err.elm == "prevPassword"){
				prevPasswordErr = err.msg;
			} if(err.elm == "password"){
				passwordErr = err.msg;
			}
		}

		return (
			<React.Fragment>
				<Typography variant="h3" component="h2" align="center">
					비밀번호 재설정
				</Typography>
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<div className={classes.paper}>
						<form className={classes.form} noValidate>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="prevPassword"
								label="새로운 비밀번호"
								type="password"
								name="prevPassword"
								autoComplete="current-password"
								autoFocus
								onChange={this.prevPasswordHandleChange.bind(this)}
							/>
							{prevPasswordErr ? <Alert severity="error">{prevPasswordErr}</Alert> : ""}
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								name="password"
								label="새로운 비밀번호 확인"
								type="password"
								id="password"
								autoComplete="current-password"
								onChange={this.pwHandleChange.bind(this)}
							/>
							{passwordErr ? <Alert severity="error">{passwordErr}</Alert> : ""}

							<div style={{height : 40}}/>
							<Button
								type="button"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={this.resetPasswordHandleClick.bind(this)}
							>
								비밀번호 재설정
							</Button>
						</form>
					</div>
				</Container>
				<div>
					<Dialog
						open={open}
						onClose={this.errorArartClose.bind(this)}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{errMsg}
						</DialogContentText>
						</DialogContent>
						<DialogActions>
						<Button onClick={this.errorArartClose.bind(this)} color="primary" autoFocus>
							닫기
						</Button>
						</DialogActions>
					</Dialog>
				</div>
			</React.Fragment>
		);
	}
}

export default ResPassword;