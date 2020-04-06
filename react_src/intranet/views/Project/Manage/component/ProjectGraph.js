import React from 'react';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { makeStyles } from '@material-ui/core/styles';
import Moment from "moment";

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';




const useStyles = makeStyles({
  root: {
    width: '100%',
    textDecoration: 'none',
  },
  chart: {
  }
});

function makeGraph(projectGraphInfo, condition){
	var ProjectNo = new Set();
	for(var i=0; i < projectGraphInfo.length; i++){
		ProjectNo.add(projectGraphInfo[i]["PROJECT_NO"]);
	}
	
	if(!Object.keys(ProjectNo).length){
		var tmp = Array.from(ProjectNo);
		var list = [];
		for(var i=0; i < tmp.length; i++){
			var tmpList = projectGraphInfo.filter((info) => {
				return info["PROJECT_NO"] == tmp[i];
			});
			
			if(tmpList.length > 0){
				var tmpJson = {};
				tmpJson["name"] = tmpList[0]["PROJECT_NM"];
				tmpJson["count"] = tmpList.length;
				list.push(tmpJson);
			}
		}
		return list;
	}else{
		return [];
	}
}



function ProjectGraph(props) {
    const classes = useStyles();
    const { projectGraphInfo, routeProps, condition } = props;
    
    const makedGraphInfo = makeGraph(projectGraphInfo, condition);

    return (
		<BarChart width={730} height={250} data={makedGraphInfo}>
		  <CartesianGrid strokeDasharray="3 3" />
		  <XAxis dataKey="name" />
		  <YAxis />
		  <Tooltip />
		  <Legend />
		  <Bar dataKey="count" fill="#8884d8" />
		</BarChart>
    );
}


export default withWidth()(ProjectGraph);
