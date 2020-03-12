import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

// Server
import axios from 'axios';

class ResPassword extends Component {
	
	constructor(props){
		super(props);

		// prevPassword : 이메일
		// password : 비밀번호
		// errors : 에러 배열
		this.state = {
			prevPassword: '',
			password: '',
			errors: []
		}

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
		this.setState({prevPassword: e.target.value});
		this.clearValidationErr("prevPassword");
	}

	// password 입력창에 onchange 이벤트 발생 시, 호출
	pwHandleChange = (e) => {
		this.setState({password: e.target.value});
		this.clearValidationErr("password");
	}

	// 로그인 버튼 클릭 시, 호출
	resetPasswordHandleClick = (e) => {
		const { prevPassword, password } = this.state;

		if(prevPassword == ""){
			this.showValidationErr("prevPassword", "새로운 비밀번호을  입력해주세요!");
		} 
		
		if(password == "") {
			this.showValidationErr("password", "새로운 비밀번호 확인을 입력해주세요!");
		} 
		
		if(prevPassword != "" && password != "") {
			
			console.log(`prevPassword : ${prevPassword} , password : ${password}`);
			
			/* axios({
				url: '/intranet/login',
				method: 'post',
				data: {
					prevPassword : prevPassword,
					password : password
				}
			}).then(response => {
				console.log('로그인 여부' + JSON.stringify(response));	
			}).catch(e => {
				console.log(e);
			}); */

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
			</React.Fragment>
		);
	}
}

export default ResPassword;