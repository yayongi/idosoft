import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CommonDialog from '../../js/CommonDialog';
import Button from '@material-ui/core/Button';
import {findAdress,dateFormatter, phoneFormatter,schCareer,unFormatter,positions,certYn,emailValidation} from '../../js/util';

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
}));

const MemberReg = () => {
  const classes = useStyles();
  
  const [state, setState] = React.useState({
		memberData : JSON.parse(localStorage.getItem('savedData')),
	});

   const [validation, setValidation] = React.useState({
    name:{
      error:false,
      helperText:""
    },
    position:{
      error:false,
      helperText:""
    },
    email:{
      error:false,
      helperText:""
    },
    address1:{
      error:false,
      helperText:""
    }
    ,address2:{
      error:false,
      helperText:""
    },
    entry:{
      error:false,
      helperText:""
    },
    sch_car:{
      error:false,
      helperText:""
    }
  })

  //임시파일 불러오기
  const row = state.memberData;
  
  //임시데이터 저장하기
  const setLocalstorage = () => {

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

    const getData = {
      id : row.id,
      name : document.getElementById("name").value,
      position : document.getElementById("position").nextSibling.value,
      address1 : document.getElementById("address1").value,
      address2 : document.getElementById("address2").value,
      phone : unFormatter(document.getElementById("phone").value),
      career : String(Number(new Date().getFullYear()) - Number(document.getElementById("car_date").value.substring( 0, 4 ))),
      entry : unFormatter(document.getElementById("entry").value),
      birth : unFormatter(document.getElementById("birth").value),
      sch_mjr : document.getElementById("sch_mjr").value,
      cert_yn : document.getElementById("cert_yn").nextSibling.value,
      email : document.getElementById("email").value,
      manager_yn : document.getElementById("manager_yn").checked,
      sch_car : document.getElementById("sch_car").nextSibling.value,
      mar_date : document.getElementById("mar_date").value,
      approval_yn : document.getElementById("approval_yn").checked,
      moon_cal : document.getElementById("moon_cal").checked,
      car_date : unFormatter(document.getElementById("car_date").value)
    }

    localStorage.removeItem('savedData');
    localStorage.setItem('savedData', JSON.stringify(getData));

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
      name:{
        error:false,
        helperText:""
      },
      position:{
        error:false,
        helperText:""
      },
      email:{
        error:false,
        helperText:""
      },
      address1:{
        error:false,
        helperText:""
      }
      ,address2:{
        error:false,
        helperText:""
      },
      entry:{
        error:false,
        helperText:""
      },
      sch_car:{
        error:false,
        helperText:""
      }
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
      return location.href="/#/member/memberlist/";
    }else{
      return;
    }
	}
	return (
		<div>
      <CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
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
                  <div style={{textAlign:'center'}}>
                    <img className={classes.img} alt="complex" src="intranet/img/profile/test.jpg"/>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div className={classes.textfield}>
                      <Button variant="contained" color="primary">
                                                프로필 업로드
                      </Button>
                      <Button variant="contained" color="primary">
                                                프로필 다운로드
                      </Button>
                    </div>
                    <div className={classes.textfield}>
                      <Button variant="contained" color="primary">
                                                자격증 업로드
                      </Button>
                      <Button variant="contained" color="primary">
                                                자격증 다운로드
                      </Button>
                    </div>
                    <div className={classes.textfield}>
                      <Button variant="contained" color="primary">
                                                증명서 업로드
                      </Button>
                      <Button variant="contained" color="primary">
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
                      <TextField size="small" id="name"   onClick={defaultValidation} error={validation.name.error} helperText={validation.name.helperText} defaultValue={row.name} label="이름" variant="outlined" />
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
                      >
                        {positions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
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
                      <TextField size="small" style={{width:'34%'}} id="email"  onClick={defaultValidation} error={validation.email.error} helperText={validation.email.helperText} onChange={isValidEmail} defaultValue={row.email} label="이메일" variant="outlined" />
                      <TextField size="small" style={{width:'34%'}} id="phone" defaultValue={phoneFormatter(row.phone)} label="휴대전화" variant="outlined" />
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField size="small" style={{width:'70%'}} id="address1"  onClick={defaultValidation}  error={validation.address1.error} helperText={validation.address1.helperText} defaultValue={row.address1} label="기본주소" variant="outlined" InputProps={{
                        readOnly: true,
                      }}/>
                      <Button variant="contained" color="primary" onClick={() => findAdress("address1")}>
                                              주소찾기
                      </Button>
                      <TextField size="small" style={{width:'70%'}} onClick={defaultValidation} error={validation.address2.error} helperText={validation.address2.helperText} id="address2" defaultValue={row.address2} label="상세주소" variant="outlined"/>
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField style={{width:'20%'}}
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
                      <TextField size="small" style={{width:'20%'}} id="entry" defaultValue={dateFormatter(row.entry)}  onClick={defaultValidation} error={validation.entry.error} helperText={validation.entry.helperText} label="입사일" variant="outlined" />
                      <TextField size="small" style={{width:'20%'}} id="birth" defaultValue={dateFormatter(row.birth)} label="생일" variant="outlined" />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="checkedB"
                            color="primary"
                            id="moon_cal"
                            defaultChecked={row.moon_cal}
                          />
                        }
                        label="음력"
                      />
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField size="small" style={{width:'20%'}} id="sch_mjr" defaultValue={row.sch_mjr} label="학교/학과" variant="outlined" />
                      <TextField style={{width:'20%'}}
                        id="sch_car"
                        label="최종학력"
                        select
                        variant="outlined"
                        defaultValue={row.sch_car}
                        size="small" 
                        error={validation.sch_car.error}
                        helperText={validation.sch_car.helperText}
                        onClick={defaultValidation} 
                      >
                        {schCareer.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField size="small" style={{width:'20%'}} id="car_date" defaultValue={dateFormatter(row.car_date)} label="경력시작일" variant="outlined" />
                      <TextField size="small" style={{width:'20%'}} id="mar_date" defaultValue={dateFormatter(row.mar_date)} label="결혼기념일" variant="outlined" />
                    </div>
                    <div className={classes.textfield}>
                        <Button variant="contained" color="primary" onClick={setLocalstorage}>
                                                  저장하기
                        </Button>
                      <RouterLink button="true" to="/member/memberlist">
                        <Button variant="contained" color="primary">
                                                  뒤로가기
                        </Button>
                      </RouterLink>
                      <Button variant="contained" color="primary">
                                                비밀번호 초기화
                      </Button>
                    </div>
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