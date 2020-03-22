import React, { useState } from 'react';
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
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

function jsonToQuery(obj) {
  return ('?' +
    Object.keys(obj).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    }).join('&'));
}


const useStyles = makeStyles({
  root: {
    width: '100%',
    textDecoration: 'none',
  },
});

function HistoryInfoTable(props) {
  const classes = useStyles();
  const { historyInfo, routeProps } = props;
  const rows = historyInfo;
  
  console.log(historyInfo);

  const columnsUp = [
    { id: 'index', label: '번호', minWidth: 100, align: 'center' },
    { id: 'project_nm', label: '프로젝트명', minWidth: 100, align: 'center' },
    { id: 'instt_nm', label: '기관', minWidth: 100, align: 'center' },
    { id: 'term', label: '프로젝트 기간', minWidth: 100, align: 'center' },
    { id: 'chrg_job', label: '담당업무', minWidth: 100, align: 'center' },
    { id: 'use_lang', label: '비고(사용언어)', minWidth: 100, align: 'center' },
  ];
  const columnsDown = [
    { id: 'index', label: '번호', minWidth: 100, align: 'center' },
    { id: 'project_nm', label: '프로젝트명', minWidth: 100, align: 'center' },
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

    var url = "/project/history/view";
    var queryString = jsonToQuery(row);

    //console.log("url : " + url);
    //console.log("queryString : " + queryString);

    routeProps.history.push(url + queryString);
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    className={column.className}
                  >
                    {column.label}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, row_idx) => {
              return (
                <TableRow hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.mem_hist_no}
                  onClick={() => handleClickDetailView(event, row)} // react router의 상세
                >
                  {columns.map((column, idx) => {
                    var value = "";

                    if(column.id != "index"){
                      value = row[column.id]
                    }else{
                      value = row_idx+1;
                    }
                    return (
                      <TableCell key={row.mem_hist_no + "_" + idx} align={column.align} className={column.className}>
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default withWidth()(HistoryInfoTable);