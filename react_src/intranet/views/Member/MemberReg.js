import React,{ useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import CommonDialog from '../../js/CommonDialog';
import { Link as RouterLink, } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";
import Moment from "moment";
import axios from 'axios';
import { findAddress,positions,certYn,schCareer,emailValidation,uploadFile,downloadFile } from '../../js/util'

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
    width: '50%',
    height: '50%'
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
	}
}));

const MemberReg = (props) => {

  const classes = useStyles();
  const pathProfile = "\\profile\\";  //프로필 사진  파일업로드 & 다운로드 경로 
  const pathItcert = "\\itCert\\";  //프로필 사진  파일업로드 & 다운로드 경로 
  const pathSchoolcert = "\\schoolCert\\";  //프로필 사진  파일업로드 & 다운로드 경로 
  
  const [state, setState] = React.useState({
    selectedFile : null,
    preFile: null
  });

  const [infoState,setInfoState] = React.useState({
      name : '',
      position : '',
      address_1 : '',
      address_2 : '',
      phone_num : '',
      entry_date : '',
      birth_date : '',
      school_major : '',
      cert_yn : '',
      email : '',
      manager_yn : 0,
      school_career : '',
      marriage_date : '',
      approval_yn : 0,
      mooncal_yn : 0,
      career_date : '',
      photo_path:'',
      certfile_job_path:'',
      certfile_school_path:'',
      reg_id:''
  })
  
  const [validation, setValidation] = React.useState({
    name:       {error:false,helperText:""},
    position:   {error:false,helperText:""},
    email:      {error:false,helperText:""},
    address1:   {error:false,helperText:""},
    address2:   {error:false,helperText:""},
    entry:      {error:false,helperText:""},
    sch_car:    {error:false,helperText:""},
    postcode:   {error:false,helperText:""}
  })

  const [codeState, setCodeState] = React.useState({
    positionCode:[
      { code_id:"",code_name:""},
    ],
    graduationCode:[
      { code_id:"",code_name:""},
    ]
  });

  useEffect(() => {
    axios({
      url: '/intranet/member/code',
      method: 'post',
      data : {
        position_code_id : 'CD0000',
        graduation_code_id:'CD0001'
      },
      headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    }).then(response => {
      console.log("positionResult : " + JSON.stringify(response));
      //직급 코드 관리
      setCodeState(response.data);
    }).catch(e => {
      console.log(e);
    });
  },[])

  const [dateState, setDateState] = React.useState({
    car_date : null,
    entry : null,
    mar_date : null,
    birth : null
  });	

  const setValidationLevel = () => {
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
    if(document.getElementById("address1").value === "" || document.getElementById("address1").value === null){
      setValidation({
        ...validation,
        address1:{
          error:true,
          helperText:"기본주소를 입력해주세요."
        },
      })
      return;
    }
    //상세주소 Validation
    if(document.getElementById("address2").value === "" || document.getElementById("address2").value === null){
      setValidation({
        ...validation,
        address2:{
          error:true,
          helperText:"상세주소를 입력해주세요."
        },
      })
      return;
    }

    //입사일 Validation
    if(document.getElementById("entry").value === "" || document.getElementById("entry").value === null){
      setValidation({
        ...validation,
        entry:{
          error:true,
          helperText:"입사일을 선택해주세요."
        },
      })
      return;
    }

    //우편번호 Validation
    if(document.getElementById("postcode").value === "" || document.getElementById("postcode").value === null){
      setValidation({
        ...validation,
        entry:{
          error:true,
          helperText:"우편번호을 입력해주세요."
        },
      })
      return;
    }

      //최종학력 Validation
      if(document.getElementById("sch_car").nextSibling.value == "" || document.getElementById("sch_car").nextSibling.value == null){
        setValidation({
          ...validation,
          sch_car:{
            error:true,
            helperText:"최종학력을 선택해 주세요."
          }
        })
        return;
      }

      setInfoState({
        ...infoState,
        name : document.getElementById("name").value,
        position : document.getElementById("position").nextSibling.value,
        address_1 : document.getElementById("address1").value,
        address_2 : document.getElementById("address2").value,
        phone_num : document.getElementById("phone").value,
        entry_date : document.getElementById("entry").value.replace(/\-/gi,""),
        birth_date : document.getElementById("birth").value.replace(/\-/gi,""),
        school_major : document.getElementById("sch_mjr").value,
        cert_yn : document.getElementById("cert_yn").nextSibling.value,
        email : document.getElementById("email").value,
        manager_yn : document.getElementById("manager_yn").checked ? 0:1,
        school_career : document.getElementById("sch_car").nextSibling.value,
        marriage_date : document.getElementById("mar_date").value.replace(/\-/gi,""),
        approval_yn : document.getElementById("approval_yn").checked ? 0:1,
        mooncal_yn : document.getElementById("moon_cal").checked ? 0:1,
        career_date : document.getElementById("car_date").value.replace(/\-/gi,""),
      })
    //localStorage.setItem('savedData', JSON.stringify(getData));

    handleOpenDialog(...confirmData);
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
      name:       {error:false,helperText:""},
      position:   {error:false,helperText:""},
      email:      {error:false,helperText:""},
      address1:   {error:false,helperText:""},
      address2:   {error:false,helperText:""},
      entry:      {error:false,helperText:""},
      sch_car:    {error:false,helperText:""},
      postcode:{error:false,helperText:""}
    })
  }

  // confirm, alert 창 함수
  // 초기값은 {}로 설정하고 온오프시  {title:'', content:'', onOff:'true of false'} 형식으로 setting됨.
	const [dialog, setDialog] = React.useState({});

	// Dialog창의 title과 content, confirm여부  담는 배열
	// 배열 없이도 파라미터 입력해서 사용가능
	const confirmData = ['confirm', '저장하시겠습니까?', true];

	//Dialog open handler
	const handleOpenDialog = (title, content, isConfirm) => {
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	//Dialog close handler
	//확인:true 취소:false 리턴
	const handleCloseDialog = (result) => {
    setDialog({title:'', content:'', onOff:false, isConfirm:false});
    if(result){
      axios({
				url: '/intranet/member/memberinst',
				method: 'post',
        data: {
          member_no : '123123123',
          name : infoState.name,
          position : infoState.position,
          address_1 : infoState.address_1,
          address_2 : infoState.address_2,
          phone_num : infoState.phone_num,
          entry_date : infoState.entry_date,
          birth_date : infoState.birth_date,
          school_major : infoState.school_major,
          cert_yn : infoState.cert_yn,
          email : infoState.email,
          manager_yn : infoState.manager_yn,
          school_career : infoState.school_career,
          marriage_date : infoState.marriage_date,
          approval_yn : infoState.approval_yn,
          mooncal_yn : infoState.mooncal_yn,
          career_date : infoState.career_date,
          photo_path : infoState.photo_path,
          certfile_job_path : infoState.certfile_job_path,
          certfile_school_path : infoState.certfile_school_path,
          reg_id:''
        },
        headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			}).then(response => {
				
			}).catch(e => {
				console.log(e);
			});
      return location.href="/#/member/";
    }else{
      return;
    }
	}

  const uploadProfileImg = (event,pathProfile) => {
    uploadFile(event,pathProfile);
    setState({
      ...state,
      preFile:pathProfile + event.target.files[0].name
    })

    setInfoState({
      photo_path : pathProfile +event.target.files[0].name,
    })
  }

  const uploadCertImg = (event,pathItcert) => {
    uploadFile(event,pathItcert);

    setInfoState({
      ...infoState,
      certfile_job_path : pathItcert+event.target.files[0].name,
    })
  }

  const uploadSchoolImg = (event,pathSchoolcert) => {
    uploadFile(event,pathSchoolcert);

    setInfoState({
      ...infoState,
      certfile_school_path : pathSchoolcert+event.target.files[0].name
    })
  }

  const getCarDate = (date) => {
    setDateState({
      car_date : Moment(date).format('YYYY-MM-DD')
    })
  }
  const getEntry = (date) => {
    setDateState({
      entry : Moment(date).format('YYYY-MM-DD')
    })
  }
  const getMarDate = (date) => {
    setDateState({
      car_date : Moment(date).format('YYYY-MM-DD')
    })
  }
  const getBirth = (date) => {
    setDateState({
      car_date : Moment(date).format('YYYY-MM-DD')
    })
	}
  
	return (
		<div>
      <CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
			<Card>
				<CardContent>
					사원등록
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
                    <Avatar src={state.preFile != null ? state.preFile : ""} className={classes.large} />
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div className={classes.textfield}>
                      <input type="file" id="myFileProfile" style={{display:"none"}} onChange={() => uploadProfileImg(event,pathProfile)}/>
                      <input type="file" id="myFileItcert" style={{display:"none"}} onChange={() => uploadCertImg(event,pathItcert)}/>
                      <input type="file" id="myFileSchoolcert" style={{display:"none"}} onChange={() => uploadSchoolImg(event,pathSchoolcert)}/>
                      <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileProfile").click()}>
                                                프로필 업로드
                      </Button>
                      <Button variant="contained" color="primary" onClick={() => downloadFile(event,pathProfile)}>
                        <input type="hidden" value="test.jpg"/> 
                                                프로필 다운로드
                      </Button>
                    </div>
                    <div className={classes.textfield}>
                      <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileItcert").click()}>
                                                자격증 업로드
                      </Button>
                      <Button variant="contained" color="primary" onClick={() => downloadFile(event,pathItcert)}>
                        <input type="hidden" value="test.txt"/> 
                                                자격증 다운로드
                      </Button>
                    </div>
                    <div className={classes.textfield}>
                      <Button variant="contained" color="primary" onClick={() => document.getElementById("myFileSchoolcert").click()}>
                                                증명서 업로드
                      </Button>
                      <Button variant="contained" color="primary" onClick={() => downloadFile(event,pathSchoolcert)}>
                        <input type="hidden" value="test.txt"/> 
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
                  <form>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField autoComplete="off" id="name" label="이름" size="small" variant="outlined" placeholder=""  onClick={defaultValidation} error={validation.name.error} helperText={validation.name.helperText} InputLabelProps={{
                        shrink: true,
                      }}/>
                      <TextField style={{width:'20%'}}
                        id="position"
                        select
                        label="직급"
                        variant="outlined"
                        size="small" 
                        error={validation.position.error}
                        helperText={validation.position.helperText}
                        onClick={defaultValidation} 
                      >
                        {codeState.positionCode.map((option,index) => (
                          <MenuItem key={index} value={option.CODE_ID}>
                            {option.CODE_NAME}
                          </MenuItem>
                        ))}
                      </TextField>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="checkedB"
                            color="primary"
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
                            id="approval_yn"
                          />
                        }
                        label="1차결제자"
                      />
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField autoComplete="off" style={{width:'34%'}} id="email" size="small" label="이메일" variant="outlined" onClick={defaultValidation} error={validation.email.error} helperText={validation.email.helperText} onChange={isValidEmail} placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                      <TextField autoComplete="off" style={{width:'34%'}} id="phone" size="small" label="휴대전화" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField  autoComplete="off" style={{width:'34%'}} id="address1" size="small" label="기본주소" variant="outlined" onClick={defaultValidation}  error={validation.address1.error} helperText={validation.address1.helperText} placeholder="" InputLabelProps={{
                        shrink: true,
                      }}          
                      InputProps={{
                        readOnly: true,
                      }}/>
                      <TextField  autoComplete="off" style={{width:'34%'}} id="postcode" size="small" label="우편번호" variant="outlined" onClick={defaultValidation}  error={validation.address1.error} helperText={validation.address1.helperText} placeholder="" InputLabelProps={{
                        shrink: true,
                      }}          
                      InputProps={{
                        readOnly: true,
                      }}/>
                      <TextField autoComplete="off" style={{width:'70%'}} id="address2" size="small" label="상세주소" variant="outlined" onClick={defaultValidation} error={validation.address2.error} helperText={validation.address2.helperText} placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                      <Button variant="contained" color="primary" onClick={() => findAddress("address1","postcode")}>
                                              주소찾기
                      </Button>
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                        <TextField style={{width:'20%'}}
                          id="cert_yn"
                          select
                          label="자격증 유무"
                          variant="outlined"
                          size="small" 
                          defaultValue={1}
                        >
                          {certYn.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                        
                      <TextField autoComplete="off" size="small" id="sch_mjr" style={{width:'20%'}} label="학교/학과" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                      <TextField style={{width:'20%'}}
                        id="sch_car"
                        select
                        label="최종학력"
                        variant="outlined"
                        size="small" 
                        error={validation.sch_car.error}
                        helperText={validation.sch_car.helperText}
                        onClick={defaultValidation} 
                      >
                        {codeState.graduationCode.map((option,index) => (
                          <MenuItem key={index} value={option.CODE_ID}>
                            {option.CODE_NAME}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                        <div style={{width:'17%', display:'inline-flex'}} >
                          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
                            <Grid container justify="space-around">
                              <DatePicker
                                label="경력시작일"
                                locale='ko'
                                margin="dense"
                                id="car_date"
                                views={["year", "month", "date"]}
                                format="yyyy-MM-dd"
                                value={dateState.car_date}
                                onChange={getCarDate}
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
                                label="결혼기념일"
                                locale='ko'
                                margin="dense"
                                id="mar_date"
                                views={["year", "month", "date"]}
                                format="yyyy-MM-dd"
                                value={dateState.mar_date}
                                onChange={getMarDate}
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
                                label="입사일"
                                locale='ko'
                                margin="dense"
                                id="entry"
                                views={["year", "month", "date"]}
                                format="yyyy-MM-dd"
                                value={dateState.entry}
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
                                id="birth"
                                views={["year", "month", "date"]}
                                format="yyyy-MM-dd"
                                value={dateState.birth}
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
                            id="moon_cal"
                          />
                        }
                        label="음력"
                      />
                    </div>
                    <div className={classes.textfield}>
                      <Button variant="contained" color="primary" onClick={setValidationLevel}>
                              저장하기
                      </Button>
                      <RouterLink button="true" to="/member/" className={classes.router_link}>
                        <Button variant="contained" color="primary">
                                뒤로가기
                        </Button>
                      </RouterLink>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
			</Card>
		</div>
	);
}

export default MemberReg;
