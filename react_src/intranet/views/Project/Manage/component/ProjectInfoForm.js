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

import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

import { Link as RouterLink } from 'react-router-dom';
import { getSiteInfoDB, getMemberInfoDB } from '../../data';

function initData(location) {
	console.log("initData");
	//console.log(location.pathname);
	//console.log(location.search);

	var urlSplitList = location.pathname.split("/");
	var currentLastPath = urlSplitList[urlSplitList.length - 1];

	var data = {};
	data["screenType"] = currentLastPath == "new" ? "new" : "modify";
	data["project_nm"] = "";
	data["instt"] = "";
	data["insttList"] = getSiteInfoDB();
	data["bgnde"] = Moment(new Date()).format('YYYY-MM-DD');
	data["endde"] = Moment((new Date()).setFullYear(new Date().getFullYear() + 1)).format('YYYY-MM-DD');
	data["transport_ct"] = "";
	data["pm"] = "";
	data["memberList"] = getMemberInfoDB();


	var query = location.search;
	if (query) {
		query.replace("?", "").split("&").map((param => {
			var kValue = param.split("=")[0];
			var vValue = decodeURIComponent(param.split("=")[1]);
			return data[kValue] = vValue;
		}));
	}
	return data;
}

function jsonToQuery(obj) {
	return ('?' +
		Object.keys(obj).map(function (key) {
			return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
		}).join('&'));
}


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
	console.log("call ProjectInfoForm Area");

	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const { match, location, history } = props.routeProps.routeProps;
	const [dataState, setDataState] = React.useState(initData(location));	// state : 수정을 위한 데이터 관리
	const classes = useStyles();

	// 필드 값 변경 시, 임시로 값 저장
	const handleChange = event => {
		/** 임시 Code*/
		console.log(event.target.value);
		/** 임시 Code*/

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

		var projectData = JSON.parse(localStorage.getItem("resProjData"));

		var project_no  = projectData.length+1;
		var project_nm  = dataState.project_nm;
		var instt_code  = dataState.instt;
		var bgnde  = dataState.bgnde;
		var endde  = dataState.endde;
		var pm  = dataState.pm;
		var transport_ct  = dataState.transport_ct;
		var reg_datetime  = "20200321";
		var upd_datetime  = "";
		var reg_id  = dataState.pm;
		var upd_id  = "";
		var note  = "";
		var temp_colum  = "";

		projectData.push(
			{
				"project_no" :  project_no,
				"project_nm" : project_nm,
				"instt_code" : instt_code,
				"bgnde" : bgnde.replace(/[^0-9]/g, ''),
				"endde" : endde.replace(/[^0-9]/g, ''),
				"pm" : pm,
				"transport_ct" : transport_ct,
				"reg_datetime" : reg_datetime.replace(/[^0-9]/g, ''),
				"upd_datetime" : upd_datetime.replace(/[^0-9]/g, ''),
				"reg_id" : reg_id,
				"upd_id" : upd_id,
				"note" : note,
				"temp_colum" : temp_colum
			}
		)

		projectData.sort((a, b) => {
			return parseInt(b.bgnde) - parseInt(a.bgnde);
		});

		localStorage.setItem('resProjData', JSON.stringify(projectData));

		alert("등록 되었습니다.");
		history.goBack();
	}

	const handleClickRemoveProject = () => {
		var resProjData = JSON.parse(localStorage.getItem("resProjData"));

		var idx = -1;
		resProjData.filter((projData, index) => {
			if(projData.project_no == dataState.project_no){
				idx = index;
				return projData;
			}
		});

		if(idx > -1){
			resProjData.splice(idx, 1);
			localStorage.setItem("resProjData", JSON.stringify(resProjData));
			alert("삭제되었습니다.");
		}else{
			alert("삭제 중 오류가 발생했습니다.");
		}
		history.goBack();
	}

	const handleClickUpdateProject = () => {
		console.log("handleClickModifyCode");
		var resProjData = JSON.parse(localStorage.getItem("resProjData"));
		var idx = -1;
		resProjData.filter((projData, index) => {
			if(projData.project_no == dataState.project_no){
				idx = index;
				return resProjData;
			}
		});

		resProjData[idx]["project_nm"] 	= dataState.project_nm;
		resProjData[idx]["instt_code"] 	= dataState.instt_code;
		resProjData[idx]["bgnde"] 	= dataState.bgnde.replace(/[^0-9]/g, '');
		resProjData[idx]["endde"] 	= dataState.endde.replace(/[^0-9]/g, '');
		resProjData[idx]["transport_ct"] 	= dataState.transport_ct.replace(/[^0-9]/g, '');
		resProjData[idx]["pm"] 	= dataState.pm;
		localStorage.setItem("resProjData", JSON.stringify(resProjData));
		
		alert("수정되었습니다.");
		history.goBack();
	}

	const handleClickCancle = () => {
		history.goBack();
	};

	return (
		<>
			<div className={classes.root}>
			</div>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left" colSpan="2">
								<Typography className={classes.title} color="inherit" variant="h6">
									{dataState.screenType == "new" ? "프로젝트 등록" : "프로젝트 수정"}
								</Typography>
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
									{dataState.insttList.map((tmp) => (
										<MenuItem key={tmp.instt_code} value={tmp.instt_code} name={tmp.instt_name}>
											{tmp.instt_name}
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
											id="bgnde"
											name="bgnde"
											views={["year", "month", "date"]}
											format="yyyy-MM-dd"
											minDate={new Date()}
											value={new Date(Number(dataState.bgnde.slice(0, 4)), Number(dataState.bgnde.slice(5, 7)) - 1, Number(dataState.bgnde.slice(8, 10)))}
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
											value={new Date(Number(dataState.endde.slice(0, 4)), Number(dataState.endde.slice(5, 7)) - 1, Number(dataState.endde.slice(8, 10)))}
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
									{dataState.memberList.map((mem) => (
										<MenuItem key={mem.member_id} value={mem.member_id}>
											{mem.member_name + " " + mem.rank}
										</MenuItem>
									))}
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
					<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickCancle}>
						취소
					</Button>
					{
						dataState.screenType == "new" &&
						(
							<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickAddProject}>
								등록
							</Button>
						)
					}
					{
						dataState.screenType == "modify" &&
						(
							<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickUpdateProject}>
								수정
							</Button>
						)
					}
					{
						dataState.screenType == "modify" &&
						(
							<Button variant="contained" color="primary" size="small" className={classes.button} onClick={handleClickRemoveProject}>
								삭제
							</Button>
						)
					}
				</div>
			</Toolbar>
		</>
	);
}