import React, { useEffect } from 'react';
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
import { Link as RouterLink } from 'react-router-dom';

function initData (location){
	console.log("initData");
	//console.log(location.pathname);
	//console.log(location.search);

	var urlSplitList 	= location.pathname.split("/");
	var currentLastPath = urlSplitList[urlSplitList.length-1];
	
	var data = {};
	data["screenType"] = currentLastPath == "new" ? "new" : "modify";
	
	var query = location.search;
	if(query){
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
export default function CodeInfo(props) {
	console.log("call CodeInfo Area");

	// 이벤트에 따른 값 변화를 위해 임시로 값 저장
	const { match, location, history } = props.routeProps.routeProps;
	const [dataState, setDataState] = React.useState(initData(location));	// state : 수정을 위한 데이터 관리
	const classes = useStyles();
	//console.log(dataState);

	//하위코드 등록 시 화면이 그려진 후 dataState(등록할 코드의 상위 코드 정보)를 한번 더 변경시켜준다.
	useEffect(() => {
		var compareData = initData(location);
		if(compareData.length != dataState.length){
			setDataState(compareData);
		}else{
			var keyList = Object.keys(compareData);
			var isSetData = false;
			for(var i=0; i < keyList.length; i++){
				if(compareData[keyList[i]] !== dataState[keyList[i]] ){
					isSetData = true;
					break;
				}
			}

			if(isSetData){

				if(compareData["screenType"] == "new"){
					document.getElementsByName("code_id")[0].value 		= "";
					document.getElementsByName("code_name")[0].value 	= "";
					document.getElementsByName("upper_code")[0].value	= compareData["code_id"];
					document.getElementsByName("upper_name")[0].value	= compareData["code_name"];
					document.getElementsByName("code_dc")[0].value 		= "";
				}else if(compareData["screenType"] == "modify"){
					document.getElementsByName("code_id")[0].value 		= compareData["code_id"] ? compareData["code_id"] : "";
					document.getElementsByName("code_name")[0].value 	= compareData["code_name"] ? compareData["code_name"] : "";
					document.getElementsByName("upper_code")[0].value	= compareData["upper_code"] ? compareData["upper_code"] : "";
					document.getElementsByName("upper_name")[0].value	= compareData["upper_name"] ? compareData["upper_name"] : "";
					document.getElementsByName("code_dc")[0].value 		= compareData["code_dc"] ? compareData["code_dc"] : "";
				}

				setDataState(compareData);
			}
		}
	});

	const handleClickAddCode = () => {
		//console.log("handleClickAddCode");
		var code_id 	= document.getElementsByName("code_id")[0].value;
		var code_name 	= document.getElementsByName("code_name")[0].value;
		var code_level 	= "1";					 
		var upper_code 	= document.getElementsByName("upper_code")[0].value;
		var upper_name 	= document.getElementsByName("upper_name")[0].value;
		var code_dc 	= document.getElementsByName("code_dc")[0].value;
		var reg_datetime = "20200320";
		var upd_datetime = "";
		var reg_id = "2017041701";
		var upd_id = "";
		var note   = "";
		var temp_colum = "";

		if(!code_id)	{
			alert("코드ID를 입력해주세요");
			document.getElementsByName("code_id")[0].focus();
			return;
	 	}
		if(!code_name)	{
			alert("코드명을 입력해주세요"); 
			document.getElementsByName("code_name")[0].focus();
			return;
		}

		var codeInfoList = JSON.parse(localStorage.getItem("resCodeData"));
		var isContain = codeInfoList.filter(info => {
			return info.code_id === code_id	
		}).length > 0 ? true : false;

		if(upper_code != ""){
			var isLevel = codeInfoList.filter(info => {
				return info.code_id === upper_code
			});

			if(isLevel.length == "0"){
				alert("등록 중 오류가 발생했습니다.");
				return;
			}

			code_level = parseInt(isLevel[0]["code_level"])+1;
		}

		if(isContain){
			alert("이미 등록되어 있는 코드ID입니다.");
			document.getElementsByName("code_id")[0].focus();
			return;
		}

		
		
		codeInfoList.push(
			{
				"id": codeInfoList.length+1,
				"code_id":code_id,
				"code_name":code_name,
				"code_level":code_level,
				"upper_code":upper_code,
				"upper_name":upper_name,
				"code_dc":code_dc,
				"reg_datetime":reg_datetime,
				"upd_datetime":upd_datetime,
				"reg_id":reg_id,
				"upd_id":upd_id,
				"note":note,
				"temp_colum":temp_colum
		});
		localStorage.setItem("resCodeData", JSON.stringify(codeInfoList));
		//history.push("/admin/code");

		alert("등록 되었습니다.");
		history.goBack();
	};

	const handleClickModifyCode = () => {
		console.log("handleClickModifyCode");
		var resCodeData = JSON.parse(localStorage.getItem("resCodeData"));
		var idx = -1;
		resCodeData.filter((codeData, index) => {
			if(codeData.id == dataState.id && codeData.code_id === dataState.code_id){
				idx = index;
				return codeData;
			}
		});

		resCodeData[idx]["code_name"] 	= document.getElementsByName("code_name")[0].value;
		resCodeData[idx]["code_dc"] 	= document.getElementsByName("code_dc")[0].value;
		localStorage.setItem("resCodeData", JSON.stringify(resCodeData));
		
		alert("수정되었습니다.");
		history.goBack();
	}

	const handleClickRemoveCode = () => {
		//console.log("handleClickRemoveCode");
		var resCodeData = JSON.parse(localStorage.getItem("resCodeData"));

		const isRemoveOk = (resCodeData.filter((codeData) => (
			codeData.upper_code == dataState.code_id
		))).length > 0 ? false : true;

		if(isRemoveOk){
			var idx = -1;
			resCodeData.filter((codeData, index) => {
				if(codeData.id == dataState.id && codeData.code_id === dataState.code_id){
					idx = index;
					return codeData;
				}
			});

			//console.log("idx : " + idx);
			if(idx > -1){
				resCodeData.splice(idx, 1);
				localStorage.setItem("resCodeData", JSON.stringify(resCodeData));
				alert("삭제되었습니다.");
			}else{
				alert("삭제 중 오류가 발생했습니다.");
			}
			history.goBack();
		}else{
			alert("하위코드가 있어서 삭제가 불가능합니다.");
			return;
		}
	}

	const handleClickLowerCode = () => {
		var resCodeData = JSON.parse(localStorage.getItem("resCodeData"));
		var queryJSON = resCodeData.filter((codeData, index) => {
				if(codeData.id == dataState.id && codeData.code_id === dataState.code_id){
					return codeData;
				}
			});


		var url = "/admin/modifyCode/new";
		var queryString = jsonToQuery(queryJSON[0]);

		console.log("url : " + url);
		console.log("queryString : " + queryString);

		history.push(url + queryString);
	}

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
									{dataState.screenType == "new" ? "코드 생성" : "코드 수정"}
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell align="left" component="th" scope="row" style={{width: '120px'}}>상위코드 ID</TableCell>
							<TableCell align="left">
								<TextField
									id="upper_code"
									name="upper_code"
									margin="dense"
									variant="outlined"
									defaultValue={dataState.upper_code}
									InputProps={{
									 	 readOnly: true,
									}}
									style={{
										background: 'gray'
									}}
									fullWidth
								>
								</TextField>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">상위코드 명</TableCell>
							<TableCell align="left">
								<TextField
									id="upper_name"
									name="upper_name"
									margin="dense"
									variant="outlined"
									defaultValue={dataState.upper_name}
									InputProps={{
									 	readOnly: true,
									}}
									style={{
										background: 'gray'
									}}
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">코드ID</TableCell>
							<TableCell align="left">
								<TextField
									id="code_id"
									name="code_id"
									margin="dense"
									variant="outlined"
									defaultValue={dataState.code_id}
									InputProps={{
									 	readOnly: dataState.screenType === "new" ? false: true,
									}}
									style={{
										background: dataState.screenType === "new" ? "" : "gray"
									}}
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">코드명</TableCell>
							<TableCell align="left" >
								<TextField
									id="code_name"
									name="code_name"
									margin="dense"
									variant="outlined"
									defaultValue={dataState.code_name}
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">코드 설명</TableCell>
							<TableCell align="left">
								<TextField
									id="code_dc"
									name="code_dc"
									rows="5"
									variant="outlined"
									defaultValue={dataState.code_dc}
									multiline
									fullWidth
								/>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<Toolbar>
				<Typography className={classes.title} color="secondary" variant="subtitle2">					
				</Typography>
				<div>
					<RouterLink button="true" to="/admin/code">
						<Button variant="contained" color="primary" size="small"  className={classes.button}>
							취소
						</Button>
					</RouterLink>
					{
						dataState.screenType == "new" && 
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickAddCode}>
								추가
							</Button>
						)
					}
					{
						dataState.screenType == "modify" && 
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickModifyCode}>
								수정
							</Button>
						)
					}
					{
						dataState.screenType == "modify" && 
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickRemoveCode}>
								삭제
							</Button>
						)
					}
					{
						dataState.screenType == "modify" && 
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={handleClickLowerCode}>
								하위코드추가
							</Button>
						)
					}
				</div>
			</Toolbar>
		</>
	);
}