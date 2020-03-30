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
  const { historyInfo, memberlist } = props;

  const getRebuildInfo = () => {
    var histList = [];

    for(var i=0; i < memberlist.length; i++){
      var tmp = historyInfo.filter((info) => {
        return info.MEMBER_NO == memberlist[i]["member_no"];
      });

      if(tmp.length > 0){
        histList.push(tmp);
      }
    }

    return histList;
  }

  const rebuildInfo = getRebuildInfo();

  console.log("rebuildInfo : ");
  console.log(rebuildInfo);

  const columnsUp = [
    { id: 'MEMBER_NAME', label: '이름', minWidth: 100, align: 'center' },
    { id: 'PROJECT_NM', label: '프로젝트명', minWidth: 100, align: 'center' },
    { id: 'INSTT_NM', label: '기관', minWidth: 100, align: 'center' },
    { id: 'TERM', label: '프로젝트 기간', minWidth: 100, align: 'center' },
    { id: 'CHRG_JOB', label: '담당업무', minWidth: 100, align: 'center' },
    { id: 'USE_LANG', label: '비고(사용언어)', minWidth: 100, align: 'center' },
  ];
  const columnsDown = [
    { id: 'MEMBER_NAME', label: '이름', minWidth: 100, align: 'center' },
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
          {rebuildInfo.map((rows, idx) => (
              <TableBody>
                <TableRow
                  key={idx}>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{ minWidth: column.minWidth }}
                      className={column.className}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
                  {rows.map((info, rowIdx) => (
                    <TableRow
                      key={idx+"_"+rowIdx}>
                      <TableCell 
                        align="center"
                        key={"MEMBER_NAME_"+rowIdx}>
                          {info["MEMBER_NAME"]}
                      </TableCell>

                      <TableCell 
                        align="center"
                        key={"PROJECT_NM_"+rowIdx}>
                          {info["PROJECT_NM"]}
                      </TableCell>
                      { isWidthUp('md', props.width) && 
                        <TableCell 
                          align="center"
                          key={"INSTT_NM_"+rowIdx}>
                          {info["INSTT_NM"]}
                        </TableCell>
                      }

                      { isWidthUp('md', props.width) &&
                        <TableCell 
                          align="center"
                          key={"TERM_"+rowIdx}>
                          {info["INPT_BGNDE"] + "~" + info["INPT_ENDDE"]}
                        </TableCell>
                      }

                      { isWidthUp('md', props.width) &&
                        <TableCell 
                          align="center"
                          key={"CHRG_JOB_"+rowIdx}>
                          {info["CHRG_JOB"]}
                        </TableCell>
                      }

                      { isWidthUp('md', props.width) &&
                        <TableCell 
                          align="center"
                          key={"USE_LANG_"+rowIdx}>
                          {info["USE_LANG"]}
                        </TableCell>
                      }
                  </TableRow>
                ))}
              </TableBody>
          ))}
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default withWidth()(HistoryInfoTable);