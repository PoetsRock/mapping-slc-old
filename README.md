[![Mapping Sale Lake City Logo](http://www.mappingslc.org/images/mapping.png)](http://mappingslc.org/)

# Mapping Salt Lake City

Mapping Salt Lake City is a community-created archive of Salt Lake City’s neighborhoods and people that documents the city’s changes through art, critical and creative literature, personal maps and multi-media projects.

This repo is the code base for a new site for Mapping Salt Lake City, which will launch in the summer of 2016.


##Sponsors
Mapping Salt Lake City would like to thank and recognize [BrowserStack](http://www.browserstack.com), which has been very generous in its support.
[<img src="http://www.mappingslc.org/images/site_img/browserstack.svg" alt="BrowserStack logo" width="250"/>](http://www.browserstack.com)<br />
BrowserStack. Get unrestricted access to 1000+ real mobile and desktop browsers

Previous funding has been provided by [The Utah Humanities Council](http://www.utahhumanities.org/), [The University of Utah](http://www.utah.edu/), The Richard B. Siegel Foundation, and [Westminster College](http://www.westminstercollege.edu/).


## About Us
[Paisley Rekdal](http://www.paisleyrekdal.com/)) is the creator and Editor for Mapping Salt Lake City.

[Chris Tanseer](http://www.christanseer.com) is a founding member of the project and serves as the Assistant Editor and Lead Web Developer for the project.

We welcome you to join our community, either by assisting in the development of the site, or by [submitting work](http://www.mappingslc.org/index.php?option=com_k2&view=item&layout=item&id=4&Itemid=279) to the project.

Mapping Salt Lake City was inspired by the work of [Rebecca Solnit](http://rebeccasolnit.net/).


## Prerequisites
Make sure you have installed all these prerequisites on your development machine.

  * Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [Github Gist](https://gist.github.com/isaacs/579814) to install Node.js.    
	  
	  * Currently, we're running on Node 4.x. If you have Node installed but are using a different version, you can use Node Versoion Manager (NVM) to switch between Node versions. [Mac and Linux users](https://github.com/creationix/nvm). [Windows users](https://github.com/coreybutler/nvm-windows).    	

  * MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).    

  * Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

```
$ npm install -g bower
```

* Gulp - We use [Gulp](http://gulpjs.com/) ([their GitHub repo](https://github.com/gulpjs/gulp)) to automate the development process. In order to install it, make sure you've installed Node.js and npm, then install Gulp globally using npm:

```
$ npm install --global gulp-cli
```

*NOTE from the Gulp folks: "If you have previously installed a version of gulp globally, please run npm rm --global gulp to make sure your old version doesn't collide with gulp-cli."

## Quick Install

### Cloning The Mapping SLC GitHub Repository
Begin by creating a fork of the main Mapping SLC repo. Next, open up a terminal window and clone your fork to download the files to your local machine:  

```
$ git clone https://github.com/<YOUR GITHUB USER NAME>/mapping-slc.git
```

### Download Required Dependencies

After you've clone a fork of Mapping SLC, go into the directory (which should be `cd mapping-slc`) and run:

```
$ bower install
```

This will install, among other libraries, "mslc," a private repo for Mapping SLC, where the Redactor source file[*](#redactor-misc-info) and API keys for local development are stored. If you do not see "mslc" in `public/lib/mslc/`, ensure you have permissions to access the ["mslc" repo](https://github.com/PoetsRock/mslc). If you need permissions, e-mail [Chris Tanseer](mailto:chris@christanseer.com).

Now, you will need to copy and paste the `local-development.js` file that you will find at `/public/lib/mslc/local-development.js` to the directory `config/env/`. (Please ensure you do not upload this file to GitHub. It's set to be ignored in the `.gitignore` file. So, you shouldn't need to do anything.)

Once you've copied the API Keys, install the Node.js dependencies by running:
Additionally, you'll want to run:

```
$ npm install
```

We've noticed that, on occasion, you need to run this command two or three times to get all of the dependencies.

Running `npm install` will launch the app; however, it launches it in production mode. So, click `CTRL + c` to kill the process in order to launch the app for local environment.

## Running Your Application
After the install process is over, you'll be able to run your application using Gulp, just run grunt default task:

```
$ gulp
```

Your application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)
                            
That's it! Your application should be running by now, to proceed with your development check the other sections in this documentation. 
If you encounter any problem try the Troubleshooting section.

## License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

All published content [Mapping Salt Lake City](http://www.mappingslc.org) is copyrighted by Mapping Salt Lake City
for use on the site, in promotional material, and other marketing-related content, and otherwise is copyrighted by the
author(s) of each piece.

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[*](#redactor-misc-info)
