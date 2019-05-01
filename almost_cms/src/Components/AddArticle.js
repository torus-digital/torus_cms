import React, { Component } from 'react';
import '../App.css';
import 'semantic-ui-css/semantic.min.css';
import createArticle from './CreateArticle';
import updateArticle from './UpdateArticle';
import publishArticle from './PublishArticle';
import { API, graphqlOperation } from "aws-amplify";
import articleList from '../GraphQL/QueryArticleList';
//import addArticle from '../GraphQL/QueryGetArticle';

//rich text editor
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

class AddArticle extends Component {
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
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleOpen = this.handleOpen.bind(this)
	}

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

	onEditorStateChange: Function = (editorState) => {
			this.setState({
				editorState,
			});
		};

	handleOpen(event) {
		console.log(this.state.item)

		var id = this.state.item
		for(let elem of this.state.list) {
			if(elem.id === id) {
				const sampleMarkup = elem.body_html;
				const blocksFromHTML = convertFromHTML(sampleMarkup);
				const state = ContentState.createFromBlockArray(
					blocksFromHTML.contentBlocks,
					blocksFromHTML.entityMap
				);
				console.log(elem.body_html)
				this.setState({
					title: elem.title,
					body_html: elem.body_html,
					body_txt: elem.body_txt,
					editorState: EditorState.createWithContent(state),
				});
				this.setState({
					itemProps: {
					title: elem.title,
					body_html: elem.body_html,
					}
				})	
				
			}
		}
		event.preventDefault() 
	}
  
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}
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
		console.log(itemProps);
		console.log(currentState);
		(async function(id, props, state){
			if (!txt_body) {
				alert('Error. Body cannot be empty');
			}
			else if (state.body_html === props.body_html && state.title === props.title) {
				alert('Error. Detected no changes...');
			}
			else {
				//const articleId = this.state.item
				if(!id) {
					let x = await createArticle(input).then(response => {
						return response;
					});
					return x;			
				}
				else {
					let y = await updateArticle(input, id).then(response =>{
						return response;
					});
					return y;
				}
			}
		})(articleId, itemProps, currentState).then( response => {
			switch(response) {
				case 'Error':
					console.log('Error. Something went wrong...');
					break;
				default:
					this.setState({
						response: true,
					})
			}
		});
		event.preventDefault()    
	}
	//handler for publish event
	async handleAlternate(event) {
		const section = 'articles'
		const articleVars = {
			sourceRoute: `public/${section}`,
			sourceObject: `${this.state.title}.html`,
			destRoute: `${section}`
		};
		await publishArticle(articleVars).then( response => {
			console.log(response);
			window.location.reload();
		})
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
						<select value={this.state.item} onChange={(e) => this.setState({item: e.target.value})}>>
							<option key={0} value=''>Select an option</option>
							{optionItems}
						</select>
						<input disabled={!this.state.item} type="submit" value="Open"></input>
					</form>
				</div>
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
							value={editorState}
							editorState={editorState}
							wrapperClassName="demo-wrapper"
							editorClassName="demo-editor"
							onEditorStateChange={this.onEditorStateChange}
						/>
						<input type="submit" value="Save" />
						<button disabled={!this.state.response} onClick={this.handleAlternate.bind(this)}>Publish</button>
					</form>
				</div>
			</div>
		)
	}
}  
export default AddArticle;