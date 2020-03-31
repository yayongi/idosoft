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
    profile : null,
    certFile : null,
    schoolFile : null
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
        profile : response.data.memberData.photo_path,
        certFile : response.data.memberData.certfile_job_path,
        schoolFile : response.data.memberData.certfile_school_path
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

        setInfoState({
          memberData : {
            member_no : row.member_no,
            name : document.getElementById("name").value,
            position : document.getElementById("position").nextSibling.value,
            address_1 : document.getElementById("address_1").value,
            address_2 : document.getElementById("address_2").value,
            zip_code : document.getElementById("zip_code").value,
            phone_num : unFormatter(document.getElementById("phone_num").value),
            career_date : unFormatter(document.getElementById("career_date").value),
            entry_date : unFormatter(document.getElementById("entry_date").value),
            birth_date : unFormatter(document.getElementById("birth_date").value),
            school_major : document.getElementById("school_major").value,
            cert_yn : document.getElementById("cert_yn").nextSibling.value,
            email : document.getElementById("email").value,
            manager_yn : document.getElementById("manager_yn").checked? 1:0,
            school_career : document.getElementById("school_career").nextSibling.value,
            marriage_date : unFormatter(document.getElementById("marriage_date").value),
            approval_yn : document.getElementById("approval_yn").checked? 1:0,
            mooncal_yn : document.getElementById("mooncal_yn").checked? 1:0,
            photo_path : state.profile,
            certfile_job_path : state.certFile,
            certfile_school_path : state.schoolFile,
            upd_id : ''
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
          return location.href= getRootPath() + "/#/member/";
        }).catch(e => {
        });
      }else{
        return;
      }
    }
	}
  
 const uploadProfileImg = (event,pathProfile,preFileName) => {
    uploadFile(event,pathProfile,preFileName);
    setState({
      ...state,
      profile : event.target.files[0].name
    })

    setInfoState({
      memberData : {
      ...infoState.memberData,
      photo_path : event.target.files[0].name
      }
    })
  }

  const uploadCertImg = (event,pathItcert,preFileName) => {
    uploadFile(event,pathItcert,preFileName);

    setState({
      ...state,
      certFile : event.target.files[0].name
    })

    setInfoState({
      memberData : {
        ...infoState.memberData,
        certfile_job_path : event.target.files[0].name
      }
    })
  }

  const uploadSchoolImg = (event,pathSchoolcert,preFileName) => {
    uploadFile(event,pathSchoolcert,preFileName);

    setState({
      ...state,
      schoolFile : event.target.files[0].name
    })

    setInfoState({
      memberData : {
        ...infoState.memberData,
        certfile_school_path : event.target.files[0].name
      }
    })
  }

  const getCarDate = (date) => {
    setDateState({
      ...dateState,
      career_date : Moment(date).format('YYYY-MM-DD')
    })
  }
  const getEntry = (date) => {
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
              backgroundColor:'lightgrey',
              height:'auto'
            }}>
              <Grid item xs={12} sm={4} style={{
                height:'100%'
              }}>
                <Card>
                  <CardContent style={{
                    height:'100%'
                  }}>
                    <div style={{textAlign:'-webkit-center'}}>
                      <Avatar src={row.photo_path != undefined ? getRootPath() + "/resources" + pathProfile + state.profile : ""} className={classes.large} />
                    </div>
                    <div style={{textAlign:'center'}}>
                      <Typography>
                        {row.member_no}
                      </Typography>
                      <div className={classes.textfield}>
                        <input type="file" id="myFileProfile" style={{display:"none"}} onChange={() => uploadProfileImg(event,pathProfile,state.profile)}/>
                        <input type="file" id="myFileItcert" style={{display:"none"}} onChange={() => uploadCertImg(event,pathItcert,state.certFile)}/>
                        <input type="file" id="myFileSchoolcert" style={{display:"none"}} onChange={() => uploadSchoolImg(event,pathSchoolcert,state.schoolFile)}/>
                        <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileProfile").click()}>
                                                  프로필 업로드
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => downloadFile(event,pathProfile)}>
                          <input type="hidden" value={infoState.memberData.photo_path}/> 
                                                  프로필 다운로드
                        </Button>
                      </div>
                      <div className={classes.textfield}>
                        <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileItcert").click()}>
                                                  자격증 업로드
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => downloadFile(event,pathItcert)}>
                          <input type="hidden" value={infoState.memberData.certFile}/> 
                                                  자격증 다운로드
                        </Button>
                      </div>
                      <div className={classes.textfield}>
                        <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileSchoolcert").click()}>
                                                  증명서 업로드
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => downloadFile(event,pathSchoolcert)}>
                          <input type="hidden" value={infoState.memberData.schoolFile}/> 
                                                  증명서 다운로드
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Card>
                  <CardContent>
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
                        <TextField autoComplete="off" size="small" style={{width:'34%'}} id="phone_num" defaultValue={phoneFormatter(row.phone_num)} onKeyUp={isValidNum} label="휴대전화" variant="outlined" />
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
