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
	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const { location, history } = props.routeProps.routeProps;
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(true, []);    //loading bar
	const [dataState, setDataState] = React.useState([]);	// state : 수정을 위한 데이터 관리
	const [instt_list, setInstt] = React.useState([], []);
	const [member_list, setMember] = React.useState([], []);
	const classes = useStyles();

	useEffect(() => {
		axios({
			url: '/intranet/projectInfo',
			method: 'post',
			data: {"code_id":""}
		}).then(response => {
			console.log("response : ");
			console.log(response);
			setShowLoadingBar(false);
		}).catch(e => {
			console.log(e);
			setShowLoadingBar(false);
		});
	}, []);

	// 필드 값 변경 시, 임시로 값 저장
	const handleChange = event => {
		if(event.target.name == 'transport_ct') {	// 결제금액 특수문자 제거
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
			bgnde: Moment(date).format('YYYY-MM-DD')
		});
	}

	const handleChangeEndDate = (date) => {
		setDataState({
			...dataState,
			endde: Moment(date).format('YYYY-MM-DD')
		});
	}

	const handleClickAddProject = () => {
		alert("등록 되었습니다.");
		history.goBack();
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
										id="project_nm"
										name="project_nm"
										margin="dense"
										variant="outlined"
										defaultValue={dataState.project_nm}
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
										id="instt_code"
										name="instt_code"
										margin="dense"
										variant="outlined"
										onChange={handleChange}
										value={dataState.instt_code}
										fullWidth
										select>
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
												id="bgnde"
												name="bgnde"
												views={["year", "month", "date"]}
												format="yyyy-MM-dd"
												minDate={new Date()}
												value={new Date()}
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
												id="endde"
												name="endde"
												views={["year", "month", "date"]}
												format="yyyy-MM-dd"
												maxDate={dataState.endde}
												value={new Date()}
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
										id="transport_ct"
										name="transport_ct"
										variant="outlined"
										currencySymbol="￦"
										minimumValue="0"
										decimalPlaces={0}
										defaultValue={dataState.pay}
										defaultValue={dataState.transport_ct}
										onChange={handleChange}
										fullWidth
									/>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" component="th" scope="row">PM</TableCell>
								<TableCell align="left">
									<TextField
										id="pm"
										name="pm"
										variant="outlined"
										onChange={handleChange}
										value={dataState.pm}
										fullWidth
										select>
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