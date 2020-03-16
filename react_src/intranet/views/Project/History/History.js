import React, {Component, Fragment} from 'react';
import Card from '@material-ui/core/Card';
import InputSearch from './component/InputSearch';
import SelectType from './component/SelectType';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

class History extends Component {
	render() {
		return (
			<Fragment>
				<Card>
					<CardContent>
						이력관리
					</CardContent>
				</Card>
				<br/>
				<Card>
					<CardContent>
						이력관리 
						<Toolbar>
							<Button variant="contained" color="primary">
								이력 등록
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

export default History;
