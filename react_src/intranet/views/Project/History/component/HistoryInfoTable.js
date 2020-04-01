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


function HistoryInfoTable(props) {
  const classes = useStyles();
  const { historyInfo } = props;
  
  console.log("historyInfo : ");
  console.log(historyInfo);
  const columnsUp = [
    { id: 'PROJECT_IDX', label: '순번', minWidth: 100, align: 'center' },
    { id: 'PROJECT_NM', label: '프로젝트명', minWidth: 100, align: 'center' },
    { id: 'INSTT_NM', label: '기관', minWidth: 100, align: 'center' },
    { id: 'TERM', label: '프로젝트 기간', minWidth: 100, align: 'center' },
    { id: 'CHRG_JOB', label: '담당업무', minWidth: 100, align: 'center' },
    { id: 'USE_LANG', label: '비고(사용언어)', minWidth: 100, align: 'center' },
  ];
  const columnsDown = [
    { id: 'PROJECT_IDX', label: '순번', minWidth: 100, align: 'center' },
    { id: 'PROJECT_NM', label: '프로젝트명', minWidth: 100, align: 'center' },
  ];
  // Width에 따라 반응형으로 열이 없어
  let columns = columnsUp;
  if (isWidthUp('md', props.width)) {
    columns = columnsUp;
  } else {
    columns = columnsDown;
  }

  const handleClickDetailView = (event, row) => {
    console.log("call handleClickDetailView");

  }

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
			            	colspan="6"
				          >
					    	현재 등록된 이력이 없습니다.
				    	</TableCell>
				    </TableRow>
		  		</>
		  	}
		  	{historyInfo.length > 0 &&
		  		<>
				    <TableRow>
					    <TableCell
				            align="left"
			            	colspan="6"
				          >
				    	송원회
				    	</TableCell>
				    </TableRow>
				  	<TableRow>
				        {columns.map(column => (
				          <TableCell
				            align="center"
				            style={{ minWidth: column.minWidth }}
				            className={column.className}
				          >
				            {column.label}
				          </TableCell>
				        ))}
				    </TableRow>
				</>
		  	}
		  </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default withWidth()(HistoryInfoTable);