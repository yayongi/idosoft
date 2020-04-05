import React, { Fragment, useEffect } from 'react';
import Filter from './component/Filter'
import Body from './component/Body'
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import Axios from 'axios';
import ko from "date-fns/locale/ko";
import Moment from "moment";
import { processErrCode, isEmpty, getSessionStrogy } from '../../../../js/util'
import { LoadingBar } from '../../../../common/LoadingBar/LoadingBar';
export default function  List(props) {
	let [state, setState] = React.useState({
		name: "",
		expenseType: "-1",
		payStDt: Moment().format('YYYY')+'01',
		payEdDt: Moment().format('YYYYMM'),
		status: "-1",
		memo: "",
	});

	const [rows, setRows] = React.useState([]);
	
	const [totalProgAmount, setTotalProgAmount] = React.useState(0);
	const [totalFirAmount, setTotalFirAmount] = React.useState(0);
	const [totalCompAmount, setTotalCompAmount] = React.useState(0);
	const [totalReturnAmount, setTotalReturnAmount] = React.useState(0);

	const [paging, setPaging] = React.useState({listCount : 0});
	const [ holdUp, setHoldUp ] = React.useState(0);					// 이미 가지고있는 페이지를 다시 호출하는 것을 막기 위해 사용
	const [firstRender, setFirstRender ] = React.useState(false);
	const [isNoN, setIsNoN] = React.useState("true");
	const [emptyMessage, setEmptyMessage] = React.useState(false);
	// 검색어 표시
	const [openSnackBar, setOpenSnackBar] = React.useState(false); 
	const [snackBarMessage, setSnackBarMessage] = React.useState(false);
	// 페이징
	const [ page, setPage ] = React.useState(0);						// 초기페이지가 0부터 시작
	const [ rowsPerPage, setRowsPerPage ] = React.useState(10); 
	
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(false); // 로딩바
	
	// alert 
	const [isOpen, setIsOpen] = React.useState(false); 
	const [errMessage, setErrMessage] = React.useState("");

	useEffect(() => {
		let data;

		console.log(`default useEffect`);

		// 세션스토리지 검색 정보 가져오기(EXPENSE_ANN)
		const sessionData = getSessionStrogy("EXPENSE_ANN");

		// 세션스토리지 공백 여부 확인
		if(sessionData == ""){
			
			data = {
				currentPage : '1',
				limit : '10',
				expenseType: "-1",
				payStDt: Moment().format('YYYY')+'01',
				payEdDt: Moment().format('YYYYMM'),
				status: "-1",
				memo: "",
			}
		} else {
			data = sessionData;
		}

		setState(data);
		
	},[]);

	useEffect(() => {

		setShowLoadingBar(true);

		// 임시 데이터 저장소
		let data = {};

		// 세션스토리지 검색 정보 가져오기(EXPENSE_ANN)
		const sessionData = getSessionStrogy("EXPENSE_ANN");

		// 세션스토리지 공백 여부 확인
		if(sessionData == ""){
			data = {
				currentPage : '1',
				limit : '10',
				expenseType: "-1",
				payStDt: Moment().format('YYYY')+'01',
				payEdDt: Moment().format('YYYYMM'),
				status: "-1",
				memo: "",
			}
		} else {

			data = sessionData;
			// currentPage 1 초과하고 rows가 비어있는 경우,

			if(Number(sessionData.currentPage) > 1 && isEmpty(rows)){ 
				data = {
					...sessionData,
					isAddList : 'true', // 리스트 추가 요청 
				}
			} 

		}

		Axios({
			url: '/intranet/getAnnaualList.exp',
			method: 'post',
			data: data,
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			const isNoN = response.data.isNoN;

			if(isNoN == "false"){

				setIsNoN(isNoN);

				setRows(JSON.parse(response.data.list));
				setPaging(JSON.parse(response.data.result));
				
				setTotalProgAmount(response.data.totalProgAmount);
				setTotalFirAmount(response.data.totalFirAmount);
				setTotalCompAmount(response.data.totalCompAmount);
				setTotalReturnAmount(response.data.totalReturnAmount);

				setFirstRender(true);

				const result = JSON.parse(response.data.result);

				/* 페이징 관련 state */
				setPaging(result);
				setHoldUp(Number(result.currentPage)-1);
				setRowsPerPage(Number(result.limit));
				setPage(Number(result.currentPage)-1);

			} else {
				setIsNoN(isNoN);

				setRows([]);
				setFirstRender(true);
				setEmptyMessage("현재 경비 목록이 없습니다.");
			}

			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			//processErrCode(e);
			console.log(e);
		});
		
	}, [state]);

	const openHandleClick = (msg) => {
		setErrMessage(msg);
		setIsOpen(true);
	}

	const closeHandleClick = () => {
		setIsOpen(false);
	}

	const confHandleClick = () => {
		setIsOpen(false);
	}

	const snackBarClose = () => {
		setOpenSnackBar(false);
	}

	return (
		<Fragment>
				<LoadingBar openLoading={isShowLoadingBar}/>
				{firstRender &&
					<Fragment>
						<Filter 
							filterRows={rows} filterSetRows={setRows}
							paging={paging} setPaging={setPaging}
							state={state} setState={setState}
							routeProps={props.routeProps}
							
							totalProgAmount={totalProgAmount} totalFirAmount={totalFirAmount}
							totalCompAmount={totalCompAmount} totalReturnAmount={totalReturnAmount}
							setTotalProgAmount={setTotalProgAmount} setTotalFirAmount={setTotalFirAmount}
							setTotalCompAmount={setTotalCompAmount} setTotalReturnAmount={setTotalReturnAmount}

							holdUp={holdUp} setHoldUp={setHoldUp}
							setPage={setPage} setRowsPerPage={setRowsPerPage}
							setShowLoadingBar={setShowLoadingBar} 
							isNoN={isNoN} setIsNoN={setIsNoN} 
							setEmptyMessage={setEmptyMessage}
							setOpenSnackBar={setOpenSnackBar} 
							setSnackBarMessage={setSnackBarMessage}

							setIsOpen={setIsOpen} setErrMessage={setErrMessage}
						/>
					</Fragment>
				}

				{isNoN == "true" ? 
					<Paper style={{minHeight : "300px", width:"100%", textAlign:"center"}} elevation={0} ><h3 style={{paddingTop:"100px"}}> {emptyMessage} </h3></Paper>
					: 
					<Paper>
						<Body 
							rows={rows} 
							state={state}
							setRows={setRows}
							routeProps={props.routeProps} 
							paging={paging} setPaging={setPaging} 
							holdUp={holdUp} setHoldUp={setHoldUp}
							page={page} setPage={setPage} 
							rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
							setShowLoadingBar={setShowLoadingBar} 
						/>
					</Paper>
				}

				<Dialog
					open={isOpen}
					onClose={() => closeHandleClick()}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{errMessage}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => confHandleClick()} color="primary" autoFocus>
							확인
						</Button>
					</DialogActions>
				</Dialog>

				<Snackbar
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					onClose={snackBarClose}
					open={openSnackBar}
					message={snackBarMessage}
					action={
						<React.Fragment>
							<IconButton size="small" aria-label="close" color="inherit" onClick={snackBarClose}>
								<CloseIcon fontSize="small" />
							</IconButton>
						</React.Fragment>
					}
				/>
		</Fragment>
		);
}