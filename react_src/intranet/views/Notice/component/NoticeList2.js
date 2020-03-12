import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles({
  root: {
    width: "100%",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  table: {
    padding: "5%",
    width: "80%"
  },
  align: {
    textAlign: "right"
  }

});

function createData(no, title, writer, reg_date, content) {
  const aria_con_str = "additional-actions"+no+"-content";
  const id_str = "additional-actions"+no+"-header";
  const no_str = "["+no+"]"
  return { no_str, title, writer, reg_date, content, aria_con_str, id_str};
}
const rows = [
  createData(1, '공지사항입니다.', '김준선', '2016-01-15', '안녕하세요 공지사항입니다. 감사합니다.'),
  createData(1, '공지사항입니다.', '김준선', '2016-01-15', '안녕하세요 공지사항입니다. 감사합니다.'),
  createData(1, '공지사항입니다.', '김준선', '2016-01-15', '안녕하세요 공지사항입니다. 감사합니다.'),
  createData(1, '공지사항입니다.', '김준선', '2016-01-15', '안녕하세요 공지사항입니다. 감사합니다.'),
  createData(1, '공지사항입니다.', '김준선', '2016-01-15', '안녕하세요 공지사항입니다. 감사합니다.'),
  createData(1, '공지사항입니다.', '김준선', '2016-01-15', '안녕하세요 공지사항입니다. 감사합니다.'),
  createData(1, '공지사항입니다.', '김준선', '2016-01-15', '안녕하세요 공지사항입니다. 감사합니다.'),
  createData(1, '공지사항입니다.', '김준선', '2016-01-15', '안녕하세요 공지사항입니다. 감사합니다.')
];



export default function NoticeList2() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {rows.map(row => (
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls={row.aria_con_str}
            id={row.id_str}
          >
            <FormControlLabel
              aria-label="Acknowledge"
              onClick={event => event.stopPropagation()}
              onFocus={event => event.stopPropagation()}
              control={<Checkbox />}
              label={
                  <div>
                    <span>{row.no_str}</span>
                    <span>{row.title}</span>
                    <span>{row.writer}</span>
                    <span className={classes.align}>{row.reg_date}</span>
                  </div>
              }
            />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography color="textSecondary">
              {row.content}
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
}