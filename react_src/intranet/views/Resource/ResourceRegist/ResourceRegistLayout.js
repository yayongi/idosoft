import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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

import YearMonthPicker from '../component/YearMonthPicker';
import SelectType from '../component/SelectType';

import {ResTestData} from '../Data';

import {
  NavLink,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';


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
	minWidth: 250,
  },
  title: {
	flex: '1 1 100%',
	textAlign: 'left'
  },
  buttonRoot: {
    textAlign: 'right'
  },
  cardRoot: {
	  width: '100%',
  }
}));


//툴바
const EnhancedTableToolbar = props => {
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

	const resTypeData= {dataKey: "resCode", label: "자원종류", list:[ {key:'a1', value:"모니터"}, {key:'a2', value:"노트북"}, {key:'a3', value:"테스트폰"} ] };
	const resProductData= {dataKey: "markCode", label: "제조사", list:[ {key:'b1', value:"삼성"}, {key:'b2', value:"엘지"}, {key: 'b3', value:"애플"} ] };
	const resDisplaySizeData= {dataKey: "displaySizeCode", label: "화면사이즈", list:[ {key:'c1', value:"18인치"}, {key:'c2', value:"21인치"}, {key: 'c3', value:"24인치"}, {key: 'c4', value:"28인치"} ] };
	const resHolder= {
							dataKey: "holder",
							label: "보유자",
							list:[ 
								{key:'d1', value:"최문걸"}, 
								{key:'d2', value:"조현철"}, 
								{key: 'd3', value:"이인성"}, 
								{key: 'd4', value:"신우인"},
								{key: 'd5', value: "오경섭"},
								{key: 'd6', value: "송원회"},
								{key: 'd7', value: "강성우"},
								{key: 'd8', value: "유기환"},
								{key: 'd9', value: "김준선"}
							]
						};

	const generator = (resNo, resCode, modelNm, markCode, productMtn, purchaseMtn, displaySizeCode, serialNo, macAddr, holder) =>{
		return {resNo, resCode, modelNm, markCode, productMtn, purchaseMtn, displaySizeCode, serialNo, macAddr, holder};
	}

	const [resData, setResData] = React.useState(generator());

	const handleChildClick = (text) => {
		setResData({...resData, [text.split('_')[0]] : text.split('_')[1] });
	}

	const handleInputChange = (event) => {
		setResData({...resData, [event.target.name] : event.target.value});
	}

	const handleButtonClick = (event) => {
		event.preventdefault;
		console.log(resData);
		// ResTestData.testData = ResTestData.testData.concat(resData);
	}

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
							<SelectType props={resTypeData} onChildClick={handleChildClick}/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">모델명</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField type="search" className={classes.inputRoot} 
										id="outlined-basic" label="모델명" variant="outlined"
										onChange={handleInputChange} name="modelNm"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">제조사</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectType props={resProductData} onChildClick={handleChildClick}/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">제조년월</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<YearMonthPicker label="제조년월을 선택하세요." dataKey="productMtn" onChildClick={handleChildClick}/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">구입년월</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<YearMonthPicker label="구입년월을 선택하세요." dataKey="purchaseMtn" onChildClick={handleChildClick}/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">화면사이즈</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectType props={resDisplaySizeData} onChildClick={handleChildClick}/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">시리얼번호</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField type="search" className={classes.inputRoot} 
								id="outlined-basic" label="시리얼번호" variant="outlined"
								onChange={handleInputChange} name="serialNo"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">Mac주소</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField type="search" className={classes.inputRoot} 
								id="outlined-basic" label="Mac주소" variant="outlined"
								onChange={handleInputChange} name="macAddr"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography className={classes.title} variant="h6" id="tableTitle">보유자</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectType props={resHolder} onChildClick={handleChildClick}/>
						</Grid>
					</Grid>
					</div>
				</Container>
				</CardContent>
				<CardContent className={classes.cardRoot}>
					<RouterLink button="true" to="/resource">
						<Button variant="contained" className={classes.buttonRoot} >
							뒤로가기
						</Button>
					</RouterLink>
					{/* <RouterLink button="true" path={`/resource/?resdata=${resData}`} > */}
					<RouterLink button="true" to="/resource">
						<Button variant="contained" color="primary" className={classes.buttonRoot} onClick={handleButtonClick}>
							등록하기
						</Button>
					</RouterLink>
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
				<EnhancedTableToolbar />
				<RegistGrid/>
			</Paper>
    	</div>
  );
}