import React,{ useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,ResponsiveContainer } from 'recharts';


function ProjectGraph(props) {
	const theme = useTheme();
	
    const { projectGraphInfo, routeProps, condition } = props;
    const makeGraph = (projectGraphInfo) => {
    	if(typeof(projectGraphInfo) == "object" && projectGraphInfo.length > 0){
    		var tmp = new Set();
    		for(var i=0; i < projectGraphInfo.length; i++){
    			tmp.add(projectGraphInfo[i]["PROJECT_NO"]);
    		}
    		
    		var resultList = [];
    		tmp = Array.from(tmp);
    		for(var j=0; j < tmp.length; j++){
    			var result = {};
    			var tmpA = projectGraphInfo.filter((info) => info.PROJECT_NO == tmp[j]);
    			if(typeof(tmpA) == "object" && tmpA.length > 0){
    				result["PROJECT_NM"] = tmpA[0]["PROJECT_NM"];
    			}
    			result["memberCount"] = tmpA.length;
    			resultList.push(result);
    		}
    		
    		return resultList;
    		
    	}else{
    		return;
    	}
    }
    const data = makeGraph(projectGraphInfo);
    	  /*{
    	    "PROJECT_NM": "Page A",
    	    "memberCount": 3
    	  },
    	  {
    	    "PROJECT_NM": "Page B",
    	    "memberCount": 2,
    	  },
    	  {
    	    "PROJECT_NM": "Page C",
    	    "memberCount": 1
    	  },
    	  {
    	    "PROJECT_NM": "Page D",
    	    "memberCount": 4,
    	  },
    	  {
    	    "PROJECT_NM": "Page E",
    	    "memberCount": 8,
    	  },
    	  {
    	    "PROJECT_NM": "Page F",
    	    "memberCount": 5
    	  },
    	  {
    	    "PROJECT_NM": "Page G",
    	    "memberCount": 2
    	  }*/
    	  

    return (
		<>
	    	{	(typeof(projectGraphInfo) == "object" && projectGraphInfo.length > 0) &&  
				<React.Fragment>
					<ResponsiveContainer>
						<BarChart  data={data}>
							<XAxis dataKey="PROJECT_NM" stroke="#8884d8" tick={{ fontSize: '10px', width: '50px', wordWrap: 'break-word' }}/>
							<YAxis interval={1}/>
							<Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
							
							<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
							<Bar dataKey="memberCount" name="인원" fill="#8884d8" barSize={30} />
						</BarChart>
					</ResponsiveContainer>
				</React.Fragment>
	    	}
	    </>
    );
}


export default ProjectGraph;
