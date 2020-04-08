import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

import { processErrCode } from '../../../../js/util';

import axios from 'axios';

import { Divider, Button, Grid, Hidden } from '@material-ui/core';
import { getSiteInfoDB } from '../../data';


import { Link as RouterLink } from 'react-router-dom';

const useToolbarStyles = makeStyles(theme => ({
	root: {
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
	button: {
		marginRight: '10px',
	}
}));

/*
	경비관리목록 검색영역
*/
export default function HistorySearchDiv(props) {
	
	const classes = useToolbarStyles();
	const {username, excelDownLoad, setSearchData, memberList, searchData} = props;
	const [open, setOpen] = useState(false);
	const [isAdmin, SetIsAdmin] = useState(false);
	const [searchMember, setSearchMemer] = useState(searchData);
	
	useEffect(() => {
		axios({
			url: '/intranet/getIsCheckAdmin',
			method: 'post',
			data : {},
		}).then(response => {
			if(response.data.isAdmin == "1"){
				SetIsAdmin(true);
			}else{
				SetIsAdmin(false);
			}
		}).catch(e => {
			processErrCode(e);
		});
	}, []);
	
	const handleClickExcelBtn = () => {
		excelDownLoad();
	}
	
	const handleClickSearchBtn = () => {
		setOpen(true);
		//setSearchData();
	}
	
	const handleClose = () => {
		setOpen(false);
	}
	
	const handleChange = (event) => {
		setSearchMemer(event.target.value);
	}
	
	const handleClick = () => {
		setSearchData(searchMember);
		setOpen(false);
		
		var tmp = memberList.filter((info) => info.member_no == searchMember);
		var name= "";
		if(typeof(tmp) == "object" && tmp.length > 0){
			name = tmp[0]["name"] + " " + tmp[0]["code_name"] + "님 입니다.";
		}
		var txt = "검색 조건 : " + name;
		setSnackBarMessage(txt);
		setOpenSnackBar(true);
	}
	
	//snack bar와 관련
	const [openSnackBar, setOpenSnackBar] = React.useState(false);
	const [snackBarMessage , setSnackBarMessage] = React.useState('');

	const snackBarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnackBar(false);
	};
	
	return (
		<Fragment>
			<Snackbar
				anchorOrigin={{vertical: 'top',horizontal: 'center',}}
				onClose={snackBarClose}
				open={openSnackBar}
				message={snackBarMessage}
				action={
					<React.Fragment>
						<IconButton size="small" aria-label="close" color="inherit" onClick={snackBarClose}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</React.Fragment>
				}/>
		
		
			<Toolbar className={classes.root}>
				<Typography className={classes.title} color="secondary" variant="subtitle2">					
					이력관리 - {username}
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						{
							<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickSearchBtn} className={classes.button}>
								검색 
							</Button>
						}
						<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} className={classes.button} onClick={handleClickExcelBtn}>
							엑셀 내보내기
						</Button>
						<RouterLink button="true" to="/project/history_new/">
							<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} className={classes.button}>
								이력 등록 
							</Button>
						</RouterLink>
					</Hidden>
					<Hidden mdUp>
						{	
							<IconButton color="primary" className={classes.button} onClick={handleClickSearchBtn}>
								<FilterListIcon />
							</IconButton>
						}
						<IconButton color="primary" onClick={handleClickExcelBtn}>
							<SaveIcon />
						</IconButton>
						<RouterLink button="true" to="/project/history_new/">
							<IconButton color="primary" className={classes.button}>
								<AddIcon />
							</IconButton>
						</RouterLink>
					</Hidden>
				</div>
			</Toolbar>
			
			
			{open && <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="sm">
				<DialogTitle id="form-dialog-title">검색</DialogTitle>
				<DialogContent>
					<DialogContentText>
						조건을 선택 및 입력 후, 하단의 검색버튼을 클릭해주세요.
					</DialogContentText>
					<Grid container justify="flex-start">
						<TextField
							label="사원명"
							id="searchKeyword"
							name="searchKeyword"
							placeholder="검색어"
							margin="dense"
							InputLabelProps={{
								shrink: true,
							}}
							type="search"
							value={searchMember}
							onChange={handleChange}
							fullWidth
							select>
							{memberList.map((info) => {
								if(info.member_no == "2019070801"){
									
								}else{
									return (
										<MenuItem key={info.member_no} value={info.member_no}>
											{info.name}
										</MenuItem>
									)
								}
							})}
						</TextField>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button color="primary" onClick={handleClose}>
						취소
					</Button>
					<Button color="primary" onClick={handleClick}>
						검색
					</Button>
				</DialogActions>
			</Dialog> }
			
			
		</Fragment>
	);
}