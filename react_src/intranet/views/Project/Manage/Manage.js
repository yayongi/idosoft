import React, {Component, Fragment} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ProjectGraph from './component/ProjectGraph';
import ProjectContents from './component/ProjectContents';
import InputSearch from './component/InputSearch';
import SelectType from './component/SelectType';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';


class Manage extends Component {
	render() {
		return (
			<Fragment>
				<Card>
					<CardContent>
						프로젝트관리
						<ProjectGraph/>
					</CardContent>
				</Card>
				<br/>
				<Card>
					<CardContent>
						프로젝트관리 
						<Toolbar>
							<Button variant="contained" color="primary">
								프로젝트 등록
							</Button>
							<SelectType/>
                    		<InputSearch/>
						</Toolbar>
					</CardContent>
				</Card>
			</Fragment>
		);
	}
}

export default Manage;
