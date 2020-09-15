import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";
import Moment from "moment";
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

import { LoadingBar } from '../../../../common/LoadingBar/LoadingBar';
import { processErrCode, getRootPath } from '../../../../js/util';

import CommonDialog from '../../../../js/CommonDialog';

import axios from 'axios';

import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
	table: {
		minWidth: 650,
	},
	title: {
		flex: '1',
	},
	button: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	root: {
		width: '100%',
	},
	backButton: {
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	paper: {
		backgroundColor: '#efefef',
		color: 'black',
		padding: '5px 10px',
		borderRadius: '4px',
		fontSize: '13px',
		border: '1px solid black',
		marginTop: theme.spacing(1),
	},

}));

const HistoryInfoRegist = (props) => {
	const classes = useStyles();
	const [infoState, setInfoState] = useState({
		INPT_BGNDE : null,
		INPT_ENDDE : null
	});
	const [projectList, setProjectList] = useState([]);
	const [memberList, setMemberList] = useState([]);
	const [dateState, setDateState] = useState({
		selectedYear : String(new Date().getFullYear()),
	});
	const [roleList, setRoleList] = useState();
	const [company, setCompany] = useState({
		INSTT_NM : "",
		INSTT_CODE : "",
	});
	const [dialog, setDialog] = useState({});

	const [validateCheck, setValidateCheck] = useState({
		PROJECT_NO:{error:false, helperText:""},
		PROJECT_NM:{error:false, helperText:""},
		INSTT_NM:{error:false, helperText:""},
		INPT_BGNDE:{error:false, helperText:""},
		INPT_ENDDE:{error:false, helperText:""},
		ROLE_CODE:{error:false, helperText:""},
		CHRG_JOB:{error:false, helperText:""},
		USE_LANG:{error:false, helperText:""}
	});

	const { match, location, history } = props.routeProps.routeProps;

	//사원 정보 가져오기
	useEffect(() => {
		axios({
			url: '/intranet/history/memberList',
			method: 'post'
		}).then(response => {
			setMemberList(response.data);
			if(JSON.parse(sessionStorage.getItem("loginSession")).member_NO != "99999999"){
				setInfoState({
					...infoState,
					MEMBER_NAME : JSON.parse(sessionStorage.getItem("loginSession")).name,
					MEMBER_NO : JSON.parse(sessionStorage.getItem("loginSession")).member_NO,
					REG_ID : JSON.parse(sessionStorage.getItem("loginSession")).member_NO
				});
			}
			getRoleList();
			getProjectList(String(new Date().getFullYear()));
			
		}).catch(e => {
			processErrCode(e);
		});
	},[])

	useEffect(() => {
		setInfoState({
			...infoState,
			INSTT_NM : company.INSTT_NM,
			INSTT_CODE : company.INSTT_CODE
		});
	},[company])

	//특정 연도 프로젝트 가져오기
	const getProjectList = (data) => {
		axios({
			url: '/intranet/history/getprojectlist',
			method: 'post',
			data: {year: data}
		}).then(response => {
			setProjectList(response.data);
		}).catch(e => {
			//setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	//직무 가져오기
	const getRoleList = () => {
		axios({
			url: '/intranet/history/getrolelist',
			method: 'post'
		}).then(response => {
			setRoleList(response.data);
		}).catch(e => {
			//setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	//프로젝트에 따른 기관 가져오기
	const getCompany = (data) => {
		axios({
			url: '/intranet/history/getcompany',
			method: 'post',
			data: {project_no: data}
		}).then(response => {
			setCompany({
				INSTT_NM : response.data.CODE_NAME,
				INSTT_CODE : response.data.CODE_ID,
			});
		}).catch(e => {
			//setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	//개인이력 수정 등록
	const saveData = () => {
		axios({
			url: '/intranet/history/insert',
			method: 'post',
			data: infoState,
		}).then(response => {
			history.goBack();
		}).catch(e => {
			//setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	
	const changeYear = (date) => {
		setDateState({
			...dateState,
			selectedYear : String(Moment(date).format('YYYY'))
		});
		getProjectList(Moment(date).format('YYYY'));
	}

	const handleChange = (event) => {
		if(event.target.name == "PROJECT_NO"){
			getCompany(event.target.value);
		}

		if(event.target.name == "INSTT_NM"){
			setCompany({
				...company,
				INSTT_NM : event.target.value
			})
		}

		if(event.target.name == "PROJECT_NO"){
			if(event.target.value != 0){
				setInfoState({
					...infoState,
					[event.target.name]: event.target.value,
					PROJECT_NM : event.target.value != 0 ? projectList.filter((list) => list.PROJECT_NO === event.target.value)[0].PROJECT_NM : event.target.value
				});
			}else{
				setInfoState({
					...infoState,
					[event.target.name]: event.target.value,
					PROJECT_NM : ""
				});
				setCompany({
					...company,
					INSTT_NM : ""
				});
			}
		}else{
			setInfoState({
				...infoState,
				[event.target.name]: event.target.value,
			});
		}

		//validate 체크 초기화
		setValidateCheck({
			...validateCheck,
			[event.target.name]: {error:false, helperText:""} 
		});
	}

	const handleChangeInpt_bgnde = (date) => {
		setInfoState({
			...infoState,
			INPT_BGNDE: Moment(date).format('YYYYMMDD')
		});
	}

	const handleChangeInpt_endde = (date) => {
		setInfoState({
			...infoState,
			INPT_ENDDE: Moment(date).format('YYYYMMDD')
		});
	}

	const handleClickRegistHistory = () => {

		//선택된 프로젝트가 있는지 체크한다.
		if(infoState.PROJECT_NO == 0 && infoState.PROJECT_NM == ""){
			setValidateCheck({
				...validateCheck,
				PROJECT_NM : {error:true, helperText:"프로젝트명을 직접 입력해주세요."}
			})
			return;
		}

		//선택된 프로젝트가 있는지 체크한다.
		if(infoState.PROJECT_NO == 0 && (infoState.INSTT_NM == "" || infoState.INSTT_NM == undefined)){
			setValidateCheck({
				...validateCheck,
				INSTT_NM : {error:true, helperText:"프로젝트 업체를 직접 입력하세요."}
			})
			return;
		}

		//담당업무
		if(infoState.CHRG_JOB == "" || infoState.CHRG_JOB == undefined){
			setValidateCheck({
				...validateCheck,
				CHRG_JOB : {error:true, helperText:"담당 업무를 입력해주세요"}
			})
			return;
		}
		
		if(infoState.USE_LANG == "" || infoState.USE_LANG == undefined){
			setValidateCheck({
				...validateCheck,
				USE_LANG : {error:true, helperText:"사용 기술을 입력해주세요"}
			})
			return;
		}

		if(infoState.ROLE_CODE == "" || infoState.ROLE_CODE == undefined){
			setValidateCheck({
				...validateCheck,
				ROLE_CODE : {error:true, helperText:"역할을 입력해주세요"}
			})
			return;
		}

		if(infoState.INPT_BGNDE == undefined || infoState.INPT_ENDDE == undefined){
			setValidateCheck({
				...validateCheck,
				INPT_BGNDE : {error:true, helperText:"투입일과 철수일을 확인해주세요"},
				INPT_ENDDE : {error:true, helperText:"투입일과 철수일을 확인해주세요"}
			})
			return;
		}else{
			if(infoState["INPT_BGNDE"] > infoState["INPT_ENDDE"]){
				setValidateCheck({
					...validateCheck,
					INPT_BGNDE : {error:true, helperText:"투입일과 철수일을 확인해주세요"},
					INPT_ENDDE : {error:true, helperText:"투입일과 철수일을 확인해주세요"}
				})
				return;
			}

			if(infoState.PROJECT_NO != undefined && infoState.PROJECT_NO != 0){
				var selectedProjectInfo = projectList.filter((info) => info.PROJECT_NO == infoState.PROJECT_NO)[0];
				var selProjectBGNDE = selectedProjectInfo["BGNDE"].replace("-", "").replace("-", "");
				var selProjectENDDE = selectedProjectInfo["ENDDE"].replace("-", "").replace("-", "");
				if(infoState["INPT_BGNDE"] < selProjectBGNDE){
					setValidateCheck({
						...validateCheck,
						INPT_BGNDE : {error:true, helperText:"프로젝트 최초 투입일은 "+Moment(selectedProjectInfo["BGNDE"]).format("YYYY-MM-DD")+"입니다."},
					})
					return;
				}
				
				if(infoState["INPT_ENDDE"] > selProjectENDDE){
					setValidateCheck({
						...validateCheck,
						INPT_ENDDE : {error:true, helperText:"프로젝트 최종 철수일은 "+Moment(selectedProjectInfo["ENDDE"]).format("YYYY-MM-DD")+"입니다."}
					})
					return;
				}
			}
		}
		handleOpenDialog("이력등록", "이력을 등록하시겠습니까?", true);
	}
	
	//Dialog open handler
	const handleOpenDialog = (title, content, isConfirm) => {
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	//Dialog close handler
	//확인:true 취소:false 리턴
	const handleCloseDialog = (title, result) => {
		setDialog({title:'', content:'', onOff:false, isConfirm:false});
		if(result && title == "이력등록"){
			saveData();
		}else{
			return;
		}
	}

	return (
		<>
		<CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
		<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell 
								align="left"
								 colSpan="6">
								<Typography className={classes.title} color="inherit" variant="h6">
									이력관리 등록
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="MEMBER_NO"
									name="MEMBER_NO"
									margin="dense"
									variant="outlined"
									label = "이름"
									autoComplete="off"
									fullWidth
									value = {infoState.MEMBER_NAME != undefined && infoState.MEMBER_NAME}
									InputProps={{
									 	 readOnly: true,
									}}
									onChange={handleChange}
									select>
									{memberList != null && memberList.map(option => (
									<MenuItem key={option.MEMBER_NO} value={option.NAME}>
										{option.NAME}
									</MenuItem>
									))}
								</TextField>
							</TableCell>
							<TableCell align="left">
								<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
									<Grid container justify="space-around">
										<DatePicker
											label="연도선택"
											locale='ko'
											margin="dense"
											id="date"
											views={["year"]}
											format="yyyy"
											inputVariant="outlined"
											value={dateState.selectedYear}
											onChange={changeYear}
										/>
									</Grid>
								</MuiPickersUtilsProvider>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row" colSpan="2" style={{color:"red", fontSize:"12px"}}>회사에서 진행한 프로젝트만 년도를 선택해주세요
							(년도를 선택하면 해당 년도의 프로젝트 목록을 불러옵니다.)</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="PROJECT_NO"
									name="PROJECT_NO"
									margin="dense"
									variant="outlined"
									label = "프로젝트명"
									autoComplete="off"
									fullWidth
									onChange={handleChange}
									error={validateCheck.PROJECT_NO.error}
									helperText={validateCheck.PROJECT_NO.helperText}
									select>
									<MenuItem key="0" value={0}>
										직접입력
									</MenuItem>
									{projectList != null && projectList.map(option => (
										<MenuItem key={option.PROJECT_NO} value={option.PROJECT_NO}>
										{option.PROJECT_NM}
										</MenuItem>
									))}
								</TextField>
							</TableCell>
							<TableCell align="left">
								<TextField
									id="PROJECT_NM"
									name="PROJECT_NM"
									margin="dense"
									variant="outlined"
									autoComplete="off"
									label = "프로젝트명(직접입력)"
									onChange={handleChange}
									placeholder="회사 프로젝트는 년도와 프로젝트를 선택해주세요"
									error={validateCheck.PROJECT_NM.error}
									helperText={validateCheck.PROJECT_NM.helperText}
									fullWidth>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="INSTT_NM"
									name="INSTT_NM"
									margin="dense"
									variant="outlined"
									placeholder="직접입력"
									label = "기관"
									onChange={handleChange}
									autoComplete="off"
									value = {company.INSTT_NM}
									InputProps={{
										readOnly: false,
									  }}
									error={validateCheck.INSTT_NM.error}
									helperText={validateCheck.INSTT_NM.helperText}
									fullWidth>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" >
								<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
									<Grid container justify="space-around">
										<DatePicker
											locale='ko'
											margin="dense"
											id="INPT_BGNDE"
											name="INPT_BGNDE"
											label = "투입일"
											views={["year", "month", "date"]}
											value={infoState.INPT_BGNDE != null ? Moment(infoState.INPT_BGNDE).format('YYYY-MM-DD') : null}
											onChange={handleChangeInpt_bgnde}
											error={validateCheck.INPT_BGNDE.error}
											helperText={validateCheck.INPT_BGNDE.helperText}
											format="yyyy-MM-dd"
											inputVariant="outlined"
											fullWidth
										/>
									</Grid>
								</MuiPickersUtilsProvider>
							</TableCell>
							<TableCell>
								<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
									<Grid container justify="space-around">
										<DatePicker
											locale='ko'
											margin="dense"
											id="INPT_ENDDE"
											name="INPT_ENDDE"
											label = "철수일"
											views={["year", "month", "date"]}
											value={infoState.INPT_ENDDE != null ? Moment(infoState.INPT_ENDDE).format('YYYY-MM-DD') : null}
											onChange={handleChangeInpt_endde}
											error={validateCheck.INPT_ENDDE.error}
											helperText={validateCheck.INPT_ENDDE.helperText}
											format="yyyy-MM-dd"
											inputVariant="outlined"
											readOnly={false}
											fullWidth
										/>
									</Grid>
								</MuiPickersUtilsProvider>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="ROLE_CODE"
									name="ROLE_CODE"
									variant="outlined"
									label="역할"
									onChange={handleChange}
									autoComplete="off"
									fullWidth
									error={validateCheck.ROLE_CODE.error}
									helperText={validateCheck.ROLE_CODE.helperText}
									select>
									{(roleList != null) && roleList.map(tmp => (
									<MenuItem key={tmp.CODE_ID} value={tmp.CODE_ID} name={tmp.CODE_NAME}>
										{tmp.CODE_NAME}
									</MenuItem>
									))}
								</TextField>
							</TableCell>
							<TableCell align="left">
								<TextField
									id="CHRG_JOB"
									name="CHRG_JOB"
									variant="outlined"
									autoComplete="off"
									onChange={handleChange}
									error={validateCheck.CHRG_JOB.error}
									helperText={validateCheck.CHRG_JOB.helperText}
									label = "담당업무"
									fullWidth>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<TextField
									id="USE_LANG"
									name="USE_LANG"
									variant="outlined"
									autoComplete="off"
									error={validateCheck.USE_LANG.error}
									helperText={validateCheck.USE_LANG.helperText}
									onChange={handleChange}
									label = "비고(사용언어)"
									fullWidth>
								</TextField>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<Toolbar>
				<Typography className={classes.title} color="secondary" variant="subtitle2">
				</Typography>
				<div>
					<Button variant="contained" color="primary" size="small" className={classes.button} onClick={() => history.goBack()}>
						취소
					</Button>
					<Button variant="contained" color="primary" size="small" className={classes.button} onClick={() => handleClickRegistHistory()}>
						등록
					</Button>
				</div>
			</Toolbar>
		</>
	);
}
export default HistoryInfoRegist;