import React from 'react';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { makeStyles } from '@material-ui/core/styles';
import Moment from "moment";

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';



const makeGraph = (projectInfo) => {
  var data = [];
  console.log(projectInfo);
  var today = Moment(new Date()).format('YYYYMMDD');
  var tempInfoList = projectInfo.filter(info => {
    return (info.bgnde == today || info.bgnde < today) && (info.endde == today || info.endde > today);
  });
  console.log("---------------");
  console.log(tempInfoList);
  console.log("---------------");

  for(var i=0; i < tempInfoList.length; i++){
    data.push({
      name: tempInfoList[i]["project_nm"],
      num : 5
    })
  }
  return data;
};

const useStyles = makeStyles({
  root: {
    width: '100%',
    textDecoration: 'none',
  },
  chart: {
  }
});

function ProjectGraph(props) {
    const classes = useStyles();
    const { projectInfo, routeProps } = props;

    if (isWidthUp('md', props.width)) {
      console.log("big size");
    } else {
      console.log("small size");
    }
    return (
      <BarChart
        className={classes.chart}
        width={500}
        height={300}
        data={makeGraph(projectInfo)}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="num" fill="#8884d8" />
      </BarChart>
    );
}


export default withWidth()(ProjectGraph);
