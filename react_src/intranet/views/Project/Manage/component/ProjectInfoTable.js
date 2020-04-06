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


const useStyles = makeStyles({
  root: {
    width: '100%',
    textDecoration: 'none',
  },
});

function ProjectInfo(props) {
  const classes = useStyles();
  const { projectInfo, routeProps } = props;
  
  

  const makeTableFormInfo = () => {
    var result = [].concat(projectInfo);
    for(var i=0; i < result.length; i++){
      result[i]["YEAR"] = result[i]["BGNDE"].slice(0,4);
      //result[i]["TERM"] = result[i]["BGNDE"] + " ~ " + result[i]["ENDDE"];
    }
    return result;
  }

  const rows = makeTableFormInfo();


  //연도, 프로젝트명, 기관,  프로젝트 기간, PM, 교통비
  const columnsUp = [
    { id: 'YEAR', label: '연도', minWidth: 100, align: 'center' },
    { id: 'PROJECT_NM', label: '프로젝트명', minWidth: 100, align: 'center' },
    { id: 'INSTT_NAME', label: '기관', minWidth: 100, align: 'center' },
    { id: 'TERM', label: '프로젝트 기간', minWidth: 100, align: 'center' },
    { id: 'PM_NAME', label: 'PM', minWidth: 100, align: 'center' },
    { id: 'TRANSPORT_CT', label: '교통비', minWidth: 100, align: 'center' },
  ];
  const columnsDown = [
    { id: 'YEAR', label: '연도', minWidth: 100, align: 'center' },
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
    routeProps.history.push(`${routeProps.match.url}/view/${row.PROJECT_NO}`);
  };
  
  const handleChangePage = ()=> {
	  
  }
  
  const handleChangeRowsPerPage = () => {
	  
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
          	{projectInfo.length == 0 &&
  				<>
   				  	 <TableRow>
   					    <TableCell
   				            align="left"
   			            	colSpan="6">
   					    	현재 등록된 프로젝트가 없습니다.
   				    	</TableCell>
   				    </TableRow>
   		  		</>
          	}
            {rows.length > 0 && rows.map(row => {
              return (
                <TableRow hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.PROJECT_NO}
                  onClick={() => handleClickDetailView(event, row)} // react router의 상세
                >
                  {columns.map((column, idx) => {
                    var value = row[column.id];
                    if(column.id === "TRANSPORT_CT"){
                      value = row["TRANSPORT_CT"].toLocaleString();
                    }else if(column.id === "YEAR"){
                      value = value  +"년"
                    }
                    return (
                      <TableCell key={row.PROJECT_NO + idx} align={column.align} className={column.className}>
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