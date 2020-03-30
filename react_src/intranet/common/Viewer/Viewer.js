import React,{useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './css/ck_editor.sass';

const useStyles = makeStyles(theme => ({
  root: {
	width:'100%',
	border : '0px'
  },
}));

const Viewer = ({defaultValue}) =>{

  const classes = useStyles();
  const ref = React.useRef();
  useEffect(()=>{
    console.log(ref.current);
  },[])

  return (
          <div className={classes.root}>
            <CKEditor
                ref={ref}
				        disabled = {true}
				        isReadOnly={true}
                editor={ ClassicEditor }
                data={defaultValue}
                onInit={ editor => {
                    console.log( 'Editor is ready to use!', editor );
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