import React, { Component } from 'react';
import '../App.css';
import { addToStorage, copyToBucket } from './Shared.js';
import 'semantic-ui-css/semantic.min.css';

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
  }

  handleChange(title, ev) {
      this.setState({ [title]: ev.target.value });
	}

  async submit() {
		var { editorState } = this.state;
		//html page variables
		const title = this.state.title;
		const section = 'articles';
		const heading = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> <meta name="description" content=""> <meta name="author" content=""> <title>Almost CMS - ${section} - ${title}</title> <!-- Font Awesome Icons --> <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css"> <!-- Google Fonts --> <link href="https://fonts.googleapis.com/css?family=Merriweather+Sans:400,700" rel="stylesheet"> <link href="https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic" rel="stylesheet" type="text/css"> <!-- Plugin CSS --> <link href="../vendor/magnific-popup/magnific-popup.css" rel="stylesheet"> <link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"> <!-- Theme CSS - Includes Bootstrap --> <link href="../css/index.css" rel="stylesheet"> </head> <body id="page-top">`;
		const nav = `<nav class="navbar navbar-expand-lg fixed-top py-3" id="mainNav"> <div class="container"> <a class="navbar-brand js-scroll-trigger" href="../index.html">Almost CMS</a> <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navbarResponsive"> <ul class="navbar-nav ml-auto my-2 my-lg-0"> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../about.html">About</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="index.html">Articles</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../images/gallery/index.html">Gallery</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../contact.html">Contact</a> </li> </ul> </div> </div> </nav>`;
		const header = `<section class="page-heading bg-primary" id="about"> <div class="container"> <div class="row justify-content-center"> <div class="col-lg-8 text-center"> <h4 class="text-white mt-0">The latest on Almost CMS</h4> </div> </div> </div> </section>`;
		const footer = `<footer class="bg-light py-5"> <div class="container-fluid"> <div class="row small text-center text-muted"> <div class="col-md-6"> <div>Copyright &copy; 2019 - Almost CMS</div> </div> <div class="col-md-6"> <div> Powered By <a href="http://***REMOVED***">Almost CMS</a></div> </div> </div> </div> </footer>`;
		var body = draftToHtml(convertToRaw(editorState.getCurrentContent()));
		const fileObj = heading + nav + header + body + footer;
		const contentType = 'text/html';
		const Obj = {
			contentType: contentType,
			section: section,
			title: title,
			fileObj: fileObj,
		}
    const { onCreate } = this.props;
    var input = {
      title: this.state.title,
			body_html: draftToHtml(convertToRaw(editorState.getCurrentContent())),
			body_txt: this.state.editorState.getCurrentContent().getPlainText(),
		}
		console.log("input: ", input);
		let firstFunct = await onCreate({input});
		console.log(firstFunct);
		// Execute the Add article function
		let addArticle = await new addToStorage(Obj.contentType, Obj.section, Obj.title, Obj.fileObj); 
		switch(addArticle) {
			// If the add article function is succesful
			case 'Success':
				console.log("Succesfully added your new article to your private S3 storage bucket!");
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
						console.log("Succesfully copied the new article to your public bucket!");
						// execute the create index function
						let addIndex = await new createIndex();
						switch(addIndex) {
							// if the create index function is succesful
							case 'Success':
								console.log("Successfully created a new index for your articles and added it to your private S3 storage bucket!");
								// execute the copy index function
								const bucketVars = {
									sourceRoute: 'public/articles',
									sourceObject: 'index.html',
									destRoute: 'articles'
								};
								let copyIndex = copyToBucket(bucketVars);
								console.log("index copy receipt: ", copyIndex);
								console.log( "Congratulations! Succesfully created your new Article!" );
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
	}			
  
  render(){
    const { editorState } = this.state;
    return (
        <div>
          <div className="container">
						<h1>Post a comment</h1>
						<input
									name="title"
									placeholder="title"
									onChange={(ev) => { this.handleChange('title', ev)}}
						/>
						<Editor
							editorState={editorState}
							wrapperClassName="demo-wrapper"
							editorClassName="demo-editor"
							onEditorStateChange={this.onEditorStateChange}
						/>
					<button onClick={this.submit.bind(this)}>
            Add Article
          </button>
        	</div>
				</div>
    );
  }
}

export default AddArticle;