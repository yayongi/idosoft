import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import TreeView from '../component/TreeView';
import TableView from '../component/TableView';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import SelectType from '../component/SelectType';
import InputSearch from '../component/InputSearch';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';


const mainStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  treePaper: {
	padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  tablePaper: {
	padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  btnDiv:{
  },
  btn: {
    marginLeft:'3px',
    marginRight:'0px',
    marginBottom:'10px',
  },
}));

export default function FullWidthGrid() {
  const classes = mainStyles();

  return (
    <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Toolbar>
                    <SelectType/>
                    <InputSearch/>
                  </Toolbar>
                  <br/>
                  <Button className={classes.btn} variant="contained" color="primary">
                                              최상위 코드 추가
                  </Button>
                  <Button className={classes.btn} variant="contained" color="primary">
                                              검색
                  </Button>
                </CardContent>
              </Card>
          </Grid>
          <Grid item xs={12}>
              
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.treePaper}>
              <Button className={classes.btn} variant="contained" color="primary">
                                            코드추가
              </Button>
          	  <TreeView/>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.tablePaper}>
              <Button className={classes.btn} variant="contained" color="primary">
                                            엑셀다운로드
              </Button>
          	  <TableView/>
            </Paper>
          </Grid>
        </Grid>
    </div>
  );
}
