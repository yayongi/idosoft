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

class SignIn extends Component {
	
	constructor(props){
		super(props);

		// email : 이메일
		// password : 비밀번호
		// errors : 에러 배열
		this.state = {
			email: '',
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

	// email 입력창에 onchange 이벤트 발생 시, 호출
	emailHandleChange = (e) => {
		this.setState({email: e.target.value});
		this.clearValidationErr("email");
	}

	// password 입력창에 onchange 이벤트 발생 시, 호출
	pwHandleChange = (e) => {
		this.setState({password: e.target.value});
		this.clearValidationErr("password");
	}

	// 로그인 버튼 클릭 시, 호출
	loginHandleClick = (e) => {
		const { email, password } = this.state;

		if(email == ""){
			this.showValidationErr("email", "이메일을 입력해주세요!");
		} 
		
		if(password == "") {
			this.showValidationErr("password", "비밀번호를 입력해주세요!");
		} 
		
		if(email != "" && password != "") {
			
			console.log(`email : ${email} , password : ${password}`);
			
			axios({
				url: '/intranet/login',
				method: 'post',
				data: {
					email : email,
					password : password
				}
			}).then(response => {
				alert('로그인 여부' + JSON.stringify(response));	
			}).catch(e => {
				console.log(e);
			});

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

		let emailErr = null, passwordErr = null;

		for(let err of this.state.errors){
			if(err.elm == "email"){
				emailErr = err.msg;
			} if(err.elm == "password"){
				passwordErr = err.msg;
			}
		}

		return (
			<React.Fragment>
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<div className={classes.paper}>
						<form className={classes.form} noValidate>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								autoFocus
								onChange={this.emailHandleChange.bind(this)}
							/>
							{emailErr ? <Alert severity="error">{emailErr}</Alert> : ""}
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								onChange={this.pwHandleChange.bind(this)}
							/>
							{passwordErr ? <Alert severity="error">{passwordErr}</Alert> : ""}
							<FormControlLabel
								control={<Checkbox value="remember" color="primary" />}
								label="Remember me"
							/>
							<Button
								type="button"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={this.loginHandleClick.bind(this)}
							>
								Sign In
							</Button>
						</form>
					</div>
				</Container>
			</React.Fragment>
		);
	}
}

export default SignIn;