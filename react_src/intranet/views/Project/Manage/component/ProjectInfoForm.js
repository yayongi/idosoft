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

import { LoadingBar } from '../../../Admin/component/utils';

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

/*
	state 변경에 Re-Rendering 수행
	state의 값이 이전과 동일해도 수행이 안됨.
	전역 변수는 호출 안됨.
*/
export default function ProjectInfoForm(props) {
	const classes = useStyles();
	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const { location, history } = props.routeProps.routeProps;
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(true, []);    //loading bar
	const [instt_list, setInstt] = React.useState([], []);
	const [member_list, setMember] = React.useState([], []);
	const [dataState, setDataState] = React.useState({
		PROJECT_NM : "",
		INSTT_CODE : "",
		BGNDE : Moment(new Date()).format('YYYY-MM-DD'),
		ENDDE : Moment(new Date()).format('YYYY-MM-DD'),
		TRANSPORT_CT : "",
		PM : "",
	});	// state : 수정을 위한 데이터 관리
	useEffect(() => {
		axios({
			url: '/intranet/projectInfo',
			method: 'post',
			data: {"CODE_ID":"CD0008"}
		}).then(response => {
			console.log("response : ");
			console.log(response.data.code_list);
			console.log(response.data.member_list);
			setInstt(response.data.code_list);
			setMember(response.data.member_list);
			setShowLoadingBar(false);
		}).catch(e => {
			console.log(e);
			setShowLoadingBar(false);
		});
	}, []);

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

	const handleChangeBgnDate = (date) => {
		setDataState({
			...dataState,
			BGNDE: Moment(date).format('YYYY-MM-DD')
		});
	}

	const handleChangeEndDate = (date) => {
		setDataState({
			...dataState,
			ENDDE: Moment(date).format('YYYY-MM-DD')
		});
	}

	const handleClickAddProject = () => {
		setShowLoadingBar(true);

		axios({
			url: '/intranet/insertProject',
			method: 'post',
			data: dataState
		}).then(response => {
			alert("등록 되었습니다.");
			setShowLoadingBar(false);
		}).catch(e => {
			console.log(e);
			setShowLoadingBar(false);
		});
		//history.goBack();
	}

	const handleClickRemoveProject = () => {
		history.goBack();
	}

	const handleClickUpdateProject = () => {
		alert("수정되었습니다.");
		history.goBack();
	}

	const handleClickProjectMemberAdd = (dataState) => {
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
											프로젝트 등록
										</Typography>
										<div>
											<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickCancle}>
												취소
											</Button>
											<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickAddProject}>
												등록
											</Button>
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
										defaultValue={dataState.PROJECT_NM}
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
												onChange={handleChangeBgnDate}
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
												onChange={handleChangeEndDate}
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
										defaultValue={dataState.TRANSPORT_CT}
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
			</div>
		</>
	);
}