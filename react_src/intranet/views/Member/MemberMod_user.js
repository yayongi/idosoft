import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, responsiveFontSizes } from '@material-ui/core/styles';
import { Link as RouterLink, } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button, Hidden } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";
import Toolbar from '@material-ui/core/Toolbar';
import Moment from "moment";
import axios from 'axios';
import CommonDialog from '../../js/CommonDialog';
import {findAddress,dateFormatter, phoneFormatter, positionFormatter,schCareer,unFormatter,certYn,uploadFile,downloadFile,dataCalculator,emailValidation,isValidNum } from '../../js/util';
import { LoadingBar } from '../../common/LoadingBar/LoadingBar';
import { getRootPath } from '../../js/util';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin:10
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  image: {
    width: 300,
    height: 300,
  },
  margin: {
    margin: theme.spacing(1),
  },
  textfield:{
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
  button_tool: {
		marginRight: '10px',
	},
	router_link: {
		textDecoration: 'none',
  },
  root_tool: {
		paddingLeft : "0px",
	},
}));


const MemberMod_user = (props) => {

  const { routeProps } = props;

  const match = routeProps.match;

  const member_no = match.params.member_no; 

  const classes = useStyles();
  const pathProfile = "\/profile\/";  //프로필 사진  파일업로드 & 다운로드 경로 
  const pathItcert = "\/itCert\/";  //프로필 사진  파일업로드 & 다운로드 경로 
  const pathSchoolcert = "\/schoolCert\/";  //프로필 사진  파일업로드 & 다운로드 경로 

  const [state, setState] = React.useState({
    preProfile : null,
    preCertFile : null,
    preSchoolFile : null,
    isIdentified : false
  });

  const [infoState, setInfoState] = React.useState({
		memberData : null,
	});

  const [validation, setValidation] = React.useState({
    name:             {error:false,helperText:""},
    position:         {error:false,helperText:""},
    email:            {error:false,helperText:""},
    address_1:         {error:false,helperText:""},
    address_2:         {error:false,helperText:""},
    entry_date:            {error:false,helperText:""},
    school_career:    {error:false,helperText:""},
    zip_code:         {error:false,helperText:""}
  })

  const [dateState, setDateState] = React.useState({
    career_date : null,
    entry_date : null,
    marriage_date : null,
    birth_date : null
  });

  const [codeState, setCodeState] = React.useState({
    graduationCode:null
  });

  // 로딩바
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(true);    //loading bar
  
  const row = infoState.memberData;

  useEffect(() => {
		axios({
			url: '/intranet/member/membersel/',
      method: 'post',
      data:{
        member_no : member_no
      },
      headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
		}).then(response => {
      setState({
        preProfile : response.data.memberData.photo_path,
        preCertFile : response.data.memberData.certfile_job_path,
        preSchoolFile :response.data.memberData.certfile_school_path,
        isIdentified : (response.data.memberData.member_no === JSON.parse(sessionStorage.getItem("loginSession")).member_NO) ? true:false
      })

      setInfoState({
        memberData : response.data.memberData,
      })

      setCodeState({
        graduationCode:response.data.graduationCode
      })

      setDateState({
        career_date : dateFormatter(response.data.memberData.career_date),
        entry_date : dateFormatter(response.data.memberData.entry_date),
        marriage_date : dateFormatter(response.data.memberData.marriage_date),
        birth_date : dateFormatter(response.data.memberData.birth_date)
      })
      setShowLoadingBar(false);
		}).catch(e => {
      setShowLoadingBar(false);
		});
	},[])

  const saveMemberData = () => {
    //이메일 중복 검사
    axios({
      url: '/intranet/member/checkemail',
      method: 'post',
      data : {
        email : document.getElementById("email").value,
        member_no : row.member_no
      },
      headers: {
      'Content-Type': 'application/json;charset=UTF-8'
      },
    }).then(response => {
      if(response.data == 0){
        //기본주소 Validation
        if(document.getElementById("address_1").value === "" || document.getElementById("address_1").value === null){
          setValidation({
            ...validation,
            address_1:{
              error:true,
              helperText:"기본주소를 입력해주세요."
            },
          })
          return;
        }
        //상세주소 Validation
        if(document.getElementById("address_2").value === "" || document.getElementById("address_2").value === null){
          setValidation({
            ...validation,
            address_2:{
              error:true,
              helperText:"상세주소를 입력해주세요."
            },
          })
          return;
        }

        //입사일 Validation
        if(document.getElementById("entry_date").value === "" || document.getElementById("entry_date").value === null){
          setValidation({
            ...validation,
            entry_date:{
              error:true,
              helperText:"입사일을 선택해주세요."
            },
          })
          return;
        }

          //최종학력 Validation
          if(document.getElementById("school_career").nextSibling.value == "" || document.getElementById("school_career").nextSibling.value == null){
            setValidation({
              ...validation,
              school_major:{
                error:true,
                helperText:"최종학력을 선택해 주세요."
              }
            })
            return;
          }

          //우편번호 Validation
          if(document.getElementById("zip_code").value === "" || document.getElementById("zip_code").value === null){
            setValidation({
              ...validation,
              zip_code:{
                error:true,
                helperText:"우편번호을 입력해주세요."
              },
            })
            return;
          }

          setState({
            ...state,
            profile : document.getElementById("myFileProfile").files.length != 0 ? document.getElementById("myFileProfile") : null,
            certFile : document.getElementById("myFileItcert").files.length != 0 ? document.getElementById("myFileItcert") : null,
            schoolFile :document.getElementById("myFileSchoolcert").files.length != 0 ? document.getElementById("myFileSchoolcert") : null
          })

          let dateTime = new Date().getTime();

        setInfoState({
          memberData:{
            member_no : row.member_no,
            name : row.name,
            position : row.position,
            address_1 : document.getElementById("address_1").value,
            address_2 : document.getElementById("address_2").value,
            zip_code : document.getElementById("zip_code").value,
            phone_num : unFormatter(document.getElementById("phone_num").value),
            career_date : row.career_date,
            entry_date : unFormatter(document.getElementById("entry_date").value != "" ? document.getElementById("entry_date").value.replace(/\-/gi,""):null),
            birth_date : unFormatter(document.getElementById("birth_date").value != ""? document.getElementById("birth_date").value.replace(/\-/gi,""):null),
            school_major : document.getElementById("school_major").value,
            cert_yn : document.getElementById("cert_yn").nextSibling.value,
            email : document.getElementById("email").value,
            manager_yn : row.manager_yn,
            school_career : document.getElementById("school_career").nextSibling.value,
            marriage_date : unFormatter(document.getElementById("marriage_date").value),
            approval_yn : row.approval_yn,
            mooncal_yn : document.getElementById("mooncal_yn").checked? 1:0,
            career_date : unFormatter(document.getElementById("career_date").value != "" ? document.getElementById("career_date").value.replace(/\-/gi,""):null),
            photo_path : document.getElementById("myFileProfile").files.length != 0 ? dateTime+"_"+document.getElementById("myFileProfile").files[0].name : row.photo_path,
            certfile_job_path : document.getElementById("myFileItcert").files.length != 0 ? dateTime+"_"+document.getElementById("myFileItcert").files[0].name : row.certfile_job_path,
            certfile_school_path : document.getElementById("myFileSchoolcert").files.length != 0 ? dateTime+"_"+document.getElementById("myFileSchoolcert").files[0].name : row.certfile_school_path,
            upd_id : JSON.parse(sessionStorage.getItem("loginSession")).member_NO
          }
        });

        handleOpenDialog(...confirmData);
      }else{
        const confirmData = ['이메일 확인', '이메일이 중복됩니다.', false];
        handleOpenDialog(...confirmData);
      }
    }).catch(e => {
    });
  }

  const isValidEmail = () => {
    if(!emailValidation(document.getElementById("email").value)){
      setValidation({
        ...validation,
        email:{
          error:true,
          helperText:"이메일을 입력을 확인해주세요."
        },
      })
    }
  }

  const defaultValidation = () =>{
    setValidation({
      name:           {error:false,helperText:""},
      position:       {error:false,helperText:""},
      email:          {error:false,helperText:""},
      address_1:      {error:false,helperText:""},
      address_2:      {error:false,helperText:""},
      entry_date:     {error:false,helperText:""},
      school_career:  {error:false,helperText:""},
      zip_code:       {error:false,helperText:""}
    })
  }

   // confirm, alert 창 함수
  // 초기값은 {}로 설정하고 온오프시  {title:'', content:'', onOff:'true of false'} 형식으로 setting됨.
	const [dialog, setDialog] = React.useState({});

	// Dialog창의 title과 content, confirm여부  담는 배열
	// 배열 없이도 파라미터 입력해서 사용가능
	const confirmData = ['사원정보 수정', '저장하시겠습니까?', true];

	//Dialog open handler
	const handleOpenDialog = (title, content, isConfirm) => {
    setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	//Dialog close handler
	//확인:true 취소:false 리턴
	const handleCloseDialog = (title,result) => {
    setDialog({title:'', content:'', onOff:false, isConfirm:false});

    if(title != "이메일 확인"){
      if(result){
        axios({
          url: '/intranet/member/memberupd/',
          method: 'post',
          data: infoState.memberData,
          headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        }).then(response => {
          fileUpload();
          return 
        }).catch(e => {
        });
      }else{
        return;
      }
    }
	}

  const getCarDate = (date) => {
    setDateState({
      ...dateState,
      career_date : Moment(date).format('YYYY-MM-DD')
    })
  }
  const getEntry = (date) => {
    defaultValidation();
    setDateState({
      ...dateState,
      entry_date : Moment(date).format('YYYY-MM-DD')
    })
  }
  const getMarDate = (date) => {
    setDateState({
      ...dateState,
      marriage_date : Moment(date).format('YYYY-MM-DD')
    })
  }
  const getBirth = (date) => {
    setDateState({
      ...dateState,
      birth_date : Moment(date).format('YYYY-MM-DD')
    })
  }
  
  const readUrl = (event,path) => {
    if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    
    reader.onload = function (e) {
      document.getElementById(path).setAttribute('src',e.target.result);  
    }
    
    reader.readAsDataURL(event.target.files[0]);
    }
  }

  const fileUpload = () => {
    //업로드 파일 json만들기
    let list = [];
    if(document.getElementById("myFileProfile").files[0] != undefined){
      let profileObj = new Object();
      profileObj.path = document.getElementById("myFileProfile").files[0] != undefined ?  pathProfile : null;
      profileObj.prefilename = document.getElementById("myFileProfile").files[0] != undefined ?  state.preProfile : null;
      profileObj.savedName = document.getElementById("myFileProfile").files[0] != undefined ?  infoState.memberData.photo_path : null;
      list.push(profileObj);
    }
    
    if(document.getElementById("myFileItcert").files[0] != undefined){
      let certObj = new Object();
      certObj.path = document.getElementById("myFileItcert").files[0] != undefined ?  pathItcert : null;
      certObj.prefilename = document.getElementById("myFileItcert").files[0] != undefined ?  state.preCertFile : null;
      certObj.savedName = document.getElementById("myFileItcert").files[0] != undefined ?  infoState.memberData.certfile_job_path : null;
      list.push(certObj);
    }
    
    if(document.getElementById("myFileSchoolcert").files[0] != undefined){
      let schoolObj = new Object();
      schoolObj.path =  document.getElementById("myFileSchoolcert").files[0] != undefined ?  pathSchoolcert : null;
      schoolObj.prefilename = document.getElementById("myFileSchoolcert").files[0] != undefined ?  state.preSchoolFile : null;
      schoolObj.savedName = document.getElementById("myFileSchoolcert").files[0] != undefined ?  infoState.memberData.certfile_school_path : null;
      list.push(schoolObj);
    }

    const formData = new FormData();
    formData.append("file0",document.getElementById("myFileProfile").files[0])
    formData.append("file1",document.getElementById("myFileItcert").files[0])
    formData.append("file2",document.getElementById("myFileSchoolcert").files[0])
    formData.append("paramData", JSON.stringify(list));

    const property = {
      url : '/intranet/fileUpload',
      method : 'post',
      data : formData,
      header : {
        'enctype': 'multipart/form-data'
      }
    }
    
    axios(property).then(response => {
      return location.href= getRootPath() + "/#/member/";
      }).catch(e => {
        processErrCode(e)
      });
  }

	return (
		<div>
      <CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
      <LoadingBar openLoading={isShowLoadingBar}/>
      {(row != null) && (
        <Card>
          <CardContent>
            사원상세
          </CardContent>
          <div className={classes.root}>
            <Grid container spacing={3} style={{
              backgroundColor:'lightgrey'
            }}>
              <Grid item xs={12} sm={4} style={{
                height:'100%'
              }}>
                <Card>
                  <CardContent style={{
                    height:'100%'
                  }}>
                    <div style={{textAlign:'-webkit-center'}}>
                      <img id="profileImg" src={row.photo_path != undefined ? getRootPath() + "/resources" + pathProfile + row.photo_path : getRootPath() + "/resources/img/noImg.jpg"} className={classes.large} style={{borderRadius: "70%"}}/>
                    </div>
                    <div style={{textAlign:'center'}}>
                      <Typography>
                        {row.member_no}
                      </Typography>
                      <Typography>
                        {row.name} {row.code_name} ({dataCalculator(row.career_date)})
                      </Typography>
                    </div>
                    <div style={{textAlign:'center'}}>
                      <div className={classes.textfield}>
                        <input type="file" id="myFileProfile" style={{display:"none"}} onChange={() => readUrl(event,"profileImg")}/>
                        <input type="file" id="myFileItcert" style={{display:"none"}} onChange={() => readUrl(event,"certImg")}/>
                        <input type="file" id="myFileSchoolcert" style={{display:"none"}} onChange={() => readUrl(event,"schoolImg")}/>
                        {state.isIdentified == true && (
                          <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileProfile").click()}>
                                                      프로필 업로드
                          </Button>
                        )}
                        {(row.photo_path != undefined) && (
                          <Button variant="contained" color="primary" onClick={() => downloadFile(event,pathProfile)}>
                            <input type="hidden" value={row.photo_path}/> 
                                                    프로필 다운로드
                          </Button>
                        )}
                      </div>
                      <div className={classes.textfield}>
                        {state.isIdentified == true && (
                        <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileItcert").click()}>
                                                  자격증 업로드
                        </Button>
                        )}
                        {(row.certfile_job_path != undefined) && (
                          <Button variant="contained" color="primary" onClick={() => downloadFile(event,pathItcert)}>
                            <input type="hidden" value={row.certfile_job_path}/> 
                                                    자격증 다운로드
                          </Button>
                        )}
                      </div>
                      <div className={classes.textfield}>
                        {state.isIdentified == true && (
                        <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileSchoolcert").click()}>
                                                  증명서 업로드
                        </Button>
                         )}
                        {(row.certfile_school_path != undefined) && (
                          <Button variant="contained" color="primary" onClick={() => downloadFile(event,pathSchoolcert)}>
                            <input type="hidden" value={row.certfile_school_path}/> 
                                                    증명서 다운로드
                          </Button>
                        )}
                      </div>
                      <div>
                        <img id="certImg" src={row.certfile_job_path != undefined ? getRootPath() + "/resources" + pathItcert + row.certfile_job_path : getRootPath() + "/resources/img/noImg.jpg"} className={classes.large}/>
                        <img id="schoolImg" src={row.certfile_school_path != undefined ? getRootPath() + "/resources" + pathSchoolcert + row.certfile_school_path : getRootPath() + "/resources/img/noImg.jpg"} className={classes.large}/>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Card>
                  <CardContent>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField autoComplete="off" style={{width:'70%'}} id="email" size="small" label="이메일" defaultValue={row.email} onClick={defaultValidation}  error={validation.email.error} helperText={validation.email.helperText} onChange={isValidEmail} variant="outlined" InputProps={{
                        readOnly: !state.isIdentified,
                      }}/>
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField autoComplete="off" style={{width:'34%'}} id="address_1" size="small" label="기본주소" defaultValue={row.address_1} onClick={defaultValidation}  error={validation.address_1.error} helperText={validation.address_1.helperText} variant="outlined" InputProps={{
                        readOnly: true,
                      }}/>
                      <TextField autoComplete="off" style={{width:'34%'}} id="zip_code" size="small" label="우편번호" defaultValue={row.zip_code} onClick={defaultValidation}  error={validation.zip_code.error} helperText={validation.zip_code.helperText} variant="outlined" InputProps={{
                        readOnly: true,
                      }}/>
                      <TextField autoComplete="off" style={{width:'70%'}} id="address_2" size="small" label="상세주소" defaultValue={row.address_2} variant="outlined" onClick={defaultValidation} error={validation.address_2.error} helperText={validation.address_2.helperText}InputProps={{
                        readOnly: !state.isIdentified,
                      }}/>
                      {state.isIdentified == true && (
                        <Button variant="contained" color="primary" onClick={() => findAddress("address_1","zip_code")}>
                                                    주소찾기
                        </Button>
                      )}
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField autoComplete="off" style={{width:'34%'}} id="phone_num" size="small" label="휴대전화" onKeyUp={() => isValidNum("phone_num")} defaultValue={phoneFormatter(row.phone_num)} variant="outlined" InputProps={{
                        readOnly: !state.isIdentified,
                      }}/>
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField style={{width:'25%'}}
                        id="cert_yn"
                        select
                        label="자격증 유무"
                        variant="outlined"
                        defaultValue={row.cert_yn}
                        size="small" 
                        InputProps={{
                          readOnly: !state.isIdentified,
                        }}
                      >
                        {certYn.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      
                      <TextField autoComplete="off" style={{width:'25%'}} size="small" id="school_major" label="학교/학과" defaultValue={row.school_major} variant="outlined" InputProps={{
                        readOnly: !state.isIdentified,
                      }}/>
                      <TextField style={{width:'25%'}}
                        id="school_career"
                        select
                        label="최종학력"
                        variant="outlined"
                        defaultValue={row.school_career}
                        size="small" 
                        error={validation.school_career.error}
                        helperText={validation.school_career.helperText}
                        onClick={defaultValidation}
                        InputProps={{
                          readOnly: !state.isIdentified,
                        }} 
                      >
                        {codeState.graduationCode != null && codeState.graduationCode.map(option => (
                          <MenuItem key={option.CODE_ID} value={option.CODE_ID}>
                            {option.CODE_NAME}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <Toolbar className={classes.root_tool}>
                      <div className={classes.container}>
                        <Hidden smDown>
                          <div className={classes.textfield} style={{width:'auto'}}>
                            <div style={{width:'17%', display:'inline-flex'}} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
                                  <Grid container justify="space-around">
                                    <DatePicker
                                      label="경력시작일"
                                      locale='ko'
                                      margin="dense"
                                      id="career_date"
                                      views={["year", "month", "date"]}
                                      format="yyyy-MM-dd"
                                      value={dateState.career_date}
                                      onChange={getCarDate}
                                      inputVariant="outlined"
                                      disabled={!state.isIdentified}
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                              </div>
                              <div style={{width:'17%', display:'inline-flex'}} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
                                  <Grid container justify="space-around">
                                    <DatePicker
                                      label="결혼기념일"
                                      locale='ko'
                                      margin="dense"
                                      id="marriage_date"
                                      views={["year", "month", "date"]}
                                      format="yyyy-MM-dd"
                                      value={dateState.marriage_date}
                                      onChange={getMarDate}
                                      inputVariant="outlined"
                                      disabled={!state.isIdentified}
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                              </div>
                              <div style={{width:'17%', display:'inline-flex'}} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
                                  <Grid container justify="space-around">
                                    <DatePicker
                                      label="입사일"
                                      locale='ko'
                                      margin="dense"
                                      id="entry_date"
                                      views={["year", "month", "date"]}
                                      format="yyyy-MM-dd"
                                      value={dateState.entry_date}
                                      error={validation.entry_date.error}
                                      helperText={validation.entry_date.helperText}
                                      onChange={getEntry}
                                      inputVariant="outlined"
                                      disabled={!state.isIdentified}
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                              </div>
                              <div style={{width:'17%', display:'inline-flex'}} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
                                  <Grid container justify="space-around">
                                    <DatePicker
                                      label="생일"
                                      locale='ko'
                                      margin="dense"
                                      id="birth_date"
                                      views={["year", "month", "date"]}
                                      format="yyyy-MM-dd"
                                      value={dateState.birth_date}
                                      onChange={getBirth}
                                      inputVariant="outlined"
                                      disabled={!state.isIdentified}
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                              </div>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  value="checkedB"
                                  color="primary"
                                  id="mooncal_yn"
                                  defaultChecked={row.mooncal_yn}
                                  disabled={!state.isIdentified}
                                />
                              }
                              label="음력"
                            />
                          </div>
                        </Hidden>
                        <Hidden mdUp>
                          <div className={classes.textfield} style={{width:'auto'}}>
                            <div style={{width:'34%', display:'inline-flex'}} >
                              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
                                <Grid container justify="space-around">
                                  <DatePicker
                                    label="경력시작일"
                                    locale='ko'
                                    margin="dense"
                                    id="career_date"
                                    views={["year", "month", "date"]}
                                    format="yyyy-MM-dd"
                                    value={dateState.career_date}
                                    onChange={getCarDate}
                                    inputVariant="outlined"
                                    disabled={!state.isIdentified}
                                  />
                                </Grid>
                              </MuiPickersUtilsProvider>
                            </div>
                            <div style={{width:'34%', display:'inline-flex'}} >
                              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
                                <Grid container justify="space-around">
                                  <DatePicker
                                    label="결혼기념일"
                                    locale='ko'
                                    margin="dense"
                                    id="marriage_date"
                                    views={["year", "month", "date"]}
                                    format="yyyy-MM-dd"
                                    value={dateState.marriage_date}
                                    onChange={getMarDate}
                                    inputVariant="outlined"
                                    disabled={!state.isIdentified}
                                  />
                                </Grid>
                              </MuiPickersUtilsProvider>
                            </div>
                          </div>
                          <div className={classes.textfield} style={{width:'auto'}}>
                            <div style={{width:'34%', display:'inline-flex'}} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
                                  <Grid container justify="space-around">
                                    <DatePicker
                                      label="입사일"
                                      locale='ko'
                                      margin="dense"
                                      id="entry_date"
                                      views={["year", "month", "date"]}
                                      format="yyyy-MM-dd"
                                      value={dateState.entry_date}
                                      error={validation.entry_date.error}
                                      helperText={validation.entry_date.helperText}
                                      onChange={getEntry}
                                      inputVariant="outlined"
                                      disabled={!state.isIdentified}
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                              </div>
                              <div style={{width:'34%', display:'inline-flex'}} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
                                  <Grid container justify="space-around">
                                    <DatePicker
                                      label="생일"
                                      locale='ko'
                                      margin="dense"
                                      id="birth_date"
                                      views={["year", "month", "date"]}
                                      format="yyyy-MM-dd"
                                      value={dateState.birth_date}
                                      onChange={getBirth}
                                      inputVariant="outlined"
                                      disabled={!state.isIdentified}
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                              </div>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  value="checkedB"
                                  color="primary"
                                  id="mooncal_yn"
                                  defaultChecked={row.mooncal_yn}
                                  disabled={!state.isIdentified}
                                />
                              }
                              label="음력"
                            />
                          </div>
                        </Hidden>
                      </div>
                    </Toolbar>
                    <div className={classes.textfield}>
                        {state.isIdentified == true && (
                        <Button variant="contained" color="primary" onClick={() => saveMemberData()}>
                                                  저장하기
                        </Button>
                        )}
                        <Button variant="contained" color="primary" onClick={() => location.href = getRootPath() + '/#/member'}>
                                                  뒤로가기
                        </Button>
                        {state.isIdentified == true && (
                        <RouterLink button="true" to="/resPassword/" className={classes.router_link}>
                          <Button variant="contained" color="primary">
                                                    비밀번호변경하기
                          </Button>
                        </RouterLink>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        </Card>
      )}
		</div>
	);
}

export default MemberMod_user;
