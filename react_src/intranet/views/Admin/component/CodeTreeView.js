import React, {useState, useReducer, useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = withStyles(theme => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
  },
}))(props => <TreeItem {...props} TransitionComponent={TransitionComponent} />);

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

/*
    재귀함수로 렌더링할 트리구조 구성
  */
function nestedRendered(item) {
  if(item.subTrees) {
    return  (
      <StyledTreeItem key={item.CODE_ID} nodeId={item.CODE_ID} label={item.CODE_NAME}>
        {
          item.subTrees.map((item) => (nestedRendered(item)))
        }
      </StyledTreeItem>
    )
  } else {
    return (
      <StyledTreeItem key={item.CODE_ID} nodeId={item.CODE_ID} label={item.CODE_NAME} />
    )
  }
}

//selected node id List
function getSelectedNodeId(codeInfo, codeOriginInfo){
  if(!codeInfo || !codeOriginInfo){
    return [];
  }

  if(codeInfo.length == codeOriginInfo.length){
    return [];
  }

  var selectedList = [];
  for(var i=0; i < codeInfo.length; i++){
    selectedList.push(codeInfo[i]["CODE_ID"]);
  }
  return selectedList;
}


//expanded node id list
function getExpandedNodeId(codeInfo, codeOriginInfo){
  var expandedNodeIdList = [""];
  if(!codeInfo || !codeOriginInfo){
    return expandedNodeIdList;
  }

  if(codeInfo.length == codeOriginInfo.length){
    return expandedNodeIdList;
  }

  for(let i=0; i<codeInfo.length; i++) {
    const codeInfoRow= codeInfo[i];
    //expandedNodeIdList.push(codeInfoRow.CODE_ID);
    if(codeInfoRow.CODE_LEVEL == "1"){
      continue;
    }else{
      getUpperCodeList(codeInfoRow, codeOriginInfo, expandedNodeIdList);  // 상위코드 정보 추가
    }

  }

  return expandedNodeIdList;
} 

/*
  상위 코드 조회
*/
function getUpperCodeList(codeIdRow, originInfo, expandedNodeIdList) {
  if(expandedNodeIdList.findIndex((item, index) => item == codeIdRow.UPPER_CODE) == -1){
    expandedNodeIdList.push(codeIdRow.UPPER_CODE);
    if(codeIdRow.CODE_LEVEL != "1"){
      for(var i=0; i < originInfo.length; i++){
        if(codeIdRow.UPPER_CODE == originInfo[i]["CODE_ID"]){
          getUpperCodeList(originInfo[i], originInfo, expandedNodeIdList);
        }
      }
    }
  }
}

export default function CodeTreeView(props) {
  const classes = useStyles();
  const {codeOriginInfo, codeInfo, rebuildSortedData, updateSelectedNodeId} = props;
  const [selectedNodeId, setSelected] = useState([]);
  const [expandedNodeId, setExpanded] = useState([]);
  console.log("codeTreeView codeInfo : ");
  console.log(codeInfo);

  console.log("codeTreeView expandedNodeId : ");
  console.log(expandedNodeId);

  useEffect(() => {
    setSelected(getSelectedNodeId(codeInfo, codeOriginInfo));
    setExpanded(getExpandedNodeId(codeInfo, codeOriginInfo));
  }, ["", codeInfo])

  const handleNodeSelect = (event, nodeid) => {
    setSelected(nodeid);
    updateSelectedNodeId(nodeid);
  }

  const handleNodeToggle = (event, nodeid) => {
    setExpanded(nodeid);
  }


  return (
    <TreeView
        className={classes.root}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        selected={selectedNodeId}
        expanded={expandedNodeId}
        onNodeToggle={(event, nodeid) => (handleNodeToggle(event, nodeid))}
        onNodeSelect={(event, nodeid) => (handleNodeSelect(event, nodeid))}
      >
        {
          rebuildSortedData && rebuildSortedData.map((item) => (nestedRendered(item)))
        }
    </TreeView>
  )
}