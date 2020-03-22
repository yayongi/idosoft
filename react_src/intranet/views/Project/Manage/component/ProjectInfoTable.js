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

function ProjectInfo(props) {
  const classes = useStyles();
  const { projectInfo, routeProps } = props;
  const rows = projectInfo;

  console.log(rows);

  //console.log(rows);
  // 상세페이지로 이동

  //연도, 프로젝트명, 기관,  프로젝트 기간, PM, 교통비
  const columnsUp = [
    { id: 'year', label: '연도', minWidth: 100, align: 'center' },
    { id: 'project_nm', label: '프로젝트명', minWidth: 100, align: 'center' },
    { id: 'instt_name', label: '기관', minWidth: 100, align: 'center' },
    { id: 'term', label: '프로젝트 기간', minWidth: 100, align: 'center' },
    { id: 'pm_name', label: 'PM', minWidth: 100, align: 'center' },
    { id: 'transport_ct', label: '교통비', minWidth: 100, align: 'center' },
  ];
  const columnsDown = [
    { id: 'year', label: '연도', minWidth: 100, align: 'center' },
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

    var url = "/project/manage/view";
    var queryString = jsonToQuery(row);

    //console.log("url : " + url);
    //console.log("queryString : " + queryString);

    routeProps.history.push(url + queryString);
  };

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
            {rows.map(row => {
              return (
                <TableRow hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.project_no}
                  onClick={() => handleClickDetailView(event, row)} // react router의 상세
                >
                  {columns.map((column, idx) => {
                    var value = row[column.id];
                    if(column.id === "transport_ct"){
                      value = row["printMoney"];
                    }
                    return (
                      <TableCell key={row.project_no + idx} align={column.align} className={column.className}>
                        {value !== "" ? value : "-"}
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

export default withWidth()(ProjectInfo);