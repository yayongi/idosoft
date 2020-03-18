  import React from 'react';
  import { makeStyles } from '@material-ui/core/styles';
  import Paper from '@material-ui/core/Paper';
  import Grid from '@material-ui/core/Grid';

  import TypeInputSelectBox from './TypeInputSelectBox';
  import SearchBtn from './SearchBtn';
  import NameInputSelectBox from './NameInputSelectBox';
  import StateInputSelectBox from './StateInputSelectBox';
  import ContTxtBox from './ContTxtBox';
  import ExcelExportBtn from './ExcelExportBtn';
  import ExpRegBtn from './ExpRegBtn';
  import SortInputSelectBox from './SortInputSelectBox';

  

  export default function FullWidthGrid() {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={10}>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Paper className={classes.center}><ExpRegBtn/></Paper>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Paper className={classes.paper}>경비 유형</Paper>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TypeInputSelectBox/>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Paper className={classes.paper}>성명</Paper>
          </Grid>
          <Grid item xs={6} sm={4}>
            <NameInputSelectBox/>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Paper className={classes.paper}>결제 기간</Paper>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Paper></Paper>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Paper className={classes.paper}>진행상태</Paper>
          </Grid>
          <Grid item xs={6} sm={4}>
            <StateInputSelectBox/>
          </Grid>
          <Grid item xs={6} sm={6}>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Paper className={classes.paper}>정렬 기준</Paper>
          </Grid>
          <Grid item xs={6} sm={4}>
            <SortInputSelectBox/>
          </Grid>
          <Grid item xs={12} sm={2}>
          <Paper className={classes.paper}>내용</Paper>
          </Grid>
          <Grid item xs={12} sm={8}>
            <ContTxtBox/>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Paper className={classes.center}><SearchBtn/></Paper>
          </Grid>
        </Grid>
        <div style={{height : 20}}/>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5} className={classes.left}>
                        <h4>총금액 :500,000 원 </h4> 
          </Grid>
          <Grid item xs={12} sm={4}>
          </Grid>
          <Grid item xs={12} sm={3} className={classes.right}>
             <ExcelExportBtn/>
          </Grid>
        </Grid>
      </div>
    );
  }