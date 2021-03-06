import React, {useEffect} from 'react';
import Card from '@material-ui/core/Card';
import { Link as RouterLink, } from 'react-router-dom';
import { makeStyles, theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import StarIcon from '@material-ui/icons/Star';
import Toolbar from '@material-ui/core/Toolbar';
import FilterListIcon from '@material-ui/icons/FilterList';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { Button, Hidden } from '@material-ui/core';
import TablePagination from '@material-ui/core/TablePagination'
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import CreateIcon from '@material-ui/icons/Create';
import BarChartIcon from '@material-ui/icons/BarChart';

import CommonDialog from '../../js/CommonDialog';
import ContentModal from "./component/ContentModal";
import FilterModal from "./component/FilterModal";
import axios from 'axios';
import {dateFormatter, phoneFormatter, positionFormatter,excelExport,positionUnFormatter,dataCalculator} from '../../js/util';
import { LoadingBar } from '../../common/LoadingBar/LoadingBar';
import { getRootPath } from '../../js/util';

const useStyles = makeStyles(theme =>({
	tableWeb: {
		minWidth: 650,
	},
	tableApp: {
		
	},
	button :{
		textAlign:'right',
		marginTop:10,
	},
	root: {
		flexGrow: 1,
		marginLeft:10,
		marginRight:10,
	},
	root_tool: {
		// justifyContent: 'flex-end',
		 '& > *': {
			margin: theme.spacing(1),
		},
		flexGrow: 1,
	},
	title: {
		flex: '1',
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	button_tool: {
		marginRight: '10px',
	},
	router_link: {
		textDecoration: 'none',
	},
	fontsize:{
		fontSize : "smaller",
	}
}));

const MemberList = (props) => {
	const classes = useStyles();

	const { routeProps } = props;
	
	const [selected, setSelected] = React.useState([]);

	// 로딩바
	const [isShowLoadingBar, setShowLoadingBar] = React.useState(true);    //loading bar

	const [state, setState] = React.useState({
		preMemberList : null, //변경 직전 리스트
		memberList : null,	// 사원관리 리스트
		hiddenMemberList : null,
		manager_yn : 1,		// 관리자 여부
		showAll : true,
		showAllValue : 0,
		user : JSON.parse(sessionStorage.getItem("loginSession")).member_NO
	});

	const [openModal, setOpenModal] = React.useState({
		member_no:'',
		name:'',
		position:'',
		position_name:'',
		address_1:'',
		address_2:'',
		email:'', 
		phone_num:'',
		entry_date : '',
		photo_path:'',
		openModal:false,
		manager_yn : null,
		buttonName : '',
		datum : null
	});

	const[searchState, setSearchState] = React.useState({
		category : null ,
		searchword :  null,
		flag : false
	})

	const [openFilter, setOpenFilter] = React.useState({
		openModal:false,
		searchState:searchState,
		setSearchState:setSearchState
	});

	const [ pageSetting, setPageSetting ] = React.useState({
		page : sessionStorage.getItem("pageSetting") != null? JSON.parse(sessionStorage.getItem("pageSetting")).page : 0,
		pagerow : sessionStorage.getItem("pageSetting") != null? JSON.parse(sessionStorage.getItem("pageSetting")).pagerow : 10,
	});

	const [openSnackBar, setOpenSnackBar] = React.useState(false);

	useEffect(() => {
		axios({
			url: '/intranet/member/memberlist',
			method: 'post',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
		}).then(response => {
			if(state.showAll == true && response.data.memberData != null){
				let temp = response.data.memberData;
				temp = temp.filter(temp => temp.ret_date === null);

				// 사원리스트
				setState({
					...state,
					showMemberList : response.data.memberData,
					hiddenMemberList: temp,
					memberList : temp,
					showAll:false,
					manager_yn:response.data.isAdmin==1?true:false
				});
			}
			setShowLoadingBar(false);
		}).catch(e => {
			setShowLoadingBar(false);
		});
	},[searchState])

	const openContentModal = (datum) => {
		return setOpenModal({
			member_no:datum.member_no,
			name:datum.name,
			position:datum.position,
			position_name:datum.code_name,
			address_1:datum.address_1,
			address_2:datum.address_2,
			email:datum.email,
			phone_num:datum.phone_num,
			entry_date : datum.entry_date,
			photo_path : datum.photo_path,
			openModal:true,
			manager_yn : state.manager_yn,
			buttonName : '상세로 이동하기',
			datum:datum,
			routeProps : routeProps
		});
	  }
	  
	const handleCloseModal = (trigger) => {
		return setOpenModal({
			member_no:'',
			name:'',
			position:'',
			position_name:'',
			address_1:'',
			address_2:'',
			email:'', 
			phone_num:'',
			photo_path : '',
			entry_date : '',
			openModal:trigger,
			manager_yn : 0,
			buttonName : '',
			datum:null
		});
	}

	//검색창 열기
	const handleClickOpen = () => {
		return setOpenFilter({
			openModal:true
		});
	};

	//검색창 닫기
	const handleClickClose = () => {
		setOpenFilter({
			openModal:false
		});
	};

	if(state.memberList !=null && searchState.flag){
		let temp = null;

		if(state.showAllValue == 0){
			temp = state.hiddenMemberList;
		}else{
			temp = state.showMemberList;
		}

		if(searchState.category == 0){
		//이름 검색
			temp = temp.filter(temp => temp.name.indexOf(searchState.searchword) != -1);
		}else if(searchState.category == 1){
		//직급 검색
			temp = temp.filter(temp => temp.code_name.indexOf(searchState.searchword) != -1);
		}
		
		setState({
			...state,
			memberList : temp
		});

		setSearchState({
			...searchState,
			flag : false
		});

		sessionStorage.setItem("memberFilter",JSON.stringify(searchState));

		setOpenSnackBar(true);
	}

	//사원삭제
	const removeData = () => {
		if(selected.length != 0){
			// 사원 정보 삭제
			axios({
				url: '/intranet/member/memberdel',
				method: 'post',
				data : selected,
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'
				},
			}).then(response => {
				//체크박스로 선택된 직원 아이디로 선택적으로 필터링
				let temp_1 = state.showMemberList;
				for(let i=0;i<selected.length;i++){
					for(let j=0;j<temp_1.length;j++){
						if(temp_1[j].member_no === String(selected[i])){
							temp_1[j].ret_date = "99999999";
						}
					}
				}

				let temp_2 = state.hiddenMemberList;
				for(let i=0;i<selected.length;i++){
					temp_2 = temp_2.filter(temp_2 => temp_2.member_no !== String(selected[i]));
				}

				setSelected([]);

				let temp;

				if(state.showAllValue == 0){
					temp = temp_2
				}else{
					temp = temp_1
				}

				setState({
					...state,
					memberList : temp,
					showMemberList : temp_1,
					hiddenMemberList: temp_2,
				});
			}).catch(e => {
			});
		}else{
			const confirmData = ['직원정보삭제불가', '삭제할 데이터를 선택해 주세요.', false];
			handleOpenDialog(...confirmData)
		}
	}

	const handleChangePage = (event, newPage) => {
		setPageSetting({
			...pageSetting,
			page : newPage
		});
    };

    const handleChangeRowsPerPage = event => {
		setPageSetting({
			...pageSetting,
			page : 0,
			pagerow : +event.target.value
		})
	};
	
	const showAll = (value) => {
		if(value == 0){
			if(document.getElementById("bLabel") != null){
				document.getElementById("bLabel").innerText = "퇴사직원숨기기";
			}
			setState({
				...state,
				memberList : state.showMemberList,
				showAllValue : 1
			});
		}else if(value == 1){
			if(document.getElementById("bLabel") != null){
				document.getElementById("bLabel").innerText = "모든직원보이기";
			}
			setPage(0);
			setState({
				...state,
				memberList : state.hiddenMemberList,
				showAllValue : 0
			});
		}
	}

	// confirm, alert 창 함수
  	// 초기값은 {}로 설정하고 온오프시  {title:'', content:'', onOff:'true of false'} 형식으로 setting됨.
	const [dialog, setDialog] = React.useState({});

	// Dialog창의 title과 content, confirm여부  담는 배열
	// 배열 없이도 파라미터 입력해서 사용가능
	const confirmData = ['직원정보삭제', '직원정보를 삭제하시게습니까?', true];

	//Dialog open handler
	const handleOpenDialog = (title, content, isConfirm) => {
		return setDialog({title:title, content:content, onOff:true, isConfirm:isConfirm});
	}

	//Dialog close handler
	//확인:true 취소:false 리턴
	const handleCloseDialog = (title, result) => {
		setDialog({title:'', content:'', onOff:false, isConfirm:false});
		if(title === "직원정보삭제" && result === true){
			removeData();
		}else{
			return false;
		}
	}

	//전체 선택
	const onSelectAllClick = () =>{
		if (event.target.checked) {
			const newSelecteds = state.memberList.map(datum => datum.member_no);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	} 

	//체크박스 개별 선택
	const selectedItem = (event, id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		setSelected(newSelected);
	};

	const snackBarClose = (event, reason) => {
		if (reason === 'clickaway') {
		return;
		}

		setOpenSnackBar(false);
	};

	// 상세화면 이돋하기
	const goDetail = (member_no,manager_yn) => {
		sessionStorage.setItem("pageSetting",JSON.stringify(pageSetting));

		let url = "";
		if(manager_yn == true){
			url = "/member/membermod/admin/";
		}else{
			url = "/member/membermod/user/";
		}

		routeProps.history.push(url + member_no);
	}

	// 개인이력으로 넘어가기
	const goStory = (member_no) =>{
		let url = "";

		url = "/project/history/";

		routeProps.history.push(url + member_no);
	}

	// 맴버 엑셀 내보내기
	const memberExcelExport = () =>{
		if(state.memberList.length != 0){
			axios({
				url: '/intranet/member/exportexcel',
				method: 'post',
				data : {
					memeberList : state.memberList,
					title : 'memberData.xls',
					category : searchState.category,
					searchword : searchState.searchword
				},
				responseType: 'blob',
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(response => {
				const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'memberData.xls');
				document.body.appendChild(link);
				link.click();
			}).catch(e => {

			});
		}else{
			const confirmData = ['엑셀출력', '출력할 데이터가 없습니다.', false];
			handleOpenDialog(...confirmData)
		}
		
	}

	return (
		<div>
			<ContentModal props={openModal} pageSetting={pageSetting} setPageSetting={setPageSetting} closeModal={handleCloseModal}/>
			<FilterModal props={openFilter} state={state} setState={setState} setOpenSnackBar={setOpenSnackBar} pageSetting={pageSetting} setPageSetting={setPageSetting} searchState = {searchState} setSearchState = {setSearchState} closeModal={handleClickClose}/>
			<CommonDialog props={dialog} closeCommonDialog={handleCloseDialog}/>
			<LoadingBar openLoading={isShowLoadingBar}/>

			<Snackbar
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			onClose={snackBarClose}
			open={openSnackBar}
			message={searchState.category == 0 ? "이름 : "+searchState.searchword:"직급 : "+searchState.searchword}
			action={
				<React.Fragment>
					<IconButton size="small" aria-label="close" color="inherit" onClick={snackBarClose}>
						<CloseIcon fontSize="small" />
					</IconButton>
				</React.Fragment>
			}
			/>

				{state.memberList !=null && (
					<Card>
						<Toolbar className={classes.root_tool}>
							<Typography className={classes.title} variant="h6" style={{minWidth:"85px"}} >
								사원관리
							</Typography>
							<div className={classes.container}>
								<Hidden smDown>
									<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickOpen} className={classes.button_tool}>
										검색
									</Button>
									<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} onClick={() => memberExcelExport(state.memberList)} className={classes.button_tool}>
										엑셀 내보내기
									</Button>
									{state.manager_yn && (
										<RouterLink button="true" to="/member/memberreg" className={classes.router_link}>
											<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />}>
												직원정보등록
											</Button>
										</RouterLink>
									)}
									{state.manager_yn && (
										<Button variant="contained" color="primary" size="small" startIcon={<AssignmentIndIcon />} onClick={() => showAll(state.showAllValue)} style={{marginLeft:"10px"}}>
											<a id="bLabel">모든직원보이기</a>
										</Button>
									)}
									{state.manager_yn && (
										<Button variant="contained" color="secondary" size="small" startIcon={<DeleteIcon />} onClick={() => handleOpenDialog(...confirmData)} style={{marginLeft:"10px"}}>
											직원정보삭제
										</Button>
									)}
								</Hidden>
								<Hidden mdUp>
									<IconButton color="primary" onClick={handleClickOpen} className={classes.button_tool}>
										<FilterListIcon />
									</IconButton>
									<IconButton color="primary" onClick={() => memberExcelExport(state.memberList)} className={classes.button_tool}>
										<SaveIcon />
									</IconButton>
									{state.manager_yn && (
										<RouterLink button="true" to="/member/memberreg" className={`${classes.router_link} ${classes.button_tool}`}>
											<IconButton color="primary">
												<AddIcon />
											</IconButton>
										</RouterLink>
									)}
									{state.manager_yn && (
										<IconButton color="secondary" onClick={() => handleOpenDialog(...confirmData)}>
											<DeleteIcon />
										</IconButton>
									)}
									{state.manager_yn && (
										<IconButton color="primary" onClick={showAll} className={classes.button_tool} onClick={() => showAll(state.showAllValue)}>
											<AssignmentIndIcon />
										</IconButton>
									)}
								</Hidden>
							</div>
						</Toolbar>
						{(state.memberList.length != 0) && (
							<TablePagination
								rowsPerPageOptions={[10, 25, 100]}
								component="div"
								count={state.memberList.length}
								rowsPerPage={pageSetting.pagerow}
								page={pageSetting.page}
								onChangePage={handleChangePage}
								onChangeRowsPerPage={handleChangeRowsPerPage}
							/>
						)}
						<TableContainer>
							<Toolbar>
								<Hidden smDown>
									{(state.memberList.length != 0) ? (
										<Table className={classes.tableWeb} stickyHeader aria-label="simple table">
										<TableHead>
											<TableRow>
												{state.manager_yn && (
													<TableCell padding="checkbox">
														<Checkbox 
															onChange={onSelectAllClick}
														></Checkbox>
													</TableCell>
												)}	
												<TableCell align="center">이름</TableCell>
												<TableCell align="center">직급</TableCell>
												<TableCell align="center">주소</TableCell>
												<TableCell align="center">휴대전화</TableCell>
												<TableCell align="center">경력</TableCell>
												<TableCell align="center">입사일</TableCell>
												<TableCell align="center">자격증</TableCell>
												<TableCell align="center">수정 / 이력</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
										{state.memberList.slice(pageSetting.page * pageSetting.pagerow, pageSetting.page * pageSetting.pagerow + pageSetting.pagerow).map(row => (
											<TableRow key={row.member_no} hover style={(row.ret_date != null)? {backgroundColor:"lightgrey"}:{}}>
												{state.manager_yn && (
													<TableCell padding="checkbox">
														<Checkbox
															checked={(selected.indexOf(row.member_no) !== -1)? true : false}
															onChange={() => selectedItem(event,row.member_no)}
															key = {row.member_no}
														/>
													</TableCell>
												)}
												<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}} className = {classes.fontsize}>
													{row.manager_yn === true && (<StarIcon style={{verticalAlign:'bottom'}}/>) } 
													{row.name}
												</TableCell>
												<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}} className = {classes.fontsize}>{row.code_name}</TableCell>
												<TableCell onClick={event => openContentModal(row)} style={{cursor : "pointer", maxWidth:"200px"}}>
													{row.address_1} {row.address_2}
													</TableCell>
												<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}} className = {classes.fontsize}>{phoneFormatter(row.phone_num)}</TableCell>
												<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}} className = {classes.fontsize}>{dataCalculator(row.career_date)} </TableCell>
												<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}} className = {classes.fontsize}>{dateFormatter(row.entry_date)}</TableCell>
												<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}} className = {classes.fontsize}>
													{row.cert_yn == 1? '유':'무'}
												</TableCell>
												<TableCell align="center">
													<IconButton aria-label="delete" className={classes.iconPadding} onClick={() => goDetail(row.member_no,state.manager_yn)}>
														<CreateIcon fontSize="small" />
													</IconButton>
													<IconButton aria-label="delete" className={classes.iconPadding} onClick={() => goStory(row.member_no)}>
														<BarChartIcon fontSize="small" />
													</IconButton>
												</TableCell>
											</TableRow>
										))}
										</TableBody>
									</Table>
									) : (<Paper style={{minHeight : "300px", width:"100%", textAlign:"center"}} elevation={0} ><h3 style={{paddingTop:"100px"}}> 현재 직원 목록이 없습니다.</h3></Paper>)}
								</Hidden>
								<Hidden mdUp>
									{(state.memberList.length != 0) ?
									(<Table className={classes.tableApp} stickyHeader aria-label="simple table">
										<TableHead>
											<TableRow>	
												{state.manager_yn && (
													<TableCell padding="checkbox">
														<Checkbox 
															onChange={onSelectAllClick}
														></Checkbox>
													</TableCell> 
												)}
												<TableCell align="center">이름</TableCell>
												<TableCell align="center">수정 / 이력</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
										{state.memberList.slice(pageSetting.page * pageSetting.pagerow, pageSetting.page * pageSetting.pagerow + pageSetting.pagerow).map(row => (
												<TableRow key={row.member_no} hover style={(row.ret_date != null)?  {backgroundColor:"lightgrey"}:{}}>
													{state.manager_yn && (
													<TableCell padding="checkbox">
														<Checkbox
															checked={(selected.indexOf(row.member_no) !== -1)? true : false}
															onChange={() => selectedItem(event,row.member_no)}
															key = {row.member_no}
														/>
													</TableCell>
													)}
													<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}} className = {classes.fontsize}>
														{row.manager_yn === true && (<StarIcon style={{verticalAlign:'bottom'}}/>) } 
														{row.name}
													</TableCell>
													<TableCell align="center">
														<IconButton aria-label="delete" className={classes.iconPadding} onClick={() => goDetail(row.member_no,state.manager_yn)}>
															<CreateIcon fontSize="small" />
														</IconButton>
														<IconButton aria-label="delete" className={classes.iconPadding} onClick={() => goStory(row.member_no)}>
															<BarChartIcon fontSize="small" />
														</IconButton>
													</TableCell>
												</TableRow>
											))
										}
										</TableBody>
									</Table>
									) : (<Paper style={{minHeight : "300px", width:"100%", textAlign:"center"}} elevation={0} ><h3 style={{paddingTop:"100px"}}> 현재 직원 목록이 없습니다.</h3></Paper>)}				
								</Hidden>
							</Toolbar>
						</TableContainer>
						{(state.memberList.length != 0) && (
							<TablePagination
								rowsPerPageOptions={[10, 25, 100]}
								component="div"
								count={state.memberList.length}
								rowsPerPage={pageSetting.pagerow}
								page={pageSetting.page}
								onChangePage={handleChangePage}
								onChangeRowsPerPage={handleChangeRowsPerPage}
							/>
						)}
					</Card>
				)}
		</div>
	);
}

export default MemberList;