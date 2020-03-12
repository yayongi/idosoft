import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import { textAlign } from "@material-ui/system";


const useStyles = makeStyles(theme => ({
  root: {
	  position: "absolute",
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
	  color: "black",
	  textAlign: "left"
    // fontSize: "30px"
  },
  appbarSet: {
	  width: "100%",
    backgroundColor: "white"
  }
}));

export default function NoticeTop() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appbarSet}>
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            공지사항
          </Typography>
          <Tooltip title="Delete">
            <IconButton aria-label="delete" className={classes.fab}>
              <Fab color="secondary">
                <DeleteIcon />
              </Fab>
            </IconButton>
          </Tooltip>
          <Tooltip title="Add" aria-label="add">
            <Fab color="primary">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  );
}