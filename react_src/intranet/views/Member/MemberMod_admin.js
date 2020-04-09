import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Avatar from '@material-ui/core/Avatar';
import CommonDialog from '../../js/CommonDialog';
import { Button, Hidden } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";
import Toolbar from '@material-ui/core/Toolbar';
import Moment from "moment";
import axios from 'axios';
import {findAddress,dateFormatter, phoneFormatter,unFormatter,certYn,emailValidation,uploadFile,downloadFile,isValidNum } from '../../js/util';
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

const MemberMod_admin = (props) => {

  const { routeProps } = props

  const match = routeProps.match;
  const member_no = match.params.member_no; 
  
  const classes = useStyles();

  const pathProfile = "\/profile\/";  //프로필 사진  파일업로드 & 다운로드 경로 
  const pathItcert = "\/itCert\/";  //프로필 사진  파일업로드 & 다운로드 경로 
  const pathSchoolcert = "\/schoolCert\/";  //프로필 사진  파일업로드 & 다운로드 경로 
  
  const [state, setState] = React.useState({
    preProfile : null,
    preCertFile : null,
    preSchoolFile : null
  });

  const [infoState,setInfoState] = React.useState({
		memberData : null,
	});

   const [validation, setValidation] = React.useState({
      name:           {error:false,helperText:""},
      position:       {error:false,helperText:""},
      email:          {error:false,helperText:""},
      address_1:      {error:false,helperText:""},
      address_2:      {error:false,helperText:""},
      entry_date:     {error:false,helperText:""},
      school_career:  {error:false,helperText:""},
      zip_code:       {error:false,helperText:""}
  })

  const [dateState, setDateState] = React.useState({
    career_date     : null,
    entry_date      : null,
    marriage_date   : null,
    birth_date      : null
  });

  const [codeState, setCodeState] = React.useState({
    graduationCode  : null,
    positionCode    : null,
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
      setInfoState({
        memberData : response.data.memberData,
      })

      setState({
        preProfile : response.data.memberData.photo_path,
        preCertFile : response.data.memberData.certfile_job_path,
        preSchoolFile : response.data.memberData.certfile_school_path
      })

      setCodeState({
        graduationCode  : response.data.graduationCode,
        positionCode    : response.data.positionCode
      })

      setDateState({
        career_date     : dateFormatter(response.data.memberData.career_date),
        entry_date      : dateFormatter(response.data.memberData.entry_date),
        marriage_date   : dateFormatter(response.data.memberData.marriage_date),
        birth_date      : dateFormatter(response.data.memberData.birth_date)
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
        member_no : row.member_no,
        email : document.getElementById("email").value
      },
      headers: {
      'Content-Type': 'application/json;charset=UTF-8'
      },
    }).then(response => {
      if(response.data == 0){
        //이름 Validation
        if(document.getElementById("name").value == "" || document.getElementById("name").value == null){
          setValidation({
            ...validation,
            name:{
              error:true,
              helperText:"이름을 입력해 주세요."
            },
          })
          return;
        }

        //직급 Validation
        if(document.getElementById("position").nextSibling.value == "" || document.getElementById("position").nextSibling.value == null){
          setValidation({
            ...validation,
            position:{
              error:true,
              helperText:"직급을 선택해 주세요."
            },
          })
          return;
        }

        //이메일 Validation
        if(document.getElementById("email").value == "" || document.getElementById("email").value == null || !emailValidation(document.getElementById("email").value)){
          setValidation({
            ...validation,
            email:{
              error:true,
              helperText:"이메일을 입력을 확인해주세요."
            },
          })
          return;
        }

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
              school_career:{
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

        let dateTime = new Date().getTime();

        setInfoState({
          memberData : {
            member_no : row.member_no,
            name : document.getElementById("name").value,
            position : document.getElementById("position").nextSibling.value,
            address_1 : document.getElementById("address_1").value,
            address_2 : document.getElementById("address_2").value,
            zip_code : document.getElementById("zip_code").value,
            phone_num : unFormatter(document.getElementById("phone_num").value),
            career_date : unFormatter(document.getElementById("career_date").value != "" ? document.getElementById("career_date").value.replace(/\-/gi,""):null),
            entry_date : unFormatter(document.getElementById("entry_date").value != "" ? document.getElementById("entry_date").value.replace(/\-/gi,""):null),
            birth_date : unFormatter(document.getElementById("birth_date").value != ""? document.getElementById("birth_date").value.replace(/\-/gi,""):null),
            school_major : document.getElementById("school_major").value,
            cert_yn : document.getElementById("cert_yn").nextSibling.value,
            email : document.getElementById("email").value,
            manager_yn : document.getElementById("manager_yn").checked? 1:0,
            school_career : document.getElementById("school_career").nextSibling.value,
            marriage_date : unFormatter(document.getElementById("marriage_date").value != ""? document.getElementById("marriage_date").value.replace(/\-/gi,""):null),
            approval_yn : document.getElementById("approval_yn").checked? 1:0,
            mooncal_yn : document.getElementById("mooncal_yn").checked? 1:0,
            photo_path : document.getElementById("myFileProfile").files.length != 0 ? dateTime+document.getElementById("entry_date").value.replace(/\-/gi,"")+"."+document.getElementById("myFileProfile").files[0].name.split(".")[1] : row.photo_path,
            certfile_job_path : document.getElementById("myFileItcert").files.length != 0 ? dateTime+document.getElementById("entry_date").value.replace(/\-/gi,"")+"."+document.getElementById("myFileItcert").files[0].name.split(".")[1] : row.certfile_job_path,
            certfile_school_path : document.getElementById("myFileSchoolcert").files.length != 0 ? dateTime+document.getElementById("entry_date").value.replace(/\-/gi,"")+"."+document.getElementById("myFileSchoolcert").files[0].name.split(".")[1] : row.certfile_school_path,
            upd_id : JSON.parse(sessionStorage.getItem("loginSession")).member_NO
          }
        })

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
  // 비밀번호 초기화
  const initializePassword = (member_no) => {
    axios({
			url: '/intranet/member/initiallizepassword/',
      method: 'post',
      data:{
        member_no : member_no
      },
      headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
		}).then(response => {
      const confirmData = ['비밀번호 초기화', '비밀번호 초기화가 완료 되었습니다.', false];
      handleOpenDialog(...confirmData);
		}).catch(e => {
		});
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
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
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

      var files = event.target.files; 
      var fileType = files[0].type; 
      loadImage(files[0], function(img, data) { 
        img.toBlob(function(blob){ 
          var rotateFile = new File([blob], files[0].name, {type:fileType}); 
          sel_file = rotateFile; 
          var reader = new FileReader(); 
          reader.onload = function(event){ 
            document.getElementById(path).setAttribute('src',event.target.result);
          } 
          reader.readAsDataURL(rotateFile); 
        },fileType)}, 
        { 
          orientation:true
        })


      // var reader = new FileReader();
      
      // reader.onload = function (e) {
      //   document.getElementById(path).setAttribute('src',e.target.result);  
      // }
      
      // reader.readAsDataURL(event.target.files[0]);
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
            사원상세_관리자
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
                    <div style={{textAlign:'center'}}>
                      <img id="profileImg" src={row.photo_path != undefined ? getRootPath() + "/resources" + pathProfile + row.photo_path : getRootPath() + "/resources/img/noImg.jpg"} className={classes.large} style={{borderRadius: "70%"}}/>
                    </div>
                    <div style={{textAlign:'center'}}>
                      <div className={classes.textfield}>
                        <input type="file" id="myFileProfile" style={{display:"none"}} onChange={() => readUrl(event,"profileImg")} accept=".gif, .jpg,.png"/>
                        <input type="file" id="myFileItcert" style={{display:"none"}} onChange={() => readUrl(event,"certImg")} accept=".gif, .jpg,.png"/>
                        <input type="file" id="myFileSchoolcert" style={{display:"none"}} onChange={() => readUrl(event,"schoolImg")} accept=".gif, .jpg,.png"/>
                        <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileProfile").click()}>
                                                  프로필 업로드
                        </Button>
                        {(row.photo_path != undefined) && (
                          <Button variant="contained" color="primary" onClick={() => downloadFile(event,pathProfile)}>
                            <input type="hidden" value={row.photo_path}/> 
                                                    프로필 다운로드
                          </Button>
                        )}
                      </div>
                      <div className={classes.textfield}>
                        <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileItcert").click()}>
                                                  자격증 업로드
                        </Button>
                        {(row.certfile_job_path != undefined) && (
                          <Button variant="contained" color="primary" onClick={() => downloadFile(event,pathItcert)}>
                            <input type="hidden" value={row.certfile_job_path}/> 
                                                    자격증 다운로드
                          </Button>
                        )}
                      </div>
                      <div className={classes.textfield}>
                        <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileSchoolcert").click()}>
                                                  증명서 업로드
                        </Button>
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
                        <TextField autoComplete="off" style={{width:'70%'}} id="member_no" size="small" label="사번" defaultValue={row.member_no} variant="outlined" InputProps={{
                          readOnly: true,
                        }}/>
                      </div>
                      <div className={classes.textfield} style={{width:'auto'}}>
                        <TextField size="small" id="name" style={{maxWidth:'140px'}} autoComplete="off" onClick={defaultValidation} error={validation.name.error} helperText={validation.name.helperText} onChange={isValidEmail} defaultValue={row.name} label="이름" variant="outlined" />
                        <TextField style={{width:'20%'}}
                          id="position"
                          select
                          label="직급"
                          variant="outlined"
                          defaultValue={row.position}
                          size="small" 
                          error={validation.position.error}
                          helperText={validation.position.helperText}
                          onClick={defaultValidation} 
                          style={{maxWidth:'140px'}}
                        >
                          {codeState.positionCode != null && codeState.positionCode.map(option => (
                            <MenuItem key={option.CODE_ID} value={option.CODE_ID}>
                              {option.CODE_NAME}
                            </MenuItem>
                          ))}
                        </TextField>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value="checkedB"
                              color="primary"
                              defaultChecked={row.manager_yn}
                              id="manager_yn"
                            />
                          }
                          label="관리자"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              value="checkedB"
                              color="primary"
                              defaultChecked={row.approval_yn}
                              id="approval_yn"
                            />
                          }
                          label="1차결제자"
                        />
                      </div>
                      <div className={classes.textfield} style={{width:'auto'}}>
                        <TextField autoComplete="off" size="small" style={{width:'34%'}} id="email"  onClick={defaultValidation} error={validation.email.error} helperText={validation.email.helperText} onChange={isValidEmail} defaultValue={row.email} label="이메일" variant="outlined" />
                        <TextField autoComplete="off" size="small" style={{width:'34%'}} id="phone_num" defaultValue={phoneFormatter(row.phone_num)} onKeyUp={() => isValidNum("phone_num")} label="휴대전화" variant="outlined" />
                      </div>
                      <div className={classes.textfield} style={{width:'auto'}}>
                        <TextField autoComplete="off" size="small" style={{width:'34%'}} id="address_1"  onClick={defaultValidation}  error={validation.address_1.error} helperText={validation.address_1.helperText} defaultValue={row.address_1} label="기본주소" variant="outlined" InputProps={{
                          readOnly: true,
                        }}/>
                        <TextField autoComplete="off" size="small" style={{width:'34%'}} id="zip_code"  onClick={defaultValidation}  error={validation.zip_code.error} helperText={validation.zip_code.helperText} defaultValue={row.zip_code} label="우편번호" variant="outlined" InputProps={{
                          readOnly: true,
                        }}/>
                        <TextField autoComplete="off" size="small" style={{width:'70%'}} id="address_2" onClick={defaultValidation} error={validation.address_2.error} helperText={validation.address_2.helperText}  defaultValue={row.address_2} label="상세주소" variant="outlined"/>
                        <Button variant="contained" color="primary" onClick={() => findAddress("address_1","zip_code")}>
                                                주소찾기
                        </Button>
                      </div>
                      <div className={classes.textfield} style={{width:'auto'}}>
                        <TextField style={{width:'25%'}}
                          id="cert_yn"
                          label="자격증 유무"
                          variant="outlined"
                          select
                          defaultValue={row.cert_yn}
                          size="small" 
                        >
                          {certYn.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField autoComplete="off" size="small" style={{width:'25%'}} id="school_major" defaultValue={row.school_major} label="학교/학과" variant="outlined" />
                        <TextField style={{width:'25%'}}
                          id="school_career"
                          label="최종학력"
                          select
                          variant="outlined"
                          defaultValue={row.school_career}
                          size="small" 
                          error={validation.school_career.error}
                          helperText={validation.school_career.helperText}
                          onClick={defaultValidation} 
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
                                        onChange={getEntry}
                                        inputVariant="outlined"
                                        error={validation.entry_date.error}
                                        helperText={validation.entry_date.helperText}
                                        readOnly={false}
                                        fullWidth
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
                                        readOnly={false}
                                        fullWidth
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
                                        readOnly={false}
                                        fullWidth
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
                                        readOnly={false}
                                        fullWidth
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
                                  />
                                }
                                label="음력"
                              />
                            </div>
                          </Hidden>
                        </div>
                      </Toolbar>
                      <div className={classes.textfield}>
                        <Button variant="contained" color="primary" onClick={saveMemberData}>
                                                  저장하기
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => location.href = getRootPath() + '/#/member'}>
                                                  뒤로가기
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => initializePassword(row.member_no)}>
                                                  비밀번호 초기화
                        </Button>
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

export default MemberMod_admin;
