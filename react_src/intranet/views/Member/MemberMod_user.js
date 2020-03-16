import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const certYn = [
  { label:'유',value:'1' },
  { label:'무',value:'0' }
];

const schCareer = [
  { label:'고졸',value:'A01'},
  { label:'초대졸',value:'A02'},
  { label:'대졸',value:'A03'},
  { label:'대학원졸',value:'A04'},
];

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

const row = {
  id : '1234567890',
  name : '강성우', 
  position : '대리', 
  address1 : '경기도 안양시 동안구 달안로 75',
  address2 : '샛별한양아파트 304동 611호', 
  phone : '010-5174-2860', 
  career : '3년',
  entry : '2018.05.09',
  birth:'1989.01.20', 
  sch_mjr : '성균관대학교 화학공학과',
  cert : 1,
  email : '678493@naver.com'
}

const MemberReg = () => {
	const classes = useStyles();
	return (
		<div>
			<Card>
				<CardContent>
					사원상세
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
                    <Typography>
                      {row.name} {row.position} ({row.career})
                    </Typography>
                    <Typography>
                      {row.id}
                    </Typography>
                    <Typography>
                      {row.email}
                    </Typography>
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
                  <form>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField id="outlined-basic" style={{width:'70%'}} size="small"  label="기본주소" value={row.address1} variant="outlined" InputProps={{
                        readOnly: true,
                      }}/>
                      <Button variant="contained" color="primary">
                                              주소찾기
                      </Button>
                      <TextField id="outlined-basic" style={{width:'70%'}} size="small" label="상세주소" value={row.address2} variant="outlined" InputProps={{
                        readOnly: true,
                      }}/>
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField id="outlined-basic" style={{width:'34%'}} size="small" label="휴대전화" value={row.phone} variant="outlined" />
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField style={{width:'20%'}}
                        id="outlined-select-currency"
                        select
                        label="자격증 유무"
                        variant="outlined"
                        defaultValue={1}
                        size="small" 
                      >
                        {certYn.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField id="outlined-basic" style={{width:'20%'}} size="small" label="입사일" value={row.entry} variant="outlined" />
                      <TextField id="outlined-basic" style={{width:'20%'}} size="small" label="생일" value={row.birth} variant="outlined" />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="checkedB"
                            color="primary"
                          />
                        }
                        label="음력"
                      />
                    </div>
                    <div className={classes.textfield} style={{width:'auto'}}>
                      <TextField id="outlined-basic" style={{width:'20%'}} size="small" label="학교/학과" value={row.sch_mjr} variant="outlined" />
                      <TextField style={{width:'20%'}}
                        id="outlined-select-currency"
                        select
                        label="최종학력"
                        variant="outlined"
                        defaultValue={'A03'}
                        size="small" 
                      >
                        {schCareer.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField id="outlined-basic" style={{width:'20%'}} size="small" label="경력시작일" value={row.entry} variant="outlined" />
                      <TextField id="outlined-basic" style={{width:'20%'}} size="small" label="결혼기념일" variant="outlined" />
                    </div>
                    <div className={classes.textfield}>
                      <Button variant="contained" color="primary">
                                                저장하기
                      </Button>
                      <Button variant="contained" color="primary">
                                                뒤로가기
                      </Button>
                      <Button variant="contained" color="primary">
                                                비밀번호변경하기
                      </Button>
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