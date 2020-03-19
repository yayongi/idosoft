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
import axios from 'axios';
import { Link as RouterLink, } from 'react-router-dom';
import { findAdress,positions,certYn,schCareer } from '../../js/util'

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
}));

const MemberReg = () => {
  const classes = useStyles();
  
  const [state, setState] = React.useState({
    selectedFile : null,
    preFile: null
	});


  // 파일 업로드
  const uploadFile = (event) => {
    setState({
      ...state,
      selectedFile : event.target.files[0],
      preFile: "test.txt"
    })

    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('path', "C:\\Users\\SeongwooKang\\git\\idosoft_br\\react_src\\intranet\\img\\profile\\");
    formData.append('prefilename',"test.txt")
    const property = {
      url : '/intranet/fileUpload',
      method : 'post',
      data : formData,
      header : {
        'enctype': 'multipart/form-data'
      }
    }

    axios(property).then(response => {
        console.log(JSON.stringify(response));	
			}).catch(e => {
				console.log(e);
			});
  } 

  // 파일 다운로
  const downloadFile = (event) => {
    const formData = new FormData();
    formData.append('filename', event.target.children[0].value);
    formData.append('path', "C:\\Users\\SeongwooKang\\git\\idosoft_br\\react_src\\intranet\\img\\profile\\");

    const property = {
      url : '/intranet/fileDownload',
      method : 'post',
      data : formData,
      responseType: 'blob',
    }

    axios(property).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.headers.filename);
        document.body.appendChild(link);
        link.click();
			}).catch(e => {
				console.log(e);
			});
  } 

  //임시 로컬스토리지에 저장하기
  const setLocalstorage = () => {
    const getData = {
      id : document.getElementById("entry").value+"11",
      name : document.getElementById("name").value,
      position : document.getElementById("position").nextSibling.value,
      address1 : document.getElementById("address1").value,
      address2 : document.getElementById("address2").value,
      phone : document.getElementById("phone").value,
      career : String(Number(new Date().getFullYear()) - Number(document.getElementById("car_date").value.substring( 0, 4 ))),
      entry : document.getElementById("entry").value,
      birth : document.getElementById("birth").value,
      sch_mjr : document.getElementById("sch_mjr").value,
      cert_yn : document.getElementById("cert_yn").nextSibling.value,
      email : document.getElementById("email").value,
      manager_yn : document.getElementById("manager_yn").checked,
      sch_car : document.getElementById("sch_car").nextSibling.value,
      mar_date : document.getElementById("mar_date").value,
      approval_yn : document.getElementById("approval_yn").checked,
      moon_cal : document.getElementById("moon_cal").checked,
      car_date : document.getElementById("car_date").value
    }

    localStorage.setItem('savedData', JSON.stringify(getData));
  }

	return (
		<div>
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
                  <div style={{textAlign:'center'}}>
                    <img 
                      className={classes.image} 
                      alt="complex" 
                      src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AABNXGc.img?h=1080&w=1920&m=6&q=60&o=f&l=f&x=345&y=399"
                    />
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div className={classes.textfield}>
                      <input type="file" id="myFile" style={{display:"none"}} onChange={() => uploadFile(event)}/>
                      <Button variant="contained" color="primary" onClick={() => document.getElementById("myFile").click()}>
                                                프로필 업로드
                      </Button>
                      <Button variant="contained" color="primary" onClick={() => downloadFile(event)}>
                        <input type="hidden" value="test.jpg"/> 
                                                프로필 다운로드
                      </Button>
                    </div>
                    <div className={classes.textfield}>
                      <Button variant="contained" color="primary">
                                                자격증 업로드
                      </Button>
                      <Button variant="contained" color="primary">
                        <input type="hidden" value="test.txt"/> 
                                                자격증 다운로드
                      </Button>
                    </div>
                    <div className={classes.textfield}>
                      <Button variant="contained" color="primary">
                                                증명서 업로드
                      </Button>
                      <Button variant="contained" color="primary">
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
                      <TextField id="outlined-basic" id="name" label="이름" size="small" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                      <TextField style={{width:'20%'}}
                        id="position"
                        select
                        label="직급"
                        variant="outlined"
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
                      <TextField id="outlined-basic" style={{width:'34%'}} id="email" size="small" label="이메일" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                      <TextField id="outlined-basic" style={{width:'34%'}} id="phone" size="small" label="휴대전화" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField id="outlined-basic" style={{width:'70%'}} id="address1" size="small" label="기본주소" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}          
                      InputProps={{
                        readOnly: true,
                      }}/>
                      <TextField id="outlined-basic" style={{width:'70%'}} id="address2" size="small" label="상세주소" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                      <Button variant="contained" color="primary" onClick={() => findAdress("address1")}>
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
                      >
                        {certYn.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField id="outlined-basic" style={{width:'20%'}} id="entry" size="small" label="입사일" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                      <TextField id="outlined-basic" style={{width:'20%'}} id="birth" size="small" label="생일" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
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
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField id="outlined-basic" size="small" id="sch_mjr" style={{width:'20%'}} label="학교/학과" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                      <TextField style={{width:'20%'}}
                        id="sch_car"
                        select
                        label="최종학력"
                        variant="outlined"
                        size="small" 
                      >
                        {schCareer.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField id="outlined-basic" id="car_date" size="small" style={{width:'20%'}} label="경력시작일" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                      <TextField id="outlined-basic" id="mar_date" size="small" style={{width:'20%'}} label="결혼기념일" variant="outlined" placeholder="" InputLabelProps={{
                        shrink: true,
                      }}/>
                    </div>
                    <div className={classes.textfield}>
                      <RouterLink button="true" to="/member/memberlist" >
                        <Button variant="contained" color="primary" onClick={setLocalstorage}>
                                                  저장하기
                        </Button>
                      </RouterLink>
                      <RouterLink button="true" to="/member/memberlist" >
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