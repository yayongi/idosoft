import React from 'react';
import { withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import { Button} from '@material-ui/core';

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    //minWidth: '500px',
    minHeight: '100px',
  },
}))(MuiDialogContent);

//다이얼 로그
const FilterModal = ({props,state, setState, searchState,setSearchState,setOpenSnackBar,closeModal}) => {
	const [open, setOpen] = React.useState(false);

	// 검색 버튼 클릭 전, 임시로 값 저장
	const [dialogState, setDialogState] = React.useState({
		category : searchState.category != null ? searchState.category: 0,
		searchword : searchState.searchword
	});

	// Dialog 필드 값 변경 시, 임시로 값 저장
	const handleChange= event => {
		setDialogState({
			...dialogState,
			[event.target.name]: event.target.value
		});
	};

	const handleClose = () => {
		setOpen(false);
		closeModal(false);
	};

	// Dialog에서 취소버튼 클릭 시
	const handleClickCancel = () => {
		setDialogState({
			category : "",
			searchword : ""
		});
		handleClose();
	}
	// Dialog에서 검색버튼 클릭 시
	// 상위 컴포넌트의 state를 갱신 처리 해줌
	const handleClickSearch = () => {
		setSearchState({
			...searchState,
			category : document.getElementsByName("category")[0].value,
			searchword : document.getElementsByName("searchword")[0].value,
			flag : true
		});
		handleClose();
	}

	//검색 초기화
	const resetFilter = () => {
		setSearchState({
			...searchState,
			category : "",
			searchword : "",
			flag : false
		});

		setState({
			...state,
			showAll : true
		})
		sessionStorage.removeItem("memberFilter");
		handleClose();
		setOpenSnackBar(false);
	}
	
	return (
		<Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.openModal}>
			<DialogTitle id="form-dialog-title" onClose={handleClose}>
				직원검색
			</DialogTitle>
			<DialogContent dividers>
				<Grid container justify="flex-start">
					<Grid item xs={6} style={{paddingRight: 10}}>
						<TextField
							id="category"
							name="category"
							select
							margin="dense"
							label="유형"
							defaultValue={dialogState.category}
							onChange={handleChange}
							fullWidth>
							<MenuItem key={0} value={0}>이름</MenuItem>
							<MenuItem key={1} value={1}>직급</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={6} style={{paddingRight: 10}}>
						<TextField
							label="검색"
							id="searchword"
							name="searchword"
							placeholder="검색어를 입력하세요"
							margin="dense"
							InputLabelProps={{
								shrink: true,
							}}
							defaultValue={dialogState.searchword}
							type="search"
							onChange={handleChange}
							fullWidth
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={resetFilter} color="primary">
					검색초기화
				</Button>
				<Button onClick={handleClickCancel} color="primary">
					취소
				</Button>
				<Button onClick={handleClickSearch} color="primary">
					검색
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default FilterModal;