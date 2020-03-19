import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
import RemoveIcon from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import { Divider, Button, Grid, Hidden } from '@material-ui/core';

import {tableList} from './data';
import ContentModal from "./ContentModal";
import FilterModal from "./FilterModal";
import {dateFormatter, phoneFormatter, positionFormatter} from '../../js/util';

const useStyles = makeStyles(theme =>({
	table: {
		minWidth: 650,
	},
	button :{
		textAlign:'right',
		marginTop:10
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
	}
}));

var selected = [];

// 모든체크박스 선택
const onSelectAllClick = () =>{

}
// 체크박스 선택
const isItemSelected = (event,id) =>{
	if(event.target.checked){
		selected.push(id);
	}else{
		selected.splice(selected.indexOf(id),1)
	}
}

const MemberList = () => {
	const classes = useStyles();
	
	const [state, setState] = React.useState({
		memberList : tableList,	// 사원관리 리스트
		manager_yn : true		// 관리자 여부
	});

	const [openModal, setOpenModal] = React.useState({
		name:'',
		postion:'',
		address1:'',
		address2:'',
		email:'', 
		openModal:false,
		manager_yn : null,
		buttonName : '',
		datum : null
	});

	const [openFilter, setOpenFilter] = React.useState({
		openModal:false
	});

	//만약 등록화면에서 넘어 오면 리스트 추가
	if((localStorage.getItem('savedData') != null) || (localStorage.getItem('savedData') != undefined)){
		const savedData = JSON.parse(localStorage.getItem('savedData'));	//등록, 수정 화면에서 받아온 데이터
		let temp_data = null;	//임시
		let flag = true;

		// 기존의 리스트에 해당 직원이 있는지 없는지 확인한다.
		state.memberList.map((member,index) => {
			if(member.id == savedData.id){
				state.memberList[index] = savedData;
				flag = false;
				temp_data = state.memberList;
			}
		})

		//기존의 리스트에 직원 아이디가 없는 경우 추가되는 직원으로 판단한다.
		if(flag){
			//새로 등록된 사원인 경우
			temp_data = state.memberList.concat(savedData)
		}

		//변경된 직원리스트 state에 업데이트
		setState({
			...state,
			memberList : temp_data
		});

		//local스토리지에 보관중인 기존 데이터 삭제.
		localStorage.removeItem('savedData');
	}

	//사원삭제
	const removeData = () => {
		//체크박스로 선택된 직원 아이디로 선택적으로 필터링
		let temp = state.memberList;
		for(let i=0;i<selected.length;i++){
			temp = temp.filter(temp => temp.id !== String(selected[i]));
		}

		selected = [];

		setState({
			...state,
			memberList : temp
		});
	}

	//임시 로컬스토리지에 저장하기
	const setLocalstorage = (data) => {
		//기존 스토리지에 있는 데이터 삭제.
		localStorage.removeItem('savedData');
		//수정 페이지로 이동할 때 필요한 데이터 함께 이동 
		localStorage.setItem('savedData', JSON.stringify(data));
	}

	const openContentModal = (datum) => {
		return setOpenModal({
			name:datum.name,
			postion:datum.position,
			address1:datum.address1,
			address2:datum.address2,
			email:datum.email,
			openModal:true,
			manager_yn : state.manager_yn,
			buttonName : '상세로 이동하기',
			datum:datum
		});
	  }
	  
	const handleCloseModal = (trigger) => {
		return setOpenModal({
			name:'',
			postion:'',
			address1:'',
			address2:'',
			email:'', 
			openModal:trigger,
			manager_yn : null,
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
		return setOpenFilter({
			openModal:false
		});
	};

	//엑셀 내보내기
	const excelExport = () => {
		alert("엑셀 내보내기");
	}

	return (
		<div>
			<ContentModal props={openModal} closeModal={handleCloseModal}/>
			<FilterModal props={openFilter} closeModal={handleClickClose}/>
			<Card>
				<CardContent>
					사원관리
				</CardContent>
				<Toolbar className={classes.root_tool}>
					<div className={classes.container} style={{textAlign:"right"}}>
						<Hidden smDown>
							<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickOpen} className={classes.button_tool}>
								검색
							</Button>
							<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} onClick={excelExport} className={classes.button_tool}>
								엑셀 내보내기
							</Button>
							<Button variant="contained" color="primary" size="small" startIcon={<RemoveIcon />} onClick={removeData}>
								직원정보삭제
							</Button>
						</Hidden>
						<Hidden mdUp>
							<IconButton color="primary" onClick={handleClickOpen} className={classes.button_tool}>
								<FilterListIcon />
							</IconButton>
							<IconButton color="primary" onClick={excelExport} className={classes.button_tool}>
								<SaveIcon />
							</IconButton>
							<IconButton color="primary" onClick={removeData}>
								<RemoveIcon />
							</IconButton>
						</Hidden>
					</div>
				</Toolbar>
				<TableContainer>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>	
								<TableCell padding="checkbox">
									<Checkbox 
										onChange={onSelectAllClick}
									></Checkbox>
								</TableCell>
								<TableCell align="center">이름</TableCell>
								<TableCell align="center">직급</TableCell>
								<TableCell align="center">주소</TableCell>
								<TableCell align="center">휴대전화</TableCell>
								<TableCell align="center">경력</TableCell>
								<TableCell align="center">입사일</TableCell>
								<TableCell align="center">자격증<br/>유무</TableCell>
								<TableCell align="center">개인이력</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{state.memberList.map(row => (
							<TableRow key={row.id}>
								<TableCell padding="checkbox">
									<Checkbox
										onChange={() => isItemSelected(event,row.id)}
										key = {row.id}
									/>
								</TableCell>
								<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}}>
									{row.manager_yn === 1 && (<StarIcon style={{verticalAlign:'bottom'}}/>) } 
									{row.name}
								</TableCell>
								<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}}>{positionFormatter(row.position)}</TableCell>
								<TableCell onClick={event => openContentModal(row)} style={{cursor : "pointer"}}>
									{row.address1} {row.address2}
									</TableCell>
								<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}}>{phoneFormatter(row.phone)}</TableCell>
								<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}}>{row.career} </TableCell>
								<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}}>{dateFormatter(row.entry)}</TableCell>
								<TableCell align="center" onClick={event => openContentModal(row)} style={{cursor : "pointer"}}>
									{row.cert_yn == 1? '유':'무'}
								</TableCell>
								<TableCell align="center">
									<RouterLink button="true" to={state.manager_yn == true ? "/member/membermod_admin":"/member/membermod_user"}>
										<Button variant="contained" color="primary" onClick={() => setLocalstorage(row)}>
											수정
										</Button>
									</RouterLink>
									<Button variant="contained" color="primary">
										개인이력
									</Button>
								</TableCell>
							</TableRow>
						))}
						</TableBody>
					</Table>
				</TableContainer>
			</Card>
			<div className={classes.button}>
				<RouterLink button="true" to="/member/memberreg">
					<Button variant="contained" color="primary" >
						사원정보 등록
					</Button>
				</RouterLink>
			</div>
		</div>
	);
}

export default MemberList;
