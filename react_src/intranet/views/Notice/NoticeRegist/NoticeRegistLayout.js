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

import axios from 'axios';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import '../css/ck_editor.sass';

import Editor from '../component/Editor';


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
  },
  editorRoot: {
    width: '100%',
    // minHeight: '600px'
  },
  editor:{
    minHeight: '600px'
  }
}));

const getUrlParams = function (url, paramName) {
    // 리턴값을 위한 변수 선언
    var returnValue;

    // get 파라미터 값을 가져올 수 있는 ? 를 기점으로 slice 한 후 split 으로 나눔
    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

    // 나누어진 값의 비교를 통해 paramName 으로 요청된 데이터의 값만 return
    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == paramName.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            return decodeURIComponent(returnValue);
        }
    }
};

export default function NoticeRegistLayout() {
  const classes = useStyles();

  const initValidation = {
    title : false,
    titleHelperText : '',
    content : '#808080'
  };

  const initNoticeData = {
      board_no : null,
      title: '',
      content: null,
      major_yn : false,
      major_period_date:''
      // noticeNo : null,
      // title: '',
      // content:'',
      // regDatetime:'',
      // majorYn:false,
      // majorPeriodDate:'',
  }

  const editorRef = React.useRef();

  const [validation, setValidation] = React.useState(initValidation);
  const [dialog, setDialog] = React.useState({});
	const [resultDialog, setResultDialog] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [urlParams, setUrlParams] = React.useState(getUrlParams(location.href, 'id'));
  const [noticeData, setNoticeData] = React.useState(initNoticeData);

  //수정시 데이터 설정
  React.useEffect(()=>{
    if(urlParams!==undefined){
        axios({
          url: '/intranet/notice/find',
          method : 'post',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data : {
            board_no : urlParams
          },
          }).then(response => {
            //수정 데이터 설정
            console.log(response);
            const data = response.data;
            setNoticeData( 
              {...noticeData, ['board_no']: data.board_no, ['title']:data.title, ['content'] : data.content,
                ['major_yn'] : data.major_yn === 1 ? true : false, ['major_period_date'] : data.major_yn !== 0 ? data.major_period_date : ''
              }
              );
          }).catch(e => {
            console.log(e);
        });
		}
  }, []);

  React.useEffect(()=>{
    console.log(noticeData);
    setChecked(noticeData.major_yn);
  }, [noticeData]);

  React.useEffect(()=>{
    if(checked){
      setNoticeData({...noticeData, major_period_date : Moment(new Date()).format('YYYYMMDD') } );
    }
  }, [checked])

  const handleChange = event => {
    setChecked(event.target.checked);
    setNoticeData({...noticeData, major_yn:event.target.checked} );
  };
  const handleInputChange = event => {
    setNoticeData({...noticeData, [event.target.name]:event.target.value});
    setValidation(initValidation);
  }
  const handleChildChange = date => {
    setNoticeData({...noticeData, major_period_date:date});
  }
  const handleEditorChange = data => {
    console.log(data);
    setNoticeData({...noticeData, content:data});
  }

  // Dialog Open Handler
	const handleOpenDialog = (title, content, isConfirm) => {
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	// Dialog Close Handler
	const handleCloseDialog = (title, result) => {
    //등록 및 수정 처리
		if(dialog.isConfirm*result){
      console.log("등록처리")
			noticeDataRegist();
		}
    console.log("등록안됨");
		setDialog({title:'', content:'', onOff:false, isConfirm:false});
    return setResultDialog(result);
	}
	
	const noticeDataRegist = () => {
		if(urlParams===undefined){
      console.log(editorRef.current);
      axios({
				url: '/intranet/notice/register',
				method : 'post',
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
				},
				data : {...noticeData, ['major_yn'] : (noticeData.major_yn===true?1:0)},
				}).then(response => {
					console.log(response);
					console.log(response.data);
				}).catch(e => {
					console.log(e);
			});
		}else{
			//수정
			axios({
				url: '/intranet/notice/modify',
				method : 'post',
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
				},
				data : {...noticeData, ['major_yn'] : (noticeData.major_yn===true?1:0)},
				}).then(response => {
					console.log(response);
					console.log(response.data);
				}).catch(e => {
					console.log(e);
			});
		}
		return location.href="/#/notice";
  }
  
  const validationCheck = (noticeData) => {

    if(noticeData.title.length === 0 ){
      return 1;
    }else if(noticeData.content.length === 0 || noticeData.content === null){
      return 2;
    }else if(noticeData.major_yn && noticeData.major_period_date === "Invalid date"){
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
        handleOpenDialog('공지사항', urlParams===undefined?'등록하시겠습니까?':'수정하시겠습니까?', true);
    }
	}

	// 뒤로가기 Button Click Handler
	//뒤로가기시 localStorage.removeItem('resEditIndex');
	//localStorage 사용시에만 있으면 되는 함수
	const handleHistoryBack = (event) => {
		event.preventdefault;
  }

  return (
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
                  {urlParams===undefined
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
                  checked={noticeData.major_yn}
                />
                }
                label="중요공지 여부"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              {
                checked===false
                ?(<div></div>)
                :(<DatePicker defaultValue={noticeData.major_period_date} onChildChange={handleChildChange}/>)
              }
            </Grid>
          </Grid>
		  </div>
      </CardContent>
      <CardActions>
        <Editor defaultValue={noticeData.content} onChildChange={handleEditorChange}/>
      </CardActions>
    </Fragment>
  );
}
