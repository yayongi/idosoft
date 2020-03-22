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
import { getProjMemberInfoDB, getMemberInfoDB } from '../../data';
import { getCodeInfoDB } from '../../../Admin/data';
function initData(location){
  console.log("initData");

  var urlSplitList = location.pathname.split("/");
  var currentLastPath = urlSplitList[urlSplitList.length - 1];


  var data = [];
  var query = location.search;
  if (query) {
    query.replace("?", "").split("&").map((param => {
      var kValue = param.split("=")[0];
      var vValue = decodeURIComponent(param.split("=")[1]);
      return data[kValue] = vValue;
    }));

    var projMemberList = [];
    var projectMember = getProjMemberInfoDB();
    if(projectMember.length > 0){
       projMemberList = projectMember.filter(member => {
        return member.project_no == data["project_no"];
      });
    }

    var makeProjectMem = getMemberInfoDB();
    for(var i=0; i < projMemberList.length; i++){
      var temp = projMemberList[i]["member_no"];

      var list = makeProjectMem.filter(member => {
        return member.member_id == temp;
      });
      if(list.length > 0){
        projMemberList[i]["member_name"] = list[0]["member_name"];
      }

      var temp2 = getCodeInfoDB();

      var code_list = temp2.filter(code => {
        return code.upper_code == "CD0009";
      });
      if(code_list.length > 0){
        var temp3 = code_list.filter(cl => {
          return cl.code_id == projMemberList[i]["role_code"];
        });
        if(temp3.length > 0){
          projMemberList[i]["role"] = temp3[0]["code_name"];
        }
      }

      projMemberList[i]["term"] = projMemberList[i]["inpt_bgnde"] + " ~ " + projMemberList[i]["inpt_endde"]; 
    }
  }

  console.log(projMemberList);

  return projMemberList;
}


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

function ProjectMemberTable(props) {
  const classes = useStyles();
  const { match, location, history } = props.routeProps;
	const [dataState, setDataState] = React.useState(initData(location));	// state : 수정을 위한 데이터 관리
  const rows = dataState;

  //연도, 프로젝트명, 기관,  프로젝트 기간, PM, 교통비
  const columnsUp = [
    { id: 'member_name', label: '이름', minWidth: 100, align: 'center' },
    { id: 'chrg_job', label: '담당업무', minWidth: 100, align: 'center' },
    { id: 'term', label: '프로젝트 기간', minWidth: 100, align: 'center' },
    { id: 'role', label: '역할', minWidth: 100, align: 'center' },
    { id: 'use_lang', label: '비고', minWidth: 100, align: 'center' },
  ];
  const columnsDown = [
    { id: 'member_name', label: '이름', minWidth: 100, align: 'center' },
    { id: 'term', label: '프로젝트 기간', minWidth: 100, align: 'center' },
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

    history.push(url + queryString);
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
              {rows.map((row, index) => {
                return (
                  <TableRow hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.project_no + "_" + index}
                    onClick={() => handleClickDetailView(event, row)} // react router의 상세
                  >
                    {columns.map((column, idx) => {
                      var value = row[column.id];
                      return (
                        <TableCell key={row.member_no + idx} align={column.align} className={column.className}>
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

export default withWidth()(ProjectMemberTable);