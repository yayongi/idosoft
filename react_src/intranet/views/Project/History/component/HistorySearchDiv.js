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
}));

/*
	경비관리목록 검색영역
*/
export default function HistorySearchDiv(props) {
	
	const classes = useToolbarStyles();
	const {username, excelDownLoad, setSearchData, memberlist, searchData} = props;
	const [open, setOpen] = useState(false);
	const [isAdmin, SetIsAdmin] = useState(false);
	const [searchMember, setSearchMemer] = useState(typeof(searchData) == "undefined" ? -1 : searchData);
	
	console.log("memberlist : ");
	console.log(memberlist);
	
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
	}
	

	return (
		<Fragment>
			<Toolbar className={classes.root}>
				<Typography className={classes.title} color="secondary" variant="subtitle2">					
					이력관리 - {username}
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						{
							isAdmin && 
							<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickSearchBtn}>
								검색 
							</Button>
						}
						<RouterLink button="true" to="/project/history_new/">
							<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} >
								이력 등록 
							</Button>
						</RouterLink>
						<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} className={classes.button} onClick={handleClickExcelBtn}>
							엑셀 내보내기
						</Button>
					</Hidden>
					<Hidden mdUp>
						{	isAdmin && 
							<IconButton color="primary" className={classes.button} onClick={handleClickSearchBtn}>
								<FilterListIcon />
							</IconButton>
						}
						<RouterLink button="true" to="/project/history_new/">
							<IconButton color="primary" className={classes.button}>
								<AddIcon />
							</IconButton>
						</RouterLink>
						<IconButton color="primary" onClick={handleClickExcelBtn}>
							<SaveIcon />
						</IconButton>
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
						<MenuItem key={-1} value={-1}>
							전체
						</MenuItem>
						{memberlist.map((info) => {
							if(info.member_no == "99999999" || info.member_no == "2019070801"){
								
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