import React,{useEffect} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import FaceIcon from '@material-ui/icons/Face';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CommonDialog from '../../../../js/CommonDialog';
import { getRootPath, processErrCode } from '../../../../js/util';

// Server
import axios from 'axios';

export default function Top(props) {
	const {classes, handleDrawerOpen} = props;

	const [sessionState, setSessionState] = React.useState({
		isLogin : false,
		sessionName : null
	});

	useEffect(() => {
		axios({
			url: '/intranet/getSession',
			method: 'get'
		}).then(response => {
			sessionStorage.setItem("loginSession",response.data.SESSION_DATA);
			if(sessionStorage.getItem("loginSession") != null){
				setSessionState({
					isLogin : true,
					sessionName : JSON.parse(response.data.SESSION_DATA).name
				})
			}
		}).catch(e => {
			processErrCode(e, false);
		});
	},[])

	// confirm, alert 창 함수
  	// 초기값은 {}로 설정하고 온오프시  {title:'', content:'', onOff:'true of false'} 형식으로 setting됨.
	const [dialog, setDialog] = React.useState({});

	// Dialog창의 title과 content, confirm여부  담는 배열
	// 배열 없이도 파라미터 입력해서 사용가능
	const confirmData = ['로그아웃', '로그아웃하시겠습니까?', true];

	//Dialog open handler
	const handleOpenDialog = (title, content, isConfirm) => {
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	const handleCloseDialog = (title,result) => {
	setDialog({title:'', content:'', onOff:false, isConfirm:false});
		if(result){
			// 로그아웃 처리
			axios({
				url: '/intranet/logout',
				method: 'post',
				data: {}
			}).then(response => {
				sessionStorage.removeItem("loginSession");
				location.href = getRootPath() +'/#/signIn';
			}).catch(e => {
				processErrCode(e, false);
				console.log(e);
			});

		}else{
			return;
		}
	}

	return (
		<AppBar position="fixed" className={classes.appBar}>
		<CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerOpen}
					className={classes.menuButton}
				>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6" noWrap className={classes.title}>
					IDO-SOFT 인트라넷
				</Typography>
				<Typography variant="h6" noWrap >
					{sessionState.sessionName}님 환영합니다.
				</Typography>
				{sessionState.isLogin == true? (
					<IconButton color="inherit" onClick={() => handleOpenDialog(...confirmData)}>
						<ExitToAppIcon />
					</IconButton>
				) : (
					<IconButton color="inherit" component={RouterLink} to="/signIn">
						<FaceIcon />
					</IconButton>
				) }
			</Toolbar>
		</AppBar>
	);
}