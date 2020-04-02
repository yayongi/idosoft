import React,{useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import '../css/ck_editor.sass';

const useStyles = makeStyles(theme => ({
  root: {
    width:'100%',
  },
}));

const Editor = ({defaultValue, onChildChange}) =>{

  const classes = useStyles();

  const [content, setContent] = useState('');

  useEffect(()=>{

  }, [defaultValue]);

  useEffect(()=>{
    onChildChange(content);
  }, [content])

  return (
          <div className={classes.root}>
            <CKEditor
                props
                editor={ ClassicEditor }
                data={defaultValue}
                onInit={ editor => {
                    console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    // console.log( { event, editor, data } );
                    if(data.length <= 21,845) setContent(data); //입력방지x / 입력된 데이터가 21845글자가 넘으면 상위컴포넌트 갱신 x
                } }
                onBlur={ ( event, editor ) => {
                    console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    console.log( 'Focus.', editor );
                } }
                config = {{
                  toolbar : ["heading", "|", "bold","italic","link","bulletedList","numberedList",
                  "|","indent","outdent","|","blockQuote","insertTable","mediaEmbed","undo","redo"]
                }}
                too
            />
        </div>
  );
}

export default Editor;