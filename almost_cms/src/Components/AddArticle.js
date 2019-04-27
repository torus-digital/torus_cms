import React, { Component } from 'react';
import '../App.css';
import { addToStorage, copyToBucket } from './Shared.js';
import 'semantic-ui-css/semantic.min.css';

import { API, graphqlOperation } from "aws-amplify";
import CreateArticle from '../GraphQL/MutationCreateArticle.js';

//rich text editor
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
//import htmlToDraft from 'html-to-draftjs';

//import the createIndexFunction
import createIndex from './CreateArticleIndex'

class AddArticle extends Component {
    state = {
    editorState: EditorState.createEmpty(),
  }

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
        title: '',
				body_html: '',
				body_txt: '',
		};
		this.handleChange = this.handleChange.bind(this);
  }

  handleChange( ev ) {
      this.setState({ [ev.target.name]: ev.target.value });
	}

  async submit() {
		var { editorState } = this.state;
		//html page variables
		const title = this.state.title;
		const section = 'articles';
		const before_body = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> <meta name="description" content=""> <meta name="author" content=""> <title>Almost CMS - ${section} - ${title}</title> <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous"> <link href='https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic' rel='stylesheet' type='text/css'> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> <link href="../css/index.css" rel="stylesheet"> </head> <body id="page-top"> <nav class="navbar navbar-expand-lg fixed-top py-3" id="mainNav"> <div class="container"> <a class="navbar-brand js-scroll-trigger" href="../index.html"> <img src="../img/almost-logo.svg" height="60" width="auto"> </a> <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"> <span class="fa fa-lg fa-bars text-primary"></span> </button> <div class="collapse navbar-collapse" id="navbarResponsive"> <ul class="navbar-nav ml-auto my-2 my-lg-0"> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../about.html">About</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="#">Articles</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../gallery/index.html">Gallery</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../contact.html">Contact</a> </li> </ul> </div> </div> </nav> <div class="body"> <section class="page-heading bg-primary" id="about"> <div class="container"> <div class="row justify-content-center"> </div> </div> </section> <section class=""> <div class="container p-4 p-lg-5"> <div class="text-center"> <h1 class=""> ${title} </h1> <p class="text-muted pb-4"> Published on: </p> </div>`;
		const after_body = `</section> </div> <footer class="bg-light py-5"> <div class="container-fluid"> <div class="row small text-center text-muted"> <div class="col-md-6"> <div>Copyright &copy; 2019 - Almost CMS</div> </div> <div class="col-md-6"> <div> Powered By <a href="https://github.com/gkpty/almost_cms">Almost CMS</a></div> </div> </div> </div> </footer> <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script> <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o" crossorigin="anonymous"></script> <script src="../js/index.js"></script> </body> </html>`;
		var html_body = editorState ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : null;
		var txt_body = editorState ? this.state.editorState.getCurrentContent().getPlainText() : null;

		const fileObj = before_body + html_body + after_body;
		const contentType = 'text/html';
		const Obj = {
			contentType: contentType,
			section: section,
			title: title,
			fileObj: fileObj,
		}

		var input = {
			title: this.state.title,
			body_html: html_body,
			body_txt: txt_body,
		}
		//console.log(input)
		var addToDB = await API.graphql(graphqlOperation(CreateArticle, input))
		.then (result => {
			console.log('Succes', result)
			return 'Success'
		})
		.catch(err => {
			console.log('error: ', err)
			return err
		});
		console.log(addToDB)
		switch(addToDB) {
			case 'Success':
				// Execute the Add article function
				let addArticle = await new addToStorage(Obj.contentType, Obj.section, Obj.title, Obj.fileObj, 'html'); 
				switch(addArticle) {
					// If the add article function is succesful
					case 'Success':
						const bucketVars = {
							sourceRoute: `public/${section}`,
							sourceObject: `${title}.html`,
							destRoute: `${section}`
						};
						// execute the copy article function.
						let copyArticle = await new copyToBucket(bucketVars);
						switch(copyArticle) {
							// If the copy article function is succesful
							case 'Success':
								console.log(`Succesfully copied ${bucketVars.sourceObject} to ${bucketVars.destRoute}`);
								// execute the create index function
								let addIndex = await new createIndex();
								switch(addIndex) {
									// if the create index function is succesful
									case 'Success':
										// execute the copy index function
										const bucketVars = {
											sourceRoute: 'public/articles',
											sourceObject: 'index.html',
											destRoute: 'articles'
										};
										let copyIndex = await new copyToBucket(bucketVars);
										switch(copyIndex) {
											case 'Success':
												console.log( "Congratulations! You have succesfully published your new Article!" );
												break;
											default:
												console.log("Error: Failed to copy your index")
										}
										break;
									default:
										console.log("Error: Failed to save the new articles index");
								}
								break;
							default:
								console.log(copyArticle)
								console.log("Error: Failed to copy your article to your public bucket.");
						}
							break;
						default:
							console.log("Error: Failed to add your Article to your private S3 storage bucket.")
						}
						break;
					default:
						console.log('Error. Something went wrong. please try again later.')
			}
	}			
  
  render(){
		const { editorState } = this.state;
		var html_body = editorState ? this.state.editorState.getCurrentContent().getPlainText() : null;
    return (
        <div>
          <div className="container">
						<h1>Post a comment</h1>
						<input
									name="title"
									placeholder="title"
									required="required"
									onChange={this.handleChange}
						/>
						<Editor
							editorState={editorState}
							wrapperClassName="demo-wrapper"
							editorClassName="demo-editor"
							onEditorStateChange={this.onEditorStateChange}
						/>
						<button disabled={ !(html_body && this.state.title) } onClick={this.submit.bind(this)}>
							Add Article
						</button>
        	</div>
				</div>
    );
  }
}

export default AddArticle;