import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {Editor} from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'codemirror/lib/codemirror.css';

import colorSyntax from '@toast-ui/editor-plugin-color-syntax'

const useStyles = makeStyles(theme => ({
  root: {
	width:'100%',
  },
}));

const ToastEditor = ({defaultValue, onEditorChange, setData}) => {
	const classes = useStyles();
	
	const [value, setValue] = React.useState('');

	const editorRef = React.useRef();

	const handleOnChange = () => {
		console.log(editorRef.current.getInstance());

		//
		setValue(editorRef.current.getInstance().wwEditor.editor.body.innerHTML);
		onEditorChange(editorRef.current.getInstance().wwEditor.editor.body.innerHTML);
	}

	React.useEffect(()=>{
		setValue(defaultValue);
		// editorRef.current.getInstance().wwEditor.editor.body.setHTML(defaultValue);
		// document.getElementsByClassName('tui-editor-contents').write(defaultValue);
	}, [defaultValue]);

	React.useEffect(()=>{
		console.log(value);
	}, [value]);

	return (
		<div className={classes.root}>
			<Editor
				// onBeforeInput
				datatype="wysiwyg"
				setValue={defaultValue}
				initialEditType="wysiwyg"
				initialValue={defaultValue}
				previewStyle="vertical"
				height="600px"
				useCommandShortcut={true}
				hideModeSwitch={true}
				ref={editorRef}
				plugins = {[
					colorSyntax,
				]}
				onChange={handleOnChange}
				toolbarItems={
					["heading", "bold", "italic","strike","divider","hr","quote"
					,"divider","ul", "ol", "task", "indent", "outdent", "divider"
					, "table", "link"]
				}
				// exts={[
				// {
				// 	name: 'chart',
				// 	minWidth: 100,
				// 	maxWidth: 600,
				// 	minHeight: 100,
				// 	maxHeight: 300
				// }]}
				// 'scrollSync',
				// 'colorSyntax',
				// 'uml',
				// 'mark',
				// 'table'
				// ]}
			/>
		</div>
		);
}
export default ToastEditor;