import React, {Component, useDebugValue} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

// import {
//   NavLink,
//   Route,
//   Redirect,
//   Switch
// } from 'react-router-dom';

import ResourceListTable from './ResourceListTable';

const ResourceList = ({match}) => {
	debugger;
	// const resData = `${match.params.regist}`;

	return (
		<Card>
			{/* {console.log(resData)} */}
			{/* { */}
				{/* // typeof(resData)===undefined? */}
				<ResourceListTable/>
				{/* :(<ResourceListTable props={resData}/>) */}
			{/* } */}
		</Card>
	);
}

export default ResourceList;
