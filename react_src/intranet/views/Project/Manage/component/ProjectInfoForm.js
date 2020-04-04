import React, { useEffect } from 'react';
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
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';

import { LoadingBar }  from '../../../../common/LoadingBar/LoadingBar';

import axios from 'axios';

import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

import { Link as RouterLink } from 'react-router-dom';


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

function initCheck(match){
	return typeof(match.params.id) == "undefined" ? "new" : "modify";
}
function ProjectInfoForm(props) {
	console.log("props : ");
	console.log(props);


	const classes = useStyles();
	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const { location, match, history } = props.routeProps.routeProps;
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(true, []);    //loading bar
	const [instt_list, setInstt] = React.useState([], []);
	const [member_list, setMember] = React.useState([], [member_list]);
	const [role_list, setRole] = React.useState([], []);
	const [updatedMemList, setUpdateMemList] = React.useState([], []);
	const [renderWant, setRenderWant] = React.useState(true);
	const screenType = initCheck(match);
	
	const [dataState, setDataState] = React.useState({
		PROJECT_NM : "",
		INSTT_CODE : "",
		BGNDE : Moment(new Date()).format('YYYY-MM-DD'),
		ENDDE : Moment(new Date()).format('YYYY-MM-DD'),
		TRANSPORT_CT : "",
		PM : "",
	});	// state : 수정을 위한 데이터 관리
	const [memDataState, setMemDataState] = React.useState([{
		MEMBER_NO : "",
		CHRG_JOB : "",
		INPT_BGNDE : Moment(new Date()).format('YYYY-MM-DD'),
		INPT_ENDDE : Moment(new Date()).format('YYYY-MM-DD'),
		ROLE_CODE : "RL0001",
		USE_LANG : "Java,Jsp,Javascript",
	}]);	// state : 수정을 위한 데이터 관리




	const columnsUp = [
		{ id: 'MEMBER_NO', label: '이름', minWidth: 100, align: 'center' },
		{ id: 'CHRG_JOB', label: '담당업무', minWidth: 100, align: 'center' },
		{ id: 'TERM', label: '프로젝트 기간', minWidth: 100, align: 'center' },
		{ id: 'ROLE', label: '역할', minWidth: 100, align: 'center' },
		{ id: 'USE_LANG', label: '비고', minWidth: 100, align: 'center' },
		{ id: 'BTN', label: '수정/삭제', minWidth: 100, align: 'center' },
	];
	const columnsDown = [
		{ id: 'MEMBER_NO', label: '이름', minWidth: 100, align: 'center' },
		{ id: 'CHRG_JOB', label: '담당업무', minWidth: 100, align: 'center' },
		{ id: 'BTN', label: '수정/삭제', minWidth: 100, align: 'center' },
	];
    let columns = columnsUp;
    if (isWidthUp('md', props.width)) {
      columns = columnsUp;
    } else {
      columns = columnsDown;
    }


	useEffect(() => {
		setUpdateMemList([]);
		if(screenType == "new"){
			axios({
				url: '/intranet/projectInfo',
				method: 'post',
				data: {"CODE_ID": ["CD0008", "CD0009"]}
			}).then(response => {
				setInstt(response.data.code_list);
				setMember(response.data.member_list);
				setRole(response.data.role_list);
				setShowLoadingBar(false);
			}).catch(e => {
				setShowLoadingBar(false);
				processErrCode(e);
			});
		}else if(screenType == "modify"){
			axios({
				url: '/intranet/projectDetailInfo',
				method: 'post',
				data: {"PROJECT_NO": match.params.id}
			}).then(response => {
				setInstt(response.data.code_list);
				setMember(response.data.member_list);
				setRole(response.data.role_list);

				var projectInfo = response.data.project_info;
				projectInfo["BGNDE"] = projectInfo["BGNDE"].slice(0,4) + "-" + projectInfo["BGNDE"].slice(4,6) + "-" + projectInfo["BGNDE"].slice(6,8);  
				projectInfo["ENDDE"] = projectInfo["ENDDE"].slice(0,4) + "-" + projectInfo["ENDDE"].slice(4,6) + "-" + projectInfo["ENDDE"].slice(6,8);  
				setDataState(projectInfo);

				var proMemList = response.data.proMemList;
				for(var idx=0; idx < proMemList.length; idx++){
					proMemList[idx]["INPT_BGNDE"] = proMemList[idx]["INPT_BGNDE"].slice(0,4) + "-" + proMemList[idx]["INPT_BGNDE"].slice(4,6) + "-" + proMemList[idx]["INPT_BGNDE"].slice(6,8);
					proMemList[idx]["INPT_ENDDE"] = proMemList[idx]["INPT_ENDDE"].slice(0,4) + "-" + proMemList[idx]["INPT_ENDDE"].slice(4,6) + "-" + proMemList[idx]["INPT_ENDDE"].slice(6,8);
				}
				setMemDataState([...proMemList]);
				setShowLoadingBar(false);
			}).catch(e => {
				setShowLoadingBar(false);
				processErrCode(e);
			});
		}
	}, [renderWant]);

	const handleAddRow = () => {
		console.log(memDataState);

		var member_defaultForm = {
			MEMBER_NO : "",
			CHRG_JOB : "",
			INPT_BGNDE : Moment(new Date()).format('YYYY-MM-DD'),
			INPT_ENDDE : Moment(new Date()).format('YYYY-MM-DD'),
			ROLE_CODE : "RL0001",
			USE_LANG : "Java,Jsp,Javascript",
		}

		memDataState.push(member_defaultForm)
		setMemDataState([...memDataState]);
	}

	// 필드 값 변경 시, 임시로 값 저장
	const handleChange = event => {
		if(event.target.name == 'TRANSPORT_CT') {	// 결제금액 특수문자 제거
			event.target.value = event.target.value.replace(/[^0-9]/g, '');
		}
		setDataState({
			...dataState,
			[event.target.name]: event.target.value
		});
	};

	const handleMemChange = (event, idx) => {
		if(screenType == "modify" && updatedMemList.indexOf(idx) < 0){
			updatedMemList.push(idx);
			setUpdateMemList(updatedMemList);
		}

		memDataState[idx][event.target.name] = event.target.value;
		setMemDataState([...memDataState]);
	}

	const handleChangeDate = (date, target, idx) => {
		console.log("handleChangeDate : ");
		if(!target.includes("INPT_")){
			console.log("target not include inpt_");
			setDataState({
				...dataState,
				[target]: Moment(date).format('YYYY-MM-DD')
			});
		}else{
			console.log("target include inpt_");
			if(screenType == "modify" && updatedMemList.indexOf(idx) < 0){
				updatedMemList.push(idx);
				setUpdateMemList(updatedMemList);
			}
			memDataState[idx][target] = Moment(date).format('YYYY-MM-DD'); 
			setMemDataState([...memDataState]);
		}
	}

	const handleClickAddProject = () => {
		setShowLoadingBar(true);

		//투입인원테이블에 PM도 추가
		var mDataState = [{
			MEMBER_NO : dataState["PM"],
			CHRG_JOB : "PM",
			INPT_BGNDE : dataState["BGNDE"],
			INPT_ENDDE : dataState["ENDDE"],
			ROLE_CODE : "RL0000",
			USE_LANG : "PM",
		}].concat(memDataState);

		var instt = instt_list.filter((info) => (info.instt_code == dataState.instt_code))[0];

		axios({
			url: '/intranet/insertProject',
			method: 'post',
			data: {"dataState" : dataState, "memDataState": mDataState, "instt_name":instt["CODE_NAME"], "instt_code":instt["CODE_ID"]}
		}).then(response => {
			if(!response.data.isDBError){
				alert("등록 되었습니다.");
				history.goBack();
			}else{
				alert("등록 실패했습니다.");
			}
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	const handleClickModifyProject = () => {
		console.log("updatedMemList : ");
		console.log(updatedMemList);

		var memUpdateList = [];
		for(var i=0; i < updatedMemList.length; i++){
			memUpdateList.push(memDataState[updatedMemList[i]]);
		}


		setShowLoadingBar(true);
		axios({
			url: '/intranet/updateProjectInfo',
			method: 'post',
			data: {"PROJECT_NO":match.id, "dataState": dataState, "memDataState":memUpdateList}
		}).then(response => {
			setShowLoadingBar(false);
			if(response.data.isDBError){
				alert("수정 실패했습니다.")
			}else{
				alert("수정되었습니다.");
				history.goBack();
			}
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	const handleClickRemoveProject = () => {
		setShowLoadingBar(true);
		axios({
			url: '/intranet/removeProject',
			method: 'post',
			data: {"PROJECT_NO": match.params.id}
		}).then(response => {
			setShowLoadingBar(false);
			if(response.data.isDBError){
				alert("삭제 실패 했습니다.")
			}else{
				alert("삭제했습니다.");
				history.goBack();
			}
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}

	const handleRemoveMember = (member_no) => {
		var list = memDataState.filter((info) => (info.MEMBER_NO != member_no));
		
		setShowLoadingBar(true);
		axios({
			url: '/intranet/removeMember',
			method: 'post',
			data: {"PROJECT_NO": match.params.id, "MEMBER_NO" : member_no}
		}).then(response => {
			setShowLoadingBar(false);
			if(response.data.isDBError){
				alert("삭제 실패 했습니다.")
			}else{
				alert("삭제했습니다.");
				setMemDataState([...list]);
				setRenderWant(!renderWant);
			}
		}).catch(e => {
			setShowLoadingBar(false);
			processErrCode(e);
		});
	}
	
	const handleClickCancle = () => {
		history.goBack();
	};

	return (
			<>
			<LoadingBar openLoading={isShowLoadingBar}/>
			<div className={classes.root}>
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="left" colSpan="2">
									<Toolbar>
										<Typography className={classes.title} color="inherit" variant="h6">
											{screenType == "new" ? "프로젝트 등록" : "프로젝트 수정"}
										</Typography>
										<div>
											<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickCancle}>
												취소
											</Button>

											{
												screenType == "new" &&
												<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickAddProject}>
													등록
												</Button>
											}
											{
												screenType == "modify" &&
												<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickModifyProject}>
													수정
												</Button>
											}
											{
												screenType == "modify" &&
												<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickRemoveProject}>
													삭제
												</Button>
											}
										</div>
									</Toolbar>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell align="left" component="th" scope="row" style={{ width: '120px' }}>프로젝트명</TableCell>
								<TableCell align="left">
									<TextField
										id="PROJECT_NM"
										name="PROJECT_NM"
										margin="dense"
										variant="outlined"
										value={dataState.PROJECT_NM}
										onChange={handleChange}
										fullWidth
									>
									</TextField>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" component="th" scope="row">발주처</TableCell>
								<TableCell align="left">
									<TextField
										id="INSTT_CODE"
										name="INSTT_CODE"
										margin="dense"
										variant="outlined"
										onChange={handleChange}
										value={dataState.INSTT_CODE}
										fullWidth
										select>
										{instt_list.map(info => (
											<MenuItem key={info.CODE_ID} value={info.CODE_ID}>
												{info.CODE_NAME}
											</MenuItem>
										))}
									</TextField>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" component="th" scope="row">착수일</TableCell>
								<TableCell align="left">
									<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
										<Grid container justify="space-around">
											<DatePicker
												locale='ko'
												margin="dense"
												id="BGNDE"
												name="BGNDE"
												views={["year", "month", "date"]}
												format="yyyy-MM-dd"
												/* minDate={new Date()} */
												value={dataState.BGNDE}
												onChange={(data) => {handleChangeDate(data, "BGNDE")}}
												inputVariant="outlined"
												readOnly={false}
												// InputAdornmentProps={{ position: "start" }}
												fullWidth
											/>
										</Grid>
									</MuiPickersUtilsProvider>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" component="th" scope="row">종료일</TableCell>
								<TableCell align="left" >
									<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
										<Grid container justify="space-around">
											<DatePicker
												locale='ko'
												margin="dense"
												id="ENDDE"
												name="ENDDE"
												views={["year", "month", "date"]}
												format="yyyy-MM-dd"
												/* maxDate={dataState.ENDDE} */
												value={dataState.ENDDE}
												onChange={(data) => {handleChangeDate(data, "ENDDE")}}
												inputVariant="outlined"
												readOnly={false}
												fullWidth
											/>
										</Grid>
									</MuiPickersUtilsProvider>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" component="th" scope="row">교통비</TableCell>
								<TableCell align="left">
									<CurrencyTextField
										id="TRANSPORT_CT"
										name="TRANSPORT_CT"
										variant="outlined"
										currencySymbol="￦"
										minimumValue="0"
										decimalPlaces={0}
										value={dataState.TRANSPORT_CT}
										onChange={handleChange}
										fullWidth
									/>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" component="th" scope="row">PM</TableCell>
								<TableCell align="left">
									<TextField
										id="PM"
										name="PM"
										variant="outlined"
										onChange={handleChange}
										value={dataState.PM}
										fullWidth
										select>
										{member_list.map(info => (
											<MenuItem key={info.member_no} value={info.member_no}>
												{info.name}
											</MenuItem>
										))}
									</TextField>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>

				<TableContainer>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell align="left" colSpan="6">
									<Toolbar>
										<Typography className={classes.title} color="inherit" variant="h6">
											투입인원
										</Typography>
										<div>
											<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleAddRow}>
												추가
											</Button>
										</div>
									</Toolbar>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								{columns.map(column => (
									<TableCell
										key={column.id}
										align={column.align}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
							{memDataState.map((row, idx) => {
								return (
									<TableRow
										key={"row"+idx}>
										<TableCell 
											align="left"
											key={"NAME" + idx}>
											<TextField
												id="MEMBER_NO"
												name="MEMBER_NO"
												margin="dense"
												variant="outlined"
												value={memDataState[idx]["MEMBER_NO"]}
												onChange={(event) => {handleMemChange(event, idx)}}
												readOnly={screenType=="modify"}
												fullWidth
												select
											>
											{member_list.map(info => {
												if(screenType == "new" || memDataState[idx]["MEMBER_NO"] == info.member_no || !memDataState[idx]["MEMBER_NO"]){
													return (
														<MenuItem key={info.member_no} value={info.member_no}>
															{info.name}
														</MenuItem>
													)
												}
											})}
											</TextField>
										</TableCell>
										<TableCell 
											align="left"
											key={"CHRG_JOB" + idx}>
											<TextField
												id="CHRG_JOB"
												name="CHRG_JOB"
												margin="dense"
												variant="outlined"
												value={memDataState[idx]["CHRG_JOB"]}
												onChange={(event) => {handleMemChange(event, idx)}}
												fullWidth
											>
											</TextField>
										</TableCell>
										{ isWidthUp('md', props.width) && 
											<TableCell 
												align="left"
												key={"INPT" + idx}>
												<Toolbar>
													<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
														<Grid container justify="space-around">
															<DatePicker
																locale='ko'
																margin="dense"
																id="INPT_BGNDE"
																name="INPT_BGNDE"
																views={["year", "month", "date"]}
																format="yyyy-MM-dd"
																minDate={dataState.BGNDE}
																value={memDataState[idx]["INPT_BGNDE"]}
																onChange={(data) => {handleChangeDate(data, "INPT_BGNDE", idx)}}
																inputVariant="outlined"
																readOnly={false}
																fullWidth
															/>
														</Grid>
													</MuiPickersUtilsProvider>
													~
													<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
														<Grid container justify="space-around">
															<DatePicker
																locale='ko'
																margin="dense"
																id="INPT_ENDDE"
																name="INPT_ENDDE"
																views={["year", "month", "date"]}
																format="yyyy-MM-dd"
																maxDate={dataState.ENDDE}
																value={memDataState[idx]["INPT_ENDDE"]}
																onChange={(data) => {handleChangeDate(data, "INPT_ENDDE", idx)}}
																inputVariant="outlined"
																readOnly={false}
																fullWidth
															/>
														</Grid>
													</MuiPickersUtilsProvider>
												</Toolbar>
											</TableCell>
										}
										{ isWidthUp('md', props.width) && 
											<TableCell 
												align="left"
												key={"ROLE_CODE" + idx}>
												<TextField
													id="ROLE_CODE"
													name="ROLE_CODE"
													margin="dense"
													variant="outlined"
													value={memDataState[idx]["ROLE_CODE"]}
													onChange={(event) => {handleMemChange(event, idx)}}
													fullWidth
													select
												>
													{role_list.map(info => {
														if(screenType == "modify"){
															if(info.CODE_ID == memDataState[idx]["ROLE_CODE"]){
																return (										
																	<MenuItem key={info.CODE_ID} value={info.CODE_ID}>
																		{info.CODE_NAME}
																	</MenuItem>
																)
															}
														}else if(screenType == "new" && info.CODE_ID == "RL0000"){
															
														}else{
															return (										
																<MenuItem key={info.CODE_ID} value={info.CODE_ID}>
																	{info.CODE_NAME}
																</MenuItem>
															)
														}
													})}
												</TextField>
											</TableCell>
										}
										{ isWidthUp('md', props.width) && 
											<TableCell 
												align="left"
												key={"USE_LANG" + idx}>
												<TextField
													id="USE_LANG"
													name="USE_LANG"
													margin="dense"
													variant="outlined"
													value={memDataState[idx]["USE_LANG"]}
													onChange={(event) => {handleMemChange(event, idx)}}
													fullWidth
												>
												</TextField>
											</TableCell>
										}

										<TableCell 
											align="left"
											key={"BTN" + idx}>
											{ screenType == "modify" && dataState["PM"] != memDataState[idx]["MEMBER_NO"] &&
												<IconButton aria-label="delete" className={classes.margin} onClick={() => handleRemoveMember(memDataState[idx]["MEMBER_NO"])}>
													<DeleteIcon fontSize="small" />
												</IconButton>
											}
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</>
	);
}

export default withWidth()(ProjectInfoForm);