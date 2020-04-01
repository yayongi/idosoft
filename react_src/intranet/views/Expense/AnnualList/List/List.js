import React, { Fragment, useEffect } from 'react';
import Filter from './component/Filter'
import Body from './component/Body'
import Paper from '@material-ui/core/Paper';
import Axios from 'axios';
import ko from "date-fns/locale/ko";
import Moment from "moment";
import { processErrCode, isEmpty } from '../../../../js/util'
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
	const [ holdUp, setHoldUp ] = React.useState(0);					// 이미 가지고있는 페이지를 다시 호출하는 것을 막기 위해 사용
	const [firstRender, setFirstRender ] = React.useState(false);
	const [isNoN, setIsNoN] = React.useState(false);

	// 페이징
	const [ page, setPage ] = React.useState(0);						// 초기페이지가 0부터 시작
	const [ rowsPerPage, setRowsPerPage ] = React.useState(10); 
	
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(false); // 로딩바
	useEffect(() => {
		setShowLoadingBar(true);
		Axios({
			url: '/intranet/getAnnaualList.exp',
			method: 'post',
			data: {
				currentPage : '1',
				limit : '10',
				payStDt: Moment().format('YYYY')+'01',
				payEdDt: Moment().format('YYYYMM'),
			},
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			const isNoN = response.data.isNoN;

			if(isNoN == "false"){
				setRows(JSON.parse(response.data.list));
				setPaging(JSON.parse(response.data.result));
				setTotalAmount(response.data.totalAmount);
				setFirstRender(true);
			} else {
				setFirstRender(true);
				setIsNoN(isNoN);
				// 빈화면 처리
			}

			setShowLoadingBar(false);
		}).catch(e => {
			processErrCode(e);
			console.log(e);
			setShowLoadingBar(false);
		});
		
	}, []);

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
							totalAmount={totalAmount} setTotalAmount={setTotalAmount}
							holdUp={holdUp} setHoldUp={setHoldUp}
							setPage={setPage} setRowsPerPage={setRowsPerPage}
							setShowLoadingBar={setShowLoadingBar} 
							/>
					</Fragment>
				}
				{isNoN ? 
					<Paper style={{minHeight : "300px", width:"100%", textAlign:"center"}} elevation={0} ><h3 style={{paddingTop:"100px"}}> 현재 경비 목록이 없습니다.</h3></Paper>
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
		</Fragment>
		);
}