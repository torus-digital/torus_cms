import React, { Component } from 'react';
import '../App.css';
import 'semantic-ui-css/semantic.min.css';
import createArticle from './CreateArticle';
import updateArticle from './UpdateArticle';
import deleteArticle from './DeleteArticle';
import publishArticle from './PublishArticle';
import { API, graphqlOperation } from "aws-amplify";
import articleList from '../GraphQL/QueryArticleList';
//import addArticle from '../GraphQL/QueryGetArticle';

//rich text editor
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

class AddArticle extends Component {
	//initialize state variables
	state = {
    	editorState: EditorState.createEmpty(),
  	}
	constructor(props) {
		super(props)
		this.state = { 
			title: '',
			body_html: '',
			body_txt: '',
			list: [],
			item: '',
			itemProps: {},
			response: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	//initialize select list with the results from the query
	componentDidMount() {
    let initialList = [];
    API.graphql(graphqlOperation(articleList))
        .then(result => {
            return result.data.listArticles.items;
        }).then(data => {
        initialList = data.map((article) => {
            return article
        });
        this.setState({
            list: initialList,
        });
    });
	}

	//set state var of the editor on change
	onEditorStateChange: Function = (editorState) => {
			this.setState({
				editorState,
			});
		};
		
	//set state vars of other form fields on change
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}

	//handler for openning items
	handleOpen(event) {
		console.log('item Id: ', this.state.item)
		var id = this.state.item
		for(let elem of this.state.list) {
			if(elem.id === id) {
				const sampleMarkup = elem.body_html;
				const blocksFromHTML = convertFromHTML(sampleMarkup);
				const state = ContentState.createFromBlockArray(
					blocksFromHTML.contentBlocks,
					blocksFromHTML.entityMap
				);
				this.setState({
					title: elem.title,
					body_html: elem.body_html,
					body_txt: elem.body_txt,
					editorState: EditorState.createWithContent(state),
					itemProps: {
					title: elem.title,
					body_html: elem.body_html,
					}
				});	
				
			}
		}
		event.preventDefault() 
	}

	//handler for submitting items
	handleSubmit(event) {
		var { editorState } = this.state;
		var html_body = editorState ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : null;
		var txt_body = editorState ? this.state.editorState.getCurrentContent().getPlainText() : null;
		var articleId = this.state.item;
		var input = {
			title: this.state.title,
			body_html: html_body,
			body_txt: txt_body,
		};
		var itemProps = this.state.itemProps;
		var currentState = {
			title: this.state.title,
			body_html: editorState ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : null,
		};
		(async function (id, props, state){
			if (!txt_body) {
				alert('Error. Body cannot be empty');
			}
			else if (state.body_html === props.body_html && state.title === props.title) {
				alert('Error. No changes detected');
			}
			else {
				//const articleId = this.state.item
				if(!id) {
					let x = await createArticle(input).then(response => {
						return 'Success';
					});
					return x;			
				}
				else {
					let y = await updateArticle(input, id).then(response =>{
						return 'Success';
					});
					return y;
				}
			}
		})(articleId, itemProps, currentState).then( response => {
			switch(response) {
				case 'Success':
					this.setState({
						response: true,
						body_html: html_body,
						itemProps: {
							title: this.state.title,
							body_html: html_body,
						}
					});
					break;
				default:
					//Do Nothing
			}
		});
		event.preventDefault()    
	}

	//handler for publishing items
	handleAlternate(event) {
		var { editorState } = this.state;
		var html_body = editorState ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : null;
		const section = 'articles'
		const articleVars = {
			sourceRoute: `public/${section}`,
			sourceObject: `${this.state.title}.html`,
			destRoute: `${section}`,
			delete: false,
		};
		//console.log(this.state.itemProps)	
		if (this.state.title === this.state.itemProps.title && this.state.itemProps.body_html ===  html_body) {
			publishArticle(articleVars);
		}
		else {
			alert('Error. Please Save your changes before publishing')
		}
		event.preventDefault();
	}

	//handler for publish event
	handleDelete(event) {
		var fileName = `${this.state.title}.html`;
		//console.log(this.state.itemProps)
		alert('you are permanently deleting this item')	
		deleteArticle('articles', fileName, this.state.item);
		event.preventDefault();
	}

	render() {
		let list = this.state.list;
		let optionItems = list.map((article, i) =>
			<option key={i+1} value={article.id}>{article.title}</option>
		);
		const { editorState } = this.state;
		return (
			<div>
				<div className="container">
					<h1>Open an Article</h1>
					<form onSubmit={this.handleOpen}>
						<select value={this.state.item} onChange={(e) => this.setState({item: e.target.value})}>
							<option key={0} value=''>Select an option</option>
							{optionItems}
						</select>
						<input disabled={!this.state.item} type="submit" value="Open"></input>
					</form>
				</div>
				<div className="container">
					<h1>Post a comment</h1>
					<form onSubmit={this.handleSubmit.bind(this)}>
						<input
							type="text"
							name="title"
							placeholder="title"
							required="required"
							value={this.state.title}
							onChange={this.handleChange}
						/>
						<Editor
							value={editorState}
							editorState={editorState}
							wrapperClassName="demo-wrapper"
							editorClassName="demo-editor"
							onEditorStateChange={this.onEditorStateChange}
						/>
						<input type="submit" value="Save" />
						<button disabled={!this.state.response} onClick={this.handleAlternate.bind(this)}>Publish</button>
						<button disabled={!this.state.item || !this.state.itemProps.title || !this.state.itemProps.body_html} onClick={this.handleDelete.bind(this)}>Delete</button>
					</form>
				</div>
			</div>
		)
	}
}  
export default AddArticle;