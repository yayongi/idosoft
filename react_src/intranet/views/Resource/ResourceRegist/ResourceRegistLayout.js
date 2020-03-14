import React from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import SelectDisplay from '../component/SelectDisplay';
import SelectHolder from '../component/SelectHolder';
import SelectModel from '../component/SelectModel';
import SelectProduction from '../component/SelectProduction';
import YearMonthPicker from '../component/YearMonthPicker';

import SelectType from '../component/SelectType';




const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  formRoot: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  gridRoot: {
    flexGrow: 1,
  },
  inputRoot: {
	width: "300"
  },
  title: {
	flex: '1 1 100%',
	textAlign: 'left'
  },
  buttonAlign: {
	  margin: '5px',
	  align: 'right'
  },
  cardRoot: {
	  width: '100%',
  }
}));


//툴바
const EnhancedTableToolbar = props => {
	console.log(JSON.stringify(props));
  const classes = useToolbarStyles();

  return (
    <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle">
			자원관리
        </Typography>
    </Toolbar>
  );
};

function RegistGrid() {
  const classes = useStyles();
  const inputLabel = React.useRef(null);

  const setting= {label: "자원종류", list:[ {key:1, value:"test"}, {key:2, value:"test2"}, {key:3, value:"test3"} ] };


  return (
	<React.Fragment>
		<Card className={classes.cardRoot}>
		<CardContent>
		<CssBaseline />
    	<Container maxWidth="sm">
			<div className={classes.gridRoot}>
			<Grid container spacing={3}>
				<Grid item xs={12}></Grid>
				<Grid item xs={12} sm={6}>
					<Typography className={classes.title} variant="h6" id="tableTitle">자원종류</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					{/* <SelectModel/> */}
					<SelectType selectSetting={setting}/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography className={classes.title} variant="h6" id="tableTitle">모델명</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField className={classes.inputRoot} id="outlined-basic" label="모델명" variant="outlined" />
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography className={classes.title} variant="h6" id="tableTitle">제조사</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<SelectProduction/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography className={classes.title} variant="h6" id="tableTitle">제조년월</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<YearMonthPicker/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography className={classes.title} variant="h6" id="tableTitle">구입년월</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<YearMonthPicker/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography className={classes.title} variant="h6" id="tableTitle">화면사이즈</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<SelectDisplay/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography className={classes.title} variant="h6" id="tableTitle">시리얼번호</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField className={classes.inputRoot} id="outlined-basic" label="시리얼번호" variant="outlined" />
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography className={classes.title} variant="h6" id="tableTitle">Mac주소</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField className={classes.inputRoot} id="outlined-basic" label="Mac주소" variant="outlined" />
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography className={classes.title} variant="h6" id="tableTitle">보유자</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<SelectHolder/>
				</Grid>
			</Grid>
			</div>
    	</Container>
		</CardContent>
		</Card>
		<Card className={classes.cardRoot}>
			<CardContent>
				<Button variant="contained" className={classes.buttonAlign}>
					뒤로가기
				</Button>
				<Button variant="contained" color="primary" className={classes.buttonAlign}>
					등록하기
				</Button>
			</CardContent>
		</Card>
	</React.Fragment>

  );
}

export default function ResourceRegistLayout() {
	const classes = useStyles();
	const [page, setPage] = React.useState(0);
	
	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar test={1}/>
				<RegistGrid/>
			</Paper>
    	</div>
  );
}


