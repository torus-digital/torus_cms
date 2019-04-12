import { API, graphqlOperation } from "aws-amplify";
import gql from '../GraphQL/QueryListPictures';
import { addToStorage } from './Shared.js';

export default function createGallery(){
	let query = API.graphql(graphqlOperation(gql))
	.then (result => {
		const pictures = result.data.listPictures.items;
		const title = 'index';
		const section = 'gallery';
		const before_gallery = `<!DOCTYPE html> <html> <head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>Almost CMS - Gallery</title> <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous"> <link href='https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic' rel='stylesheet' type='text/css'> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css" /> <link href="../css/gallery.css" rel="stylesheet"> <link href="../css/index.css" rel="stylesheet"> </head> <body id="page-top"> <nav class="navbar navbar-expand-lg fixed-top py-3" id="mainNav"> <div class="container"> <a class="navbar-brand js-scroll-trigger" href="../index.html"> <img src="../img/almost-logo.svg" height="60" width="auto"> </a> <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"> <span class="fa fa-lg fa-bars text-primary"></span> </button> <div class="collapse navbar-collapse" id="navbarResponsive"> <ul class="navbar-nav ml-auto my-2 my-lg-0"> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../about.html">About</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../articles/index.html">Articles</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="#page-top">Gallery</a> </li> <li class="nav-item"> <a class="nav-link js-scroll-trigger" href="../contact.html">Contact</a> </li> </ul> </div> </div> </nav> <section class="page-heading bg-primary" id="about"> <div class="container"> <div class="row justify-content-center"> <div class="col-lg-8 text-center"> <h4 class="text-white pt-4">Some Pictures by my friend Richard</h4> </div> </div> </div> </section> <div class="index-body"> <section id="portfolio"> <div class="container-fluid p-0"> <div class="row no-gutters popup-gallery">`;
		const after_gallery = ` </div> </div> </section> </div> <footer class="bg-light py-5"> <div class="container-fluid"> <div class="row small text-center text-muted"> <div class="col-md-6"> <div>Copyright &copy; 2019 - Almost CMS</div> </div> <div class="col-md-6"> <div> Powered By <a href="https://github.com/gkpty/almost_cms">Almost CMS</a></div> </div> </div> </div> </footer> <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script> <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o" crossorigin="anonymous"></script> <script src="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js"></script> <script src="../js/index.js"></script> </body> </html>`;
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
		const fileObj = before_gallery + gallery + after_gallery;
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