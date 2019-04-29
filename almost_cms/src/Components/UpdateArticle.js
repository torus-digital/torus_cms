import { addToStorage } from './Shared.js';
import 'semantic-ui-css/semantic.min.css';
import { API, graphqlOperation } from "aws-amplify";
import UpdateArticle from '../GraphQL/MutationUpdateArticle.js';
//import the createIndexFunction
import createIndex from './CreateArticleIndex';
import publishArticle from './PublishArticle.js';		
		
export default async function updateArticle(input, item) {
	//TEMPLATE
	const section = 'articles';
	const before_body = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> <meta name="description" content=""> <meta name="author" content=""> <title>Almost CMS - ${section} - ${input.title}</title> <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous"> <link href='https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic' rel='stylesheet' type='text/css'> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> <link href="../css/index.css" rel="stylesheet"> </head> <body id="page-top"> <nav class="navbar navbar-expand-lg fixed-top py-3" id="mainNav"> <div class="container"> <a class="navbar-brand js-scroll-trigger" href="../index.html"> <img src="../img/almost-logo.svg" height="60" width="auto"> </a> <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"> <span class="fa fa-lg fa-bars text-primary"></span> </button> <div class="collapse navbar-collapse" id="navbarResponsive"> <ul class="navbar-nav ml-auto my-2 my-lg-0"> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../about.html">About</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="#">Articles</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../gallery/index.html">Gallery</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../contact.html">Contact</a> </li> </ul> </div> </div> </nav> <div class="body"> <section class="page-heading bg-primary" id="about"> <div class="container"> <div class="row justify-content-center"> </div> </div> </section> <section class=""> <div class="container p-4 p-lg-5"> <div class="text-center"> <h1 class=""> ${input.title} </h1> <p class="text-muted pb-4"> Published on: </p> </div>`;
	const after_body = `</section> </div> <footer class="bg-light py-5"> <div class="container-fluid"> <div class="row small text-center text-muted"> <div class="col-md-6"> <div>Copyright &copy; 2019 - Almost CMS</div> </div> <div class="col-md-6"> <div> Powered By <a href="https://github.com/gkpty/almost_cms">Almost CMS</a></div> </div> </div> </div> </footer> <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script> <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o" crossorigin="anonymous"></script> <script src="../js/index.js"></script> </body> </html>`;	
	const contentType = 'text/html';
	const fileObj = before_body + input.body_html + after_body;
	const Obj = {
		contentType: contentType,
		section: section,
		title: input.title,
		fileObj: fileObj,
    }
    console.log(input)
    const putInput = {
        id: item,
        title: input.title,
        body_html: input.body_html,
        body_txt: input.body_txt,
    }
    console.log(putInput)
	var putToDB = await API.graphql(graphqlOperation(UpdateArticle, putInput))
	.then (result => {
		console.log(`Successfully added the item ${result.data.updateArticle.title} to the Pictures table. reference:`, result.data.updateArticle.id)
		return 'Success'
	})
	.catch(err => {
		console.log('error: ', err)
		return err
	});
	switch(putToDB) {
		case 'Success':
			// Execute the Add article function
			let addArticle = await new addToStorage(Obj.contentType, Obj.section, Obj.title, Obj.fileObj, 'html'); 
			switch(addArticle) {
				// If the add article function is succesful
                case 'Success':
                    // execute the create index function
                    let addIndex = await new createIndex();
                    switch(addIndex) {
                        // if the create index function is succesful
                        case 'Success':
                            const articleVars = {
                                sourceRoute: `public/${section}`,
                                sourceObject: `${input.title}.html`,
                                destRoute: `${section}`
                            };
                            // execute the copy article function.
                            publishArticle(articleVars);
							break;
						default:
							console.log("Error: Failed to save the new articles index");
					}
						break;
					default:
						console.log("Error: Failed to save your Article in your S3 storage bucket.")
					}
					break;
				default:
					console.log('Error. Failed to add your item to the database.', putToDB)
		}
	
}		
		
		
		