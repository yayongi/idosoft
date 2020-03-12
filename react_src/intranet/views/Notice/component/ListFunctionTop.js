import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";


const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(2)
  },
  absolute: {
	// position: "absolute",
	width: '40%',
    top: theme.spacing(2),
    right: theme.spacing(3)
  }
}));

export default function ListFunctionTop() {
  const classes = useStyles();

  return (
	<div className={classes.absolute}>
		<Tooltip title="Delete">
			<IconButton aria-label="delete" className={classes.fab}>
			<DeleteIcon />
			</IconButton>
		</Tooltip>
		<Tooltip title="Add" aria-label="add">
			<Fab color="primary">
			<AddIcon />
			</Fab>
		</Tooltip>
	</div>
  );
}
