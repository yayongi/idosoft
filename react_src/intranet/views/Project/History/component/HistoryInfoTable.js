import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

const useStyles = makeStyles({
  root: {
    width: '100%',
    textDecoration: 'none',
  },
});

function getTable(idx, beforeMember, historyInfo, props, historyOriginalInfo, isAdmin){
	const { routeProps } = props;
	
	const personTatalCount = historyOriginalInfo.filter((info) => info["MEMBER_NO"] == historyInfo[0]["MEMBER_NO"]).length;
	
	const columnsUp = [
	  { id: 'PROJECT_NM', label: '프로젝트명', minWidth: 100, align: 'center' },
	  { id: 'INSTT_NM', label: '기관', minWidth: 100, align: 'center' },
	  { id: 'TERM', label: '프로젝트 기간', minWidth: 100, align: 'center' },
	  { id: 'CHRG_JOB', label: '담당업무', minWidth: 100, align: 'center' },
	  { id: 'USE_LANG', label: '비고(사용언어)', minWidth: 100, align: 'center' },
	];
	const columnsDown = [
	  { id: 'PROJECT_NM', label: '프로젝트명', minWidth: 100, align: 'center' },
	];
	
	  // Width에 따라 반응형으로 열이 없어
	let columns = columnsUp;
	if (isWidthUp('md', props.width)) {
	    columns = columnsUp;
	} else {
	    columns = columnsDown;
	}
	var isContinue = true;
	if(historyInfo.length == 1){
		isContinue = false;
	}
	
	const handleClickDetailView = (MEM_HIST_NO) => {
		var path = routeProps.match.path.split(":")[0];
		routeProps.history.push(path+`view/${MEM_HIST_NO}`);
	}
	
	
	if(beforeMember != historyInfo[0]["MEMBER_NO"]){
		idx=0;
		return (
			<>
				<TableRow>
				    <TableCell
				        align="left"
				        colSpan="6"
			        	key={historyInfo[0]["MEM_HIST_NO"]}>
				    {historyInfo[0]["MEMBER_NAME"]}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell
				        align="center"
				        style={{ minWidth: 100 }}
						key={historyInfo[0]["MEM_HIST_NO"]+idx}>
				    	순번
				    </TableCell>
				    {columns.map((column, columIdx) => (
				      <TableCell
				        align="center"
				        style={{ minWidth: column.minWidth }}
				        className={column.className}
				      	key={historyInfo[0]["MEM_HIST_NO"] + columIdx}>
				        {column.label}
				      </TableCell>
				    ))}
				</TableRow>
				<TableRow
					onClick={() => handleClickDetailView(historyInfo[0]["MEM_HIST_NO"])} isAdmin={isAdmin}>
					<TableCell
				        align="center"
				        style={{ minWidth: 100 }}
						key={historyInfo[0]["MEM_HIST_NO"] + idx }>
				    	{personTatalCount-idx}
				    </TableCell>
					{columns.map((column, columnIdx) => (
				      <TableCell
				        align="center"
				        style={{ minWidth: column.minWidth }}
				        className={column.className}
				      	key={column.id + historyInfo[0][column.id] + columnIdx}>
				        {historyInfo[0][column.id]}
				      </TableCell>
				    ))}
				</TableRow>
				{isContinue && getTable(idx+1, historyInfo[0]["MEMBER_NO"], historyInfo.slice(1, historyInfo.length), props, historyOriginalInfo)}
			</>
		)
	}else{
		return (
			<>
				<TableRow
					onClick={() => handleClickDetailView(historyInfo[0]["MEM_HIST_NO"])}>
					<TableCell align="center">
						{personTatalCount-idx}
					</TableCell>
					{columns.map((column, columnIdx) => (
				      <TableCell
				        align="center"
				        style={{ minWidth: column.minWidth }}
				        className={column.className}
				      	key={column.id + historyInfo[0][column.id] + columnIdx}>
				        {historyInfo[0][column.id]}
				      </TableCell>
				    ))}
				</TableRow>
				{isContinue && getTable(idx+1, historyInfo[0]["MEMBER_NO"], historyInfo.slice(1, historyInfo.length), props, historyOriginalInfo)}
			</>
		)
	}
}

function HistoryInfoTable(props) {
  const classes = useStyles();
  const { historyOriginalInfo, memberlist, selectedUserName,isAdmin } = props;
  const historyInfo = [].concat(historyOriginalInfo);
  
  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
		  <TableBody>
		  	{historyInfo.length == 0 &&
		  		<>
				  	 <TableRow>
					    <TableCell
				            align="left"
			            	colSpan="6">
					    {selectedUserName.name} 님은 현재 등록된 이력이 없습니다.
				    	</TableCell>
				    </TableRow>
		  		</>
		  	}
		  	{	historyInfo.length > 0 &&
		  		getTable(0, "", historyInfo, props, historyOriginalInfo,isAdmin)
		  	}
		  </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default withWidth()(HistoryInfoTable);