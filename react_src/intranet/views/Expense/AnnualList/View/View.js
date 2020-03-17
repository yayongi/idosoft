import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { AnnualStorage } from 'views/Expense/AnnualList/data'


const useStyles = makeStyles(theme => ({
	table: {
		minWidth: 650,
	},
	title: {
		flex: '1',
	},
	button: {
		marginRight: '10px',
	},
	root: {
		width: '100%',
	},
	backButton: {
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

function getStepInfo(row) {
	let stepInfo = {
		activeStep : 0,
		steps : [
			{label: '진행', isError: false},
			{label: '1차결재완료', isError: false},
			{label: '완료', isError: false},
		]
	}
	debugger;
	if(row.status == '0') {
		stepInfo.activeStep = 1;
	} else if(row.status == '1') {
		stepInfo.activeStep = 2;
	} else if(row.status == '2') {
		stepInfo.activeStep = 3;
	} else if(row.status == '3') {
		stepInfo.activeStep = 0;
		stepInfo.steps[0].label = '반려';
		stepInfo.steps[0].isError = true;
	}
	return stepInfo
}

export default function  View(props) {
	const classes = useStyles();
	const {history, location, match} = props.routeProps;
	const data = JSON.parse(AnnualStorage.getItem("ANNUAL_VIEW"));

	const [activeStep, setActiveStep] = React.useState(1);
	let stepInfo = getStepInfo(data);
	
	React.useEffect(() => {
		console.log("call View.js -> useEffect");
		setActiveStep(stepInfo.activeStep);
	}, []);
	return (
		<>
			<div className={classes.root}>
				<Stepper activeStep={activeStep}>
					{stepInfo.steps.map(row => (
						<Step key={row.label}>
							<StepLabel error={row.isError}>{row.label}</StepLabel>
						</Step>
					))}
				</Stepper>
			</div>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left">
								<Typography className={classes.title} color="inherit" variant="h6">					
									경비 정보
								</Typography>
							</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell align="left" component="th" scope="row">경비유형</TableCell>
							<TableCell align="left">
								<TextField
									id="expenseType"
									defaultValue={data.expenseTypeText}
									InputProps={{
										readOnly: true,
									}}
									variant="outlined"
									size="small"
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">결제일</TableCell>
							<TableCell align="left">
								<TextField
									id="payDate"
									defaultValue={data.payDate}
									InputProps={{
										readOnly: true,
									}}
									variant="outlined"
									size="small"
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">금액</TableCell>
							<TableCell align="left">
								<TextField
									id="pay"
									defaultValue={Number(data.pay).toLocaleString()}
									InputProps={{
										readOnly: true,
									}}
									variant="outlined"
									size="small"
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">내용</TableCell>
							<TableCell align="left">
								<TextField
									id="memo"
									rows="5"
									defaultValue={data.memo}
									variant="outlined"
									InputProps={{
										readOnly: true,
									}}
									multiline
									fullWidth
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component="th" scope="row">첨부파일</TableCell>
							<TableCell align="left"></TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<Toolbar>
				<Typography className={classes.title} color="secondary" variant="subtitle2">					
				</Typography>
				<div>
					<Button variant="contained" color="primary" size="small"  className={classes.button} onClick={() => history.goBack()}>
						목록
					</Button>
					{	
						(data.status == '0' || data.status == '3') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button}>
								수정
							</Button>
						)
					}
					{	
						(data.status == '0' || data.status == '3') &&
						(
							<Button variant="contained" color="primary" size="small"  className={classes.button}>
								삭제
							</Button>
						)
					}

					{	
						(data.status == '3') &&
						(
							<Button variant="contained" color="secondary" size="small"  className={classes.button}>
								진행
							</Button>
						)
					}
					
					
				</div>
			</Toolbar>
		</>
	);
}