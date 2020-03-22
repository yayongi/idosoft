import React,{Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import { Link as RouterLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';

import DatePicker from '../component/DatePicker';

import CommonDialog from '../../../js/CommonDialog';

import Moment from "moment"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  btn: {
	  marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  title: {
    // align: "left",
    flex : '1'
  },
  textArea: {
    width: '100%',
    minHeight: '200px'
  }
}));

export default function NoticeRegistLayout() {
  const classes = useStyles();

  const initValidation = {
    title : false,
    titleHelperText : '',
    content : '#808080'
  };

  const [validation, setValidation] = React.useState(initValidation);
  const [dialog, setDialog] = React.useState({});
	const [resultDialog, setResultDialog] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [noticeData, setNoticeData] = React.useState({
    noticeNo : null,
    title: '',
    content:'',
    regDatetime:'',
    majorYn:false,
    majorPeriodDate:'',
    regId:'김준선'
  });

  //수정시 데이터 설정
  React.useEffect(()=>{
    if(localStorage.getItem('noticeEditIndex') !== null){
      const obj = JSON.parse(localStorage.getItem('noticeTestData'));
      setNoticeData(obj.filter((item=>{
        return item.noticeNo === Number(localStorage.getItem('noticeEditIndex'));
      }))[0]);
    }
  }, []);

  React.useEffect(()=>{
    console.log(noticeData);
    setChecked(noticeData.majorYn);
  }, [noticeData]);

  React.useEffect(()=>{
    if(checked){
      setNoticeData({...noticeData, majorPeriodDate : Moment(new Date()).format('YYYY-MM-DD') } );
    }
  }, [checked])



  const handleChange = event => {
    setChecked(event.target.checked);
    setNoticeData({...noticeData, majorYn:event.target.checked} );
  };
  const handleInputChange = event => {
    setNoticeData({...noticeData, [event.target.name]:event.target.value});
    setValidation(initValidation);
  }
  const handleChildChange = date => {
    setNoticeData({...noticeData, majorPeriodDate:date});
  }

  // Dialog Open Handler
	const handleOpenDialog = (title, content, isConfirm) => {
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	// Dialog Close Handler
	const handleCloseDialog = (result) => {
		//등록 및 수정 처리
		if(dialog.isConfirm*result){
			noticeDataRegist();
		}

		setDialog({title:'', content:'', onOff:false, isConfirm:false});
    return setResultDialog(result);
	}
	
	const noticeDataRegist = () => {
    const localNoticeData = JSON.parse(localStorage.getItem('noticeTestData'));
		if(noticeData.noticeNo === null){
      //등록
      if(localNoticeData.length !== 0){
        noticeData.noticeNo = Number(localNoticeData[localNoticeData.length-1].noticeNo)+1;
      }else{
        noticeData.noticeNo = 1;
      }
			localNoticeData.push( {...noticeData, regDatetime:Moment(new Date()).format('YYYY-MM-DD') } );
			localStorage.setItem('noticeTestData', JSON.stringify(localNoticeData) );
		}else{
			//수정
			const index = localNoticeData.findIndex(notice => notice.noticeNo === Number(noticeData.noticeNo));
			const newlocalNoticeData = [...localNoticeData];
			if(index !== undefined){
				newlocalNoticeData.splice(index, 1, noticeData);
				localStorage.setItem('noticeTestData', JSON.stringify(newlocalNoticeData));
			}
			
			localStorage.removeItem('noticeEditIndex');
		}

		return location.href="/#/notice";
  }
  
  const validationCheck = (noticeData) => {
    if(noticeData.title.length === 0 ){
      return 1;
    }else if(noticeData.content.length === 0){
      return 2;
    }else if(noticeData.majorYn && noticeData.majorPeriodDate === "Invalid date"){
      return 3;
    }else{
      return -1;
    }
  }

	// 등록, 수정버튼 Click Handler
	const handleButtonClick = (event) => {
    const validationData = validationCheck(noticeData);

    switch(validationData){
      case 1:
        handleOpenDialog('공지사항', '제목을 입력해주세요.');
        setValidation({...validation, ['title'] : true, ['titleHelperText'] : '제목을 입력해주세요.'});
        break;
      case 2:
        handleOpenDialog('공지사항', '내용을 입력해주세요.');
        setValidation({...validation, ['content'] : 'red'});
        break;
      case 3:
        handleOpenDialog('공지사항', '중요공지 기간을 선택해주세요.');
        break;
      default:
        handleOpenDialog('공지사항', localStorage.getItem('noticeEditIndex')===null?'등록하시겠습니까?':'수정하시겠습니까?', true);
    }
	}

	// 뒤로가기 Button Click Handler
	//뒤로가기시 localStorage.removeItem('resEditIndex');
	//localStorage 사용시에만 있으면 되는 함수
	const handleHistoryBack = (event) => {
		event.preventdefault;
		localStorage.removeItem('noticeEditIndex');
	}

  return (
    // <Card className={classes.root} variant="outlined">
    <Fragment>
      <CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
      <CardContent>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Toolbar>
              <Typography className={classes.title} variant="h6" id="tableTitle">공지사항</Typography>
              <div>
                <RouterLink button="true" to="/notice">
                  <Button className={classes.btn} variant="contained" color="primary" onClick={handleHistoryBack}>
                    목록
                  </Button>
                </RouterLink>
                <Button className={classes.btn} variant="contained" color="primary" onClick={handleButtonClick}>
                  {localStorage.getItem('noticeEditIndex') === null
							      ?"등록":"수정"
						      }
                </Button>
              </div>
              </Toolbar>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="standard-full-width"
                label="제목"
                style={{ margin: 8 }}
                placeholder="제목을 입력하세요."
                // helperText="제목을 입력하세요."
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                name='title'
                value={noticeData.title}
                onChange = {handleInputChange}
                error = {validation.title}
                helperText = {validation.titleHelperText}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControlLabel
                control={
                <Checkbox
                  onChange={handleChange}
                  value=""
                  color="primary"
                  checked={noticeData.majorYn}
                />
                }
                label="중요공지 여부"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              {
                checked===false
                ?(<div></div>)
                :(<DatePicker defaultValue={noticeData.majorPeriodDate} onChildChange={handleChildChange}/>)
              }
            </Grid>
          </Grid>
		  </div>
      </CardContent>
      <CardActions>
        <TextareaAutosize name="content" onChange={handleInputChange} 
                          value={noticeData.content} 
                          className={classes.textArea} aria-label="content" 
                          rowsMin={3} placeholder="내용을 입력하세요."
                          style={{borderColor:validation.content}}
        />
      </CardActions>
    </Fragment>
  );
}
