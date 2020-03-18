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
import Button from '@material-ui/core/Button';
import {findAdress,dateFormatter, phoneFormatter, positionFormatter,schCareer,unFormatter,positions,certYn} from '../../js/util';

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

  //임시파일 불러오기
  const row = state.memberData;
  
  //임시데이터 저장하기
  const setLocalstorage = () => {
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
  }

	return (
		<div>
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
                      <TextField id="outlined-basic" size="small" id="name" defaultValue={row.name} label="이름" variant="outlined" />
                      <TextField style={{width:'20%'}}
                        id="position"
                        select
                        label="직급"
                        variant="outlined"
                        defaultValue={row.position}
                        size="small" 
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
                      <TextField id="outlined-basic" size="small" style={{width:'34%'}} id="email" defaultValue={row.email} label="이메일" variant="outlined" />
                      <TextField id="outlined-basic" size="small" style={{width:'34%'}} id="phone" defaultValue={phoneFormatter(row.phone)} label="휴대전화" variant="outlined" />
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField id="outlined-basic" size="small" style={{width:'70%'}} id="address1" defaultValue={row.address1} label="기본주소" variant="outlined" InputProps={{
                        readOnly: true,
                      }}/>
                      <Button variant="contained" color="primary" onClick={() => findAdress("address1")}>
                                              주소찾기
                      </Button>
                      <TextField id="outlined-basic" size="small" style={{width:'70%'}} id="address2" defaultValue={row.address2} label="상세주소" variant="outlined"/>
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
                      <TextField id="outlined-basic" size="small" style={{width:'20%'}} id="entry" defaultValue={dateFormatter(row.entry)} label="입사일" variant="outlined" />
                      <TextField id="outlined-basic" size="small" style={{width:'20%'}} id="birth" defaultValue={dateFormatter(row.birth)} label="생일" variant="outlined" />
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
                      <TextField id="outlined-basic" size="small" style={{width:'20%'}} id="sch_mjr" defaultValue={row.sch_mjr} label="학교/학과" variant="outlined" />
                      <TextField style={{width:'20%'}}
                        id="sch_car"
                        label="최종학력"
                        select
                        variant="outlined"
                        defaultValue={row.sch_car}
                        size="small" 
                      >
                        {schCareer.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField id="outlined-basic" size="small" style={{width:'20%'}} id="car_date" defaultValue={dateFormatter(row.car_date)} label="경력시작일" variant="outlined" />
                      <TextField id="outlined-basic" size="small" style={{width:'20%'}} id="mar_date" defaultValue={dateFormatter(row.mar_date)} label="결혼기념일" variant="outlined" />
                    </div>
                    <div className={classes.textfield}>
                      <RouterLink button="true" to="/member/memberlist">
                        <Button variant="contained" color="primary" onClick={setLocalstorage}>
                                                  저장하기
                        </Button>
                      </RouterLink>
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