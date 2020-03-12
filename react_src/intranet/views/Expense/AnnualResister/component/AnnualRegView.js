import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  center: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
  table: {
    minWidth: 100,
    //maxWidth: 300
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    age: '',
    name: 'hai',
  });

  const handleChange = name => event => {
    setState({
    ...state,
    [name]: event.target.value,
    });
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        
        <Grid item xs={12} sm={12}>
                         - 경비  정보
        </Grid>
        <Grid item xs={12} sm={2}>
                          경비 유형
        </Grid>
        <Grid item xs={12} sm={10}> 
          <NativeSelect
            value={state.state}
            onChange={handleChange('state')}
            name={'state'}
            className={classes.selectEmpty}
            inputProps={{ 'aria-label': 'state'}}
            >
            <option value="">야간경비</option>
            <option value={10}>비품구매</option>
          </NativeSelect>
        </Grid>
        <Grid item xs={12} sm={2}>
                          결제일
        </Grid>
        <Grid item xs={12} sm={10}> 
          <Input defaultValue="2020-03-12" inputProps={{ 'aria-label': 'description' }} /> 
        </Grid>
        <Grid item xs={12} sm={2}>
                            금액
        </Grid>
        <Grid item xs={12} sm={10}>
          <Input defaultValue="" inputProps={{ 'aria-label': 'description' }} /> 원
        </Grid>
        <Grid item xs={12} sm={2}>
                          내용
        </Grid>
        <Grid item xs={12} sm={10}> 
          <TextField
            id="outlined-multiline-static"
            multiline
            rows="4"
            defaultValue=""
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
                            첨부파일
        </Grid>
        <Grid item xs={12} sm={6}>
            <input type="file"></input>           
            <img src="http://cafefiles.naver.net/20091123_20/ippoom2_1258970814632O7W2g_jpg/i8mqtlp05mmg18_n00489_ippoom2.jpg" style={{width:200}} />
        </Grid>
      </Grid>
      <div style={{height:20}}/>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} className={classes.center}>
          <Button variant="contained">이전</Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
                            등록
          </Button>
        </Grid>
      </Grid>
    </div>);
}