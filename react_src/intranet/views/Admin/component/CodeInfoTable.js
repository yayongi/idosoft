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

function getTableFormData(codeInfo) {
  if(codeInfo){
    var rows = [];
    for (var i = 0; i < codeInfo.length; i++) {
      var upper_code = codeInfo[i].upper_code;

      if (!upper_code) {
        //codeInfo[i]["upper_name"] = "분류코드";
        rows.push(codeInfo[i])
        continue;
      }
    }
    return rows;
  }else{
    return [];
  }

}

const useStyles = makeStyles({
  root: {
    width: '100%',
    textDecoration: 'none',
  },
});

  function CodeInfoTable(props) {
    const classes = useStyles();
    const { codeInfo, routeProps, updateSelectedNodeId } = props;
    const rows = getTableFormData(codeInfo);


    console.log("code Info for codeInfoTable");
    console.log(codeInfo);
    //console.log(rows);
    // 상세페이지로 이동


    const columnsUp = [
      { id: 'CODE_ID', label: '코드ID', minWidth: 100, align: 'center' },
      { id: 'CODE_LEVEL', label: 'Level', minWidth: 100, align: 'center' },
      { id: 'CODE_NAME', label: '코드명', minWidth: 100, align: 'center' },
      { id: 'UPPER_CODE', label: '상위코드', minWidth: 100, align: 'center' },
      { id: 'UPPER_NAME', label: '코드유형', minWidth: 100, align: 'center' },
    ];
    const columnsDown = [
      { id: 'CODE_ID', label: '코드ID', minWidth: 100, align: 'center' },
      { id: 'CODE_NAME', label: '코드명', minWidth: 100, align: 'center' },
      { id: 'UPPER_NAME', label: '코드유형', minWidth: 100, align: 'center' },
    ];
    // Width에 따라 반응형으로 열이 없어
    let columns = columnsUp;
    if (isWidthUp('md', props.width)) {
      columns = columnsUp;
    } else {
      columns = columnsDown;
    }

    const handleClickDetailView = (event, row) => {
      updateSelectedNodeId(row.CODE_ID);
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
              {rows.map((row, idx) => {
                return (
                  <TableRow hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code_id + "" + idx}
                    onClick={() => handleClickDetailView(event, row)} // react router의 상세
                  >
                    {columns.map(column => {
                      var value = row[column.id];
                      if (column.id === "upper_name") {
                        if (row["code_level"] === "1") {
                          value = "분류코드";
                        }
                      }
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