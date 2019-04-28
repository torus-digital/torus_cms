import React, { Component } from 'react';
import '../App.css';
import 'semantic-ui-css/semantic.min.css';
import createArticle from './CreateArticle';
import { API, graphqlOperation } from "aws-amplify";
import gql from '../GraphQL/QueryListArticles';

//rich text editor
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
//import htmlToDraft from 'html-to-draftjs';

function submitArticle(txt_body, input) {
	if (!txt_body) {
		alert('Error. Body cannot be empty');
	}
	else {
		createArticle(input);
	}
}

class AddArticle extends Component {
	constructor(props) {
		super(props)
		this.state = { 
			title: '',
			body_html: '',
			body_txt: '',
			list: [],
		};
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount() {
    let initialList = [];
    API.graphql(graphqlOperation(gql))
        .then(result => {
            return result.data.listArticles.items;
        }).then(data => {
        initialList = data.map((article) => {
            return article
        });
        console.log(initialList);
        this.setState({
            list: initialList,
        });
    });
	}


	state = {
    editorState: EditorState.createEmpty(),
  }
  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
	};
  
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}
	handleSubmit(event) {
		var { editorState } = this.state;
		var html_body = editorState ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : null;
		var txt_body = editorState ? this.state.editorState.getCurrentContent().getPlainText() : null;
		var input = {
			title: this.state.title,
			body_html: html_body,
			body_txt: txt_body,
		};
		submitArticle(txt_body, input)
		event.preventDefault()    
	}
	
	render() {
		let list = this.state.list;
		console.log(list)
		let optionItems = list.map((article, i) =>
			<option key={i} value={article.id}>{article.title}</option>
		);
		const { editorState } = this.state;
		return (
			<div>
				<select>
					{optionItems}
				</select>
				<div className="container">
					<h1>Post a comment</h1>
					<form onSubmit={this.handleSubmit}>
						<input
							type="text"
							name="title"
							placeholder="title"
							required="required"
							value={this.state.title}
							onChange={this.handleChange}
						/>
						<Editor
							editorState={editorState}
							wrapperClassName="demo-wrapper"
							editorClassName="demo-editor"
							onEditorStateChange={this.onEditorStateChange}
						/>
						<input type="submit" value="Submit" />
					</form>
				</div>
			</div>
		)
	}
}  
export default AddArticle;