import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

function createData(id,name, position, address, phone, career,entry, cert,email ) {
	return { id,name, position, address, phone, career,entry, cert,email };
}

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
}));

const rows = [
	createData('1234567890','최문걸','대표', '경기도 안양시 동안구 달안로 75 샛별한양아파트 304동 611호', '010-5174-2860', '3년', '2018.05.09','유','678493@naver.com'),
];

const MemberReg = () => {
	const classes = useStyles();
	return (
		<div>
			<Card>
				<CardContent>
					사원등록
				</CardContent>
        <div className={classes.root}>
          <Grid container spacing={3} style={{
            backgroundColor:'lightgrey',
            height:500
          }}>
            <Grid item xs={12} sm={4} style={{
            height:'100%'
          }}>
              <Paper className={classes.paper} style={{
                height:'100%'
              }}>
                <Grid item xs={12} sm={4} style={{backgroundColor:'blue',}}>
                  <img className={classes.img} alt="complex" src="intranet/img/profile/test.jpg"/>
                </Grid>
                <Grid item xs={12} sm={8} style={{backgroundColor:'red',}}>
                  {rows.map(row => (
                    <Grid item xs key={row.id}>
                      <Typography>
                        {row.name} {row.position} ({row.career})
                      </Typography>
                      <Typography>
                        {row.id}
                      </Typography>
                      <Typography>
                        {row.email}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={8}>
                <Paper className={classes.paper} style={{
                  height:'50%',
                }}>
                  
                </Paper>
                <Paper className={classes.paper} style={{
                  height:'50%',
                   marginTop:5
                }}>
                  
                </Paper>
            </Grid>
          </Grid>
        </div>
			</Card>
		</div>
	);
}

export default MemberReg;