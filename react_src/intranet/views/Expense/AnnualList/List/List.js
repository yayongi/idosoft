import React, { Fragment, useEffect } from 'react';
import Filter from './component/Filter'
import Body from './component/Body'
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Axios from 'axios';
import ko from "date-fns/locale/ko";
import Moment from "moment";
import { processErrCode, isEmpty, getSessionStrogy } from '../../../../js/util'
import { LoadingBar } from '../../../../common/LoadingBar/LoadingBar';

export default function  List(props) {
	const [state, setState] = React.useState({
		name: "",
		expenseType: "-1",
		payStDt: Moment().format('YYYY')+'01',
		payEdDt: Moment().format('YYYYMM'),
		status: "-1",
		memo: "",
	});

	const [rows, setRows] = React.useState([]);
	const [totalAmount, setTotalAmount] = React.useState(0);
	const [paging, setPaging] = React.useState({listCount : 0});
	const [holdUp, setHoldUp ] = React.useState(0);					// 이미 가지고있는 페이지를 다시 호출하는 것을 막기 위해 사용
	const [isNoN, setIsNoN] = React.useState(false);
	const [emptyMessage, setEmptyMessage] = React.useState(false);
	// 검색어 표시
	const [openSnackBar, setOpenSnackBar] = React.useState(false); 
	const [snackBarMessage, setSnackBarMessage] = React.useState(false);
	// 페이징
	const [ page, setPage ] = React.useState(0);						// 초기페이지가 0부터 시작
	const [ rowsPerPage, setRowsPerPage ] = React.useState(10); 
	
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(false); // 로딩바

	// 공백일 경우 세션 데이터 저장

	// 세션스토리지 검색 정보 가죠오기(EXPENSE_ANN)
	const sessionData = getSessionStrogy("EXPENSE_ANN");
	useEffect(() => {
	if(sessionData != ""){  
		setState({
			name: sessionData.name,
			expenseType: sessionData.expenseType,
			payStDt: sessionData.payStDt,
			payEdDt: sessionData.payEdDt,
			status: sessionData.status,
			memo: sessionData.memo,
		});
	}
	}, []);

	useEffect(() => {
		setShowLoadingBar(true);

		// 임시 데이터 저장소
		let data = {};

		// 세션스토리지 공백 여부 확인
		if(sessionData == ""){
			data = {
				currentPage : '1',
				limit : '10',
				payStDt: Moment().format('YYYY')+'01',
				payEdDt: Moment().format('YYYYMM'),
			}
		} else {
			console.log(`sessionData : ${JSON.stringify(sessionData)}`);

			data = sessionData;
			// currentPage 1 초과하고 rows가 비어있는 경우,

			console.log(`isEmpty(rows) : ${isEmpty(rows)}`);

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
				setRows(JSON.parse(response.data.list));
				setPaging(JSON.parse(response.data.result));
				setTotalAmount(response.data.totalAmount);

				const result = JSON.parse(response.data.result);

				/* 페이징 관련 state */
				setPaging(result);
				setHoldUp(Number(result.currentPage)-1);
				setRowsPerPage(Number(result.limit));
				setPage(Number(result.currentPage)-1);

			} else {
				setIsNoN(isNoN);
				setEmptyMessage("현재 경비 목록이 없습니다.");
			}

			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
			//processErrCode(e);
			console.log(e);
		});
		
	}, [state]);

	const snackBarClose = () => {
		setOpenSnackBar(false);
	}

	return (
		<Fragment>
		{rows.length != 0 &&
			<> 
				<LoadingBar openLoading={isShowLoadingBar}/>
					<Fragment>
						<Filter 
							filterRows={rows} filterSetRows={setRows}
							paging={paging} setPaging={setPaging}
							state={state} setState={setState}
							routeProps={props.routeProps}
							totalAmount={totalAmount} setTotalAmount={setTotalAmount}
							holdUp={holdUp} setHoldUp={setHoldUp}
							setPage={setPage} setRowsPerPage={setRowsPerPage}
							setShowLoadingBar={setShowLoadingBar} 
							setIsNoN={setIsNoN} setEmptyMessage={setEmptyMessage}
							setOpenSnackBar={setOpenSnackBar} 
							setSnackBarMessage={setSnackBarMessage}
						/>
					</Fragment>
				
				{isNoN ? 
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
				</>
	}
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