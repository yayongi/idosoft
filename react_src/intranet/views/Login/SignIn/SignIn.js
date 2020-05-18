import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { LoadingBar } from '../../../common/LoadingBar/LoadingBar';
import { getRootPath, setSessionStrogy } from '../../../js/util';

// Server
import axios from 'axios';

class SignIn extends Component {
	
	constructor(props){
		super(props);

		// email : 이메일
		// password : 비밀번호
		// errors : 에러 배열
		// open : alert창 flag
		this.state = {
			email: '',
			password: '',
			errors: [],
			open: false,
			isShowLoadingBar: false,
			isKeepLogin : false,
			globalState : props.globalState,
			setGlobalState : props.setGlobalState
		}

	}
	
	componentWillMount() {
		// 자동 로그인 처리
		axios({
			url: '/intranet/autoLogin',
			method: 'post',
			data: {}
		}).then(response => {
			location.href=getRootPath();
		}).catch(e => {
			console.log(e);
		});
	}

	setShowLoadingBar(param){
		this.setState({
			...this.state,
			isShowLoadingBar: param
		})
		this.forceUpdate();
	}

	// errorArart 열기
	errorArartOpen(){
		this.setState({open:true,});
		this.forceUpdate();
	}

	// errorArart 닫기 
	errorArartClose(){
		this.setState({open:false,});
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

	// password enter 클릭시, 로그인 처리
	pwHandleKeydown = (e) => {
		if(e.keyCode === 13){
			const loginHandleClick = this.loginHandleClick.bind(this);

			loginHandleClick();
		}
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

		const setShowLoadingBar = this.setShowLoadingBar.bind(this);

		setShowLoadingBar(true);

		const { email, password, globalState, setGlobalState } = this.state;

		if(email == ""){
			this.showValidationErr("email", "이메일을 입력해주세요!");
		} 
		
		if(password == "") {
			this.showValidationErr("password", "비밀번호를 입력해주세요!");
		} 
		
		if(email != "" && password != "") {

			axios({
				url: '/intranet/login',
				method: 'post',
				data: {
					email : email,
					password : password,
					isKeepLogin : this.state.isKeepLogin ? "Y" : "N",
				}
			}).then(response => {
				
				const loginSign = response.data.loginSign;
				const resPassSign = response.data.resPassSign;
				const isAdmin = response.data.isAdmin == "true";

				if(loginSign == 'true'){
					setGlobalState({
						...globalState,
						isAdmin: isAdmin
					});
					//로그인 후 세션 등록
					if(resPassSign == 'true'){
						location.href= getRootPath() +"/#/resPassword";
					} else {
						location.href= getRootPath() +"/#/";
					}
				} else {
					const errorArartOpen = this.errorArartOpen.bind(this);
					errorArartOpen();
					setShowLoadingBar(false);
				}

			}).catch(e => {
				console.log(e);
				setShowLoadingBar(false);
			});

		}

		setShowLoadingBar(false);
	} 

	handleChange = (event) => {
		this.setState({
			...this.state,
			isKeepLogin : event.target.checked
		})
	};

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
		
		let open = this.state.open;

		for(let err of this.state.errors){
			if(err.elm == "email"){
				emailErr = err.msg;
			} if(err.elm == "password"){
				passwordErr = err.msg;
			}
		}

		return (
			<React.Fragment>
				<LoadingBar openLoading={this.state.isShowLoadingBar}/>
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					{/* <img style={{ width: 100, height: 100 }} alt='log' src='https://lifesaver.codes/amazonbook1.jpg' /> */}
					<Typography variant="h3" component="h2" align="center">
						로그인
					</Typography>
					
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
								onKeyDown={this.pwHandleKeydown.bind(this)}
							/>
							{passwordErr ? <Alert severity="error">{passwordErr}</Alert> : ""}
							<FormControlLabel
								control={
								<Checkbox
									checked={this.state.isKeepLogin}
									onChange={this.handleChange.bind(this)}
									name="isKeepLogin"
									color="primary"
								/>
								}
								label="자동 로그인"
							/>
							
							<Button
								type="button"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={this.loginHandleClick.bind(this)}
							>
								로그인 
							</Button>
							<div style={{height : 40}}/>
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
							존재하지 않는 아이디 이거나 비밀번호가 틀립니다.
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

export default SignIn;