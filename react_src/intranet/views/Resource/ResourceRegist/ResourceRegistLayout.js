import React, { useEffect } from 'react';
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

import {MacAddrCheck} from '../uitl/ResUtil';

import {resTypeData, resProductData, resDisplaySizeData, resHolderData} from '../Data';

// const localResData = JSON.parse(localStorage.getItem('resData'));

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
  }
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

	const generator = (resNo, resCode, modelNm, markCode, productMtn, purchaseMtn, displaySizeCode, serialNo, macAddr, holder) =>{
		return {resNo, resCode, modelNm, markCode, productMtn, purchaseMtn, displaySizeCode, serialNo, macAddr, holder};
	}

	const [resData, setResData] = React.useState({
		resNo : null,
		resCode: undefined,
		modelNm: '',
		markCode: undefined,
		productMtn: null,
		purchaseMtn: null,
		displaySizeCode: undefined,
		serialNo: '',
		macAddr: '',
		holder: undefined
	});
	const [dialog, setDialog] = React.useState({});
	const [resultDialog, setResultDialog] = React.useState(false);
	const [validation , setValidation] = React.useState(initValidation);

	//수정시 데이터 설정
	useEffect(()=>{
		if(localStorage.getItem('resEditIndex') !== null){
			const obj = JSON.parse(localStorage.getItem('resData'));
			setResData(obj.filter((item=>{
				return item.resNo === Number(localStorage.getItem('resEditIndex'));
			}))[0]);
		}
	}, []);

	useEffect(()=>{
		console.log(resData);
	},[resData]);

	// Child Component Click Handler
	const handleChildClick = (obj) => {
		// setResData({...resData, [text.split('_')[0]] : text.split('_')[1] });
		setValidation(initValidation);
		setResData({...resData, [obj.key]:obj.value});
	}

	// Input Change Handler
	const handleInputChange = (event) => {
		setValidation(initValidation);
		setResData({...resData, [event.target.name] : event.target.value});
	}

	// Dialog Open Handler
	const handleOpenDialog = (title, content, isConfirm) => {
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	// Dialog Close Handler
	const handleCloseDialog = (result) => {
		//등록 및 수정 처
		if(dialog.isConfirm*result){
			resDataRegist();
		}

		setDialog({title:'', content:'', onOff:false, isConfirm:false});
    	return setResultDialog(result);
	}
	
	const resDataRegist = () => {
		const localResData = JSON.parse(localStorage.getItem('resData'));
		if(resData.resNo === null){
			//등록
			resData.resNo = Number(localResData[localResData.length-1].resNo)+1;
			localResData.push(resData);
			localStorage.setItem('resData', JSON.stringify(localResData) );
		}else{
			//수정
			const index = localResData.findIndex(res => res.resNo === Number(resData.resNo));
			const newlocalResData = [...localResData];
			if(index !== undefined){
				newlocalResData.splice(index, 1, resData);
				localStorage.setItem('resData', JSON.stringify(newlocalResData));
			}
			
			localStorage.removeItem('resEditIndex');
		}

		return location.href="/#/resource";
	}
	// 등록, 수정버튼 Click Handler
	const handleButtonClick = (event) => {
		validationCheck(resData)
	}
	// validation 체크
	const validationCheck = (resData) => {
		if(resData.resCode === undefined){
			handleOpenDialog('자원관리', '자원종류를 선택해주세요.');
			validation.resCode = true;
		}else if(resData.modelNm === ''){
			handleOpenDialog('자원관리', '모델명을 입력해주세요.');
			validation.modelNm = true;
		}else if(resData.markCode === undefined){
			handleOpenDialog('자원관리', '제조사를 선택해주세요.');
			validation.markCode = true;
		}else if(resData.productMtn === 'Invalid date'){
			handleOpenDialog('자원관리', '제조년월을 정확히 선택해주세요.');
			validation.productMtn = true;
		}else if(resData.purchaseMtn === 'Invalid date'){
			handleOpenDialog('자원관리', '구입년월을 정확히 선택해주세요.');
			validation.purchaseMtn = true;
		}else if(resData.displaySizeCode === undefined){
			handleOpenDialog('자원관리', '화면사이즈를 선택해주세요.');
			validation.displaySizeCode = true;
		}else if(resData.serialNo === ''){
			handleOpenDialog('자원관리', '시리얼번호를 입력해주세요.');
			validation.serialNo = true;
		}else if(MacAddrCheck(resData.macAddr)){
			handleOpenDialog('자원관리', 'MAC주소 형식과 맞게 입력해주세요.');
			validation.macAddr = true;
		}else if(resData.holder === undefined){
			handleOpenDialog('자원관리', '보유자를 선택해주세요.');
			validation.holder = true;
		}else{
			handleOpenDialog('자원관리', localStorage.getItem('resEditIndex')===null?'등록하시겠습니까?':'수정하시겠습니까?', true);
		}
	}

	// 뒤로가기 Button Click Handler
	//뒤로가기시 localStorage.removeItem('resEditIndex');
	//localStorage 사용시에만 있으면 되는 함수
	const handleHistoryBack = (event) => {
		event.preventdefault;
		localStorage.removeItem('resEditIndex');
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
										defaultValue={resData.resCode} 
										label={'자원종류'} resKey={"resCode"} props={resTypeData} 
										onChildClick={handleChildClick} validation={validation.resCode}/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">모델명*</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField type="search" className={classes.inputRoot} 
										id="outlined-basic" label="모델명" variant="outlined"
										onChange={handleInputChange} name="modelNm"
										value={resData.modelNm} error={validation.modelNm}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">제조사*</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectType defaultValue={resData.markCode} 
										label={'제조사'} resKey="markCode" props={resProductData} 
										onChildClick={handleChildClick} validation={validation.markCode}/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">제조년월</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<YearMonthPicker defaultValue={resData.productMtn} label="제조년월을 선택하세요." 
												resKey="productMtn" onChildClick={handleChildClick}
												validation={validation.productMtn}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">구입년월</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<YearMonthPicker defaultValue={resData.purchaseMtn} label="구입년월을 선택하세요."
											 resKey="purchaseMtn" onChildClick={handleChildClick}
											 validation={validation.purchaseMtn}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">화면사이즈*</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectType defaultValue={resData.displaySizeCode}  
										label={'화면사이즈'} resKey='displaySizeCode' props={resDisplaySizeData} 
										onChildClick={handleChildClick} validation={validation.displaySizeCode}/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">시리얼번호*</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField type="search" className={classes.inputRoot} 
								id="outlined-basic" label="시리얼번호" variant="outlined"
								onChange={handleInputChange} name="serialNo"
								value={resData.serialNo} error={validation.serialNo}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">Mac주소</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField type="search" className={classes.inputRoot} 
								id="outlined-basic" label="OO-OO-OO-OO-OO-OO" variant="outlined"
								onChange={handleInputChange} name="macAddr"
								value={resData.macAddr} error={validation.macAddr}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">보유자*</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectType defaultValue={resData.holder} 
										label='보유자' resKey='holder' props={resHolderData} 
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
					<RouterLink button="true" to="/resource">
						<Button variant="contained" color="primary" className={classes.btn} onClick={handleHistoryBack}>
							목록
						</Button>
					</RouterLink>
					<Button variant="contained" color="primary" className={classes.btn} onClick={handleButtonClick}>
						{localStorage.getItem('resEditIndex') === null
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
			<RegistGrid/>
    	</div>
  );
}