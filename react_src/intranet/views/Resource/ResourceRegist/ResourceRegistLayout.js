import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';

import YearMonthPicker from '../component/YearMonthPicker';
import SelectType from '../component/SelectType';
import CommonDialog from '../../../js/CommonDialog';

import {MacAddrCheck, getUrlParams, SerialNoCheck} from '../uitl/ResUtil';
import { getRootPath, processErrCode } from '../../../js/util';
import axios from 'axios';

const useToolbarStyles = makeStyles(theme => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.type === 'light'
		? {
			color: theme.palette.primary.main,
			backgroundColor: lighten(theme.palette.primary.light, 0.85),
			}
		: {
			color: theme.palette.text.primary,
			backgroundColor: theme.palette.primary.dark,
			},
	title: {
		flex: '1 1 100%',
	},
}));

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 750,
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	},
	formRoot: {
		'& > *': {
		margin: theme.spacing(1),
		width: 200,
		},
	},
	gridRoot: {
		flexGrow: 1,
	},
	inputRoot: {
		minWidth: 250,
	},
	title: {
		flex: '1 1 100%',
		textAlign: 'left'
	},
	btn: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	cardRoot: {
		width: '100%',
	},
	btnArea: {
		flex:'1',
	},
	router_link: {
		textDecoration: 'none',
	},
}));


//툴바
const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();

  return (
    <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle">
			자원관리
        </Typography>
    </Toolbar>
  );
};

function RegistGrid() {

	const classes = useStyles();
	const inputLabel = React.useRef(null);
	const initResData = {
			res_no : null,
			res_code : undefined,
			model_nm : '',
			mark_code : undefined,
			product_mtn : null,
			purchase_mtn: null,
			display_size_code : undefined,
			serial_no : '',
			mac_addr : '',
			// reg_datetime: '',
			// upd_datetime: '',
			// reg_id: '',
			// upd_id: '',
			holder : '',
			// note:'',
			// temp_colum: '',
	}
	const initValidation = {
			resCode : false,
			modelNm : false,
			markCode : false,
			productMtn: false,
			purchaseMtn: false,
			displaySizeCode: false,
			serialNo: false,
			macAddr: false,
			holder: false
	}
	const initSelectBoxData ={
			resTypeData:[],
			resProductData:[],
			resDisplaySizeData:[],
			resHolderData:[]
	}

	const [resData, setResData] = useState(initResData);
	const [validation , setValidation] = useState(initValidation);
	const [dialog, setDialog] = useState({});
	const [resultDialog, setResultDialog] = useState(false);
	const [urlParams, setUrlParams] = useState(getUrlParams(location.href, 'id'));

	//셀렉트 박스 State
	const [resSelectBoxData, setResSelectBoxData] = useState(initSelectBoxData);

	const [disabled, setDisabled] = useState(false);
	// let disabled = false;

	//수정시 데이터 설정
	useEffect(()=>{
		//셀렉트박스 데이터를 받아옴.

		axios({
			url: '/intranet/resource/get-restype',
			method : 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			}).then(response => {
				// console.log(response.data);
				setResSelectBoxData(response.data.resSelectType);
				// setIsAdmin(response.data.isAdmin);

				if(!response.data.isAdmin){
					//관리자가 아니면 [보유자] 본인으로만 등록가능
					setResData({...resData, ['holder']:response.data.resSelectType.resHolderData[0]['id']});
					setDisabled(true);
				}

				if(urlParams!==undefined){
					axios({
						url: '/intranet/resource/find',
						method : 'post',
						headers: {
							'Content-Type': 'application/json;charset=UTF-8'
						},
						data : {
							res_no : urlParams
						},
						}).then(response => {
							//수정 데이터 설정
							if(!response.data.result){
								return location.href=getRootPath()+"/#/resource";
							}
							setResData(response.data.resData);
						}).catch(e => {
							processErrCode(e);
					});
				}
			}).catch(e => {
				processErrCode(e);
		});

	}, []);

	// Child Component Click Handler
	const handleChildClick = (obj) => {
		// setResData({...resData, [text.split('_')[0]] : text.split('_')[1] });
		setValidation(initValidation);
		setResData({...resData, [obj.key]:obj.value});
	}

	// Input Change Handler
	const handleInputChange = (event) => {
		setValidation(initValidation);

		const inputValue = event.target.value;

		if(event.target.name ==="model_nm"){
			//모델명 16글자(영문,한글,숫자,특수문자)
			if(inputValue.length > 16) {
				event.preventdefault(); 
				return;
			}else{
				setResData({...resData, [event.target.name] : event.target.value});
			} 
		}else if(event.target.name ==="serial_no"){
			//시리얼번호 20글자(영문 대소문자, 숫자)
			// const regex = /^[A-Za-z0-9+]*$/;
			// if(inputValue.length > 20 || !regex.test(inputValue)) {
			if(inputValue.length > 20) {
				event.preventdefault(); 
				return;
			}else{
				setResData({...resData, [event.target.name] : event.target.value});
			} 
		}else if(event.target.name ==="mac_addr"){
			//시리얼번호 17글자(영문 대문자, 숫자, 하이푼)
			if(inputValue.length > 17) {
				event.preventdefault(); 
				return;
			}else{
				setResData({...resData, [event.target.name] : event.target.value});
			} 
		}
		// setResData({...resData, [event.target.name] : event.target.value});
	}

	// Dialog Open Handler
	const handleOpenDialog = (title, content, isConfirm) => {
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	// Dialog Close Handler
	const handleCloseDialog = (title, result) => {
		//등록 및 수정 처
		if(dialog.isConfirm*result){
			resDataRegist();
		}

		setDialog({title:'', content:'', onOff:false, isConfirm:false});
    	return setResultDialog(result);
	}
	
	const resDataRegist = () => {
		if(resData.res_no === null){
			//등록
			axios({
				url: '/intranet/resource/register',
				method : 'post',
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
				},
				data : resData,
				}).then(response => {
					// console.log(response);
					// console.log(JSON.stringify(response));
					// console.log(response.data);
				}).catch(e => {
					processErrCode(e);
			});
		}else{
			// 수정
			axios({
				url: '/intranet/resource/modify',
				method : 'post',
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
				},
				data : resData,
				}).then(response => {
					console.log(response);
					console.log(JSON.stringify(response));
					console.log(response.data);
				}).catch(e => {
					processErrCode(e);
			});
		}

		return location.href=getRootPath()+"/#/resource";
	}
	// 등록, 수정버튼 Click Handler
	const handleButtonClick = (event) => {
		validationCheck(resData)
	}
	// validation 체크
	const validationCheck = (resData) => {
		if(resData.res_code === undefined){
			handleOpenDialog('자원관리', '자원종류를 선택해주세요.');
			validation.res_code = true;
		}else if(resData.model_nm === ''){
			handleOpenDialog('자원관리', '모델명을 입력해주세요.');
			validation.model_nm = true;
		}else if(resData.mark_code === undefined){
			handleOpenDialog('자원관리', '제조사를 선택해주세요.');
			validation.mark_code = true;
		}else if(resData.product_mtn === 'Invalid date'){
			handleOpenDialog('자원관리', '제조년월을 정확히 선택해주세요.');
			validation.product_mtn = true;
		}else if(resData.purchase_mtn === 'Invalid date'){
			handleOpenDialog('자원관리', '구입년월을 정확히 선택해주세요.');
			validation.purchase_mtn = true;
		}else if(resData.display_size_code === undefined){
			handleOpenDialog('자원관리', '화면사이즈를 선택해주세요.');
			validation.display_size_code = true;
		}else if(resData.serial_no !== '' && SerialNoCheck(resData.serial_no)){
			handleOpenDialog('자원관리', '시리얼번호를 입력해주세요. 시리얼번호는 영문대소문자와 숫자만 입력가능합니다.');
			validation.serial_no = true;
		}else if(resData.mac_addr.length!==0 && MacAddrCheck(resData.mac_addr)){
			handleOpenDialog('자원관리', 'MAC주소 형식과 맞게 입력해주세요.');
			validation.mac_addr = true;
		}else if(resData.holder === undefined){
			handleOpenDialog('자원관리', '보유자를 선택해주세요.');
			validation.holder = true;
		}else{
			handleOpenDialog('자원관리', urlParams===undefined?'등록하시겠습니까?':'수정하시겠습니까?', true);
		}
	}

	// 뒤로가기 Button Click Handler
	const handleHistoryBack = (event) => {
		event.preventdefault;
	}

	return (
		<React.Fragment>
			<CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
			<CardContent>
				<CssBaseline />
				<Container maxWidth="sm">
					<div className={classes.gridRoot}>
					<Grid container spacing={3}>
						<Grid item xs={12}></Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">자원종류*</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectType 
										defaultValue={resData.res_code} 
										label={'자원종류'} resKey={"res_code"} props={resSelectBoxData.resTypeData} 
										onChildClick={handleChildClick} validation={validation.res_code}/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">모델명*</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField type="search" className={classes.inputRoot} 
										id="outlined-basic" label="모델명" variant="outlined"
										onChange={handleInputChange} name="model_nm"
										value={resData.model_nm} error={validation.model_nm}
										multiline={true}  //TextArea로 사용 여부
										rows={1}          //처음 보여줄 TexArea 행수
										rowsMax = {5}     //최대호 보여줄 TextArea 행수
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">제조사*</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectType defaultValue={resData.mark_code} 
										label={'제조사'} resKey="mark_code" props={resSelectBoxData.resProductData} 
										onChildClick={handleChildClick} validation={validation.mark_code}/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">제조년월</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<YearMonthPicker defaultValue={resData.product_mtn} label="제조년월을 선택하세요." 
												resKey="product_mtn" onChildClick={handleChildClick}
												validation={validation.product_mtn}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">구입년월</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<YearMonthPicker defaultValue={resData.purchase_mtn} label="구입년월을 선택하세요."
											 resKey="purchase_mtn" onChildClick={handleChildClick}
											 validation={validation.purchase_mtn}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">화면사이즈*</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectType defaultValue={resData.display_size_code}  
										label={'화면사이즈'} resKey='display_size_code' props={resSelectBoxData.resDisplaySizeData} 
										onChildClick={handleChildClick} validation={validation.display_size_code}/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">시리얼번호*</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField type="search" className={classes.inputRoot} 
								id="outlined-basic" label="시리얼번호" variant="outlined"
								onChange={handleInputChange} name="serial_no"
								value={resData.serial_no} error={validation.serial_no}
								multiline={true}  //TextArea로 사용 여부
								rows={1}          //처음 보여줄 TexArea 행수
								rowsMax = {5}     //최대호 보여줄 TextArea 행수
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">Mac주소</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField type="search" className={classes.inputRoot} 
								id="outlined-basic" label="OO-OO-OO-OO-OO-OO" variant="outlined"
								onChange={handleInputChange} name="mac_addr"
								value={resData.mac_addr} error={validation.mac_addr}
								helperText="영문대문자와 숫자로 입력해주세요."
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">보유자*</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectType defaultValue={resData.holder} disabled={disabled}
										label='보유자' resKey='holder' props={resSelectBoxData.resHolderData} 
										onChildClick={handleChildClick} validation={validation.holder}
							/> 
						</Grid>
					</Grid>
					</div>
				</Container>
			</CardContent>
			<CardContent className={classes.cardRoot}>
				<Toolbar>
				<Typography className={classes.btnArea} variant="h6" id="tableTitle"></Typography>
				<div>
					<RouterLink button="true" to="/resource" className={classes.router_link}>
						<Button variant="contained" color="primary" className={classes.btn} onClick={handleHistoryBack}>
							목록
						</Button>
					</RouterLink>
					<Button variant="contained" color="primary" className={classes.btn} onClick={handleButtonClick}>
						{urlParams===undefined
							?"등록":"수정"
						}
					</Button>
				</div>
				</Toolbar>
			</CardContent>
		</React.Fragment>
  );
}

export default function ResourceRegistLayout() {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<EnhancedTableToolbar />
			<RegistGrid />
    	</div>
  );
}