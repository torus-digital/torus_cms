import { API, graphqlOperation } from "aws-amplify";
import gql from '../GraphQL/QueryListPictures';
import { addToStorage } from './Shared.js';

export default function createGallery(){
	let query = API.graphql(graphqlOperation(gql))
	.then (result => {
		console.log('result: ', result);
		const pictures = result.data.listPictures.items;
		console.log(pictures);
		const title = 'gallery';
		const section = 'gallery';
		const heading = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> <meta name="description" content=""> <meta name="author" content=""> <title> Almost CMS - ${section} - ${title} </title> <!-- Font Awesome Icons --> <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css"> <link href="https://fonts.googleapis.com/css?family=Merriweather+Sans:400,700" rel="stylesheet"> <link href="https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic" rel="stylesheet" type="text/css"> <link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"> <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css" /> <link href="../css/gallery.css" rel="stylesheet"> <link href="../css/index.css" rel="stylesheet"> </head> <body id="page-top">`;
		const nav = `<nav class="navbar navbar-expand-lg fixed-top py-3" id="mainNav"> <div class="container"> <a class="navbar-brand js-scroll-trigger" href="../index.html">Almost CMS</a> <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navbarResponsive"> <ul class="navbar-nav ml-auto my-2 my-lg-0"> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../about.html">About</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="index.html">Articles</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../images/gallery/index.html">Gallery</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../contact.html">Contact</a> </li> </ul> </div> </div> </nav> <div class="body">`;
		const header = `<section class="page-heading bg-primary" id="about"> <div class="container"> <div class="row justify-content-center"> <div class="col-lg-8 text-center"> <h4 class="text-white mt-0">The latest on Almost CMS</h4> </div> </div> </div> </section>`;
		const pregallery = `<section id="portfolio"> <div class="container-fluid p-0"> <div class="row no-gutters popup-gallery">`
		const postgallery = `</div> </div> </section>`
		const footer = `</div> <footer class="bg-light py-5"> <div class="container-fluid"> <div class="row small text-center text-muted"> <div class="col-md-6"> <div>Copyright &copy; 2019 - Almost CMS</div> </div> <div class="col-md-6"> <div> Powered By <a href="http://***REMOVED***">Almost CMS</a></div> </div> </div> </div> </footer>`;
		const scripts = `<script src="../vendor/jquery/jquery.min.js"></script> <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script> <script src="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js"> </script> <script src="../js/gallery.js"></script> </body> </html>`
		const contentType = 'text/html';
		var gallery = '';
		for (let pic of pictures) { 
			gallery += (
				`<div class="col-lg-4 col-sm-6">
					<a data-fancybox="gallery" class="portfolio-box" href="${pic.file}">
						<img class="img-fluid" src="${pic.file}" alt="${pic.description}">
						<div class="portfolio-box-caption">
								<div class="portfolio-box-caption-content">
								<div class="project-name">
										+
								</div>
							</div>
						</div>
						</a>
				</div>`
				); 
			}
		const fileObj = heading + nav + header + pregallery + gallery + postgallery + footer + scripts;
		const Obj = {
			contentType: contentType,
			section: section,
			title: title,
			fileObj: fileObj,
		}
		let secondFunct = addToStorage(Obj.contentType, Obj.section, Obj.title, Obj.fileObj, 'html'); 
		return secondFunct;				
	})
	.catch(err => {
		console.log('error: ', err)
	});
	return query;
}