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


function getTableFormData(codeInfo, rootCodeList){
  var rows = [];
  for(var i=0; i < codeInfo.length; i++){
    var upper_code = codeInfo[i].upper_code;

    if(!upper_code){
      codeInfo[i]["upper_name"] = "분류코드";
      rows.push(codeInfo[i])
      continue;
    }

    var upperRoot = rootCodeList.filter((info) => (
      info["code_id"] === upper_code
    ));

    codeInfo[i]["upper_name"] = upperRoot.length > 0 ? upperRoot[0]["code_name"] : "-";
    rows.push(codeInfo[i]);
  }
  return rows;
}


const useStyles = makeStyles({
  root: {
    width: '100%',
    textDecoration: 'none',
  },
});

function CodeInfoTable(props) {
    const classes = useStyles();
    const { codeInfo, rootCodeList } = props;
    const rows = getTableFormData(codeInfo, rootCodeList);
    const someData = {};

    console.log(rows);
    // 상세페이지로 이동


    const columnsUp = [
      { id: 'code_id', label: '코드ID', minWidth: 100, align: 'center' },
      { id: 'code_level', label: 'Level', minWidth: 100, align: 'center' },
      { id: 'code_name', label: '코드명', minWidth: 100, align: 'center' },
      { id: 'upper_code', label: '상위코드', minWidth: 100, align: 'center' },
      { id: 'upper_name', label: '코드유형', minWidth: 100, align: 'center' },
    ];

    const columnsDown = [
      { id: 'code_id', label: '코드ID', minWidth: 100, align: 'center' },
      { id: 'code_name', label: '코드명', minWidth: 100, align: 'center' },
      { id: 'upper_name', label: '코드유형', minWidth: 100, align: 'center' },
    ];

    // Width에 따라 반응형으로 열이 없어
    let columns = columnsUp;
    if(isWidthUp('md', props.width)) {
      columns =columnsUp;
    } else {
      columns =columnsDown;
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
              {rows.map(row => {
                return (
                  <TableRow hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={row.code_id} 
                  >
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={row.code_id + column.id} align={column.align} className={column.className}>
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

export default withWidth()(CodeInfoTable);