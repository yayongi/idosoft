import React,{useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './css/ck_editor.sass';

const useStyles = makeStyles(theme => ({
  root: {
    width:'100%',
  },
}));

const Viewer = ({defaultValue}) =>{

  const classes = useStyles();
  const ref = React.useRef();
  useEffect(()=>{
  },[])

  return (
          <div className={classes.root}>
            <CKEditor
                className="viewer"
                ref={ref}
				        disabled = {true}
				        isReadOnly={true}
                editor={ ClassicEditor }
                data={defaultValue}
                onInit={ editor => {
                } }
                config = {{
				          toolbar : [],
                  isReadOnly : true,
                }}
            />
        </div>
  );
}
export default Viewer;