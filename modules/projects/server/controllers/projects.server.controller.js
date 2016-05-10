'use strict';


let mongoose = require('mongoose'),
  fs = require('fs'),
  path = require('path'),
  util = require('util'),
  _ = require('lodash'),
  Project = mongoose.model('Project'),
  config = require(path.resolve('./config/config')),
  projects = require('./projects.server.controller'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  AlchemyAPI = require('alchemy-api'),
  apiKeys = require('../../../../config/env/production.js'),
  crypto = require('crypto'),
  moment = require('moment'),
  Promise = require('bluebird'),
  request = require('request'),
  sanitizeHtml = require('sanitize-html');


/**
 * Project middleware for getProjectById
 **/
exports.projectByID = function (req, res, next, id) {
  Project.findById(id)
    .populate('user')
    .exec(function (err, project) {
      if (err) return next(err);
      if (!project) return next(new Error('Failed to load Project ' + id));
      req.project = project;
      next();
    });
};


/**
 * Middleware that return sourceId from url params
 */
exports.source = (req, res, next, id) => {
  req.source = id;
  next();
};


/**
 * Project authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.project.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};


/**
 * Create a Project
 */
exports.create = function (req, res) {
  //console.log('!!!!project create req: \n', req);
  var project = new Project(req.body);
  project.user = req.user;

  //todo refactor into separate function and use in the update method as well
  if (req.category === 'video') {
    project.markerColor = '#ff0011';
  } else if (req.category === 'multimedia') {
    project.markerColor = '#ff0101';
  } else if (req.category === 'essay') {
    project.markerColor = '#0015ff';
  } else if (req.category === 'literature') {
    project.markerColor = '#15ff35';
  } else if (req.category === 'interview') {
    project.markerColor = '#ff0101';
  } else if (req.category === 'map') {
    project.markerColor = '#ff0101';
  } else if (req.category === 'audio') {
    project.markerColor = '#ff0101';
  } else {
    project.markerColor = '#00ff44';
  }

  // console.log('!!!!project create req: \n', project);
  // console.log('!!!!project.markerColor: \n', project.markerColor);

  project.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(project);
    }
  });
};

/**
 * Show the current Project
 */
exports.read = function (req, res) {
  res.jsonp(req.project);
};


/**
 * Update a Project
 */
exports.update = function (req, res) {
  console.log('\n\n\n:::::::1111 update `project`:::::::\n', req.body);
  var project = _.extend(req.project, req.body);
  project.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('\n\n\n:::::::2222 update `project`:::::::\n', project);
      res.jsonp(project);
    }
  });

};


/**
 * Update Multiple Projects
 */
exports.updateAll = function (req, res) {
  let projects = req.project;
  var updatedProjects = [];
  let project = {};

  for (let i = 0; i < projects.length; i++) {
    project = _.extend(projects[i], req.body);
    project.save(function (err) {
      if (!err) {
        updatedProjects.push(project);
      }
    });
  }
  res.jsonp(updatedProjects);

};


/**
 * Delete an Project
 */
exports.delete = function (req, res) {
  var project = req.project;

  project.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(project);
    }
  });
};

/**
 * List of Projects
 *
 * .find({ "invitees._id": req.query.invitation_id })
 * .populate('invitees.user')
 *
 */
exports.list = function (req, res) {
  Project.find()
    .sort('-created')
    .populate('user')
    .exec(function (err, projects) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(projects);
      }
    });
};

/**
 * List of Projects with status "published"
 *
 * .find({ "invitees._id": req.query.invitation_id })
 * .populate('invitees.user')
 *
 */
exports.listPublished = function (req, res) {
  //req.params
  Project.find({
    'status': 'published'
  })
    .sort('-created')
    .populate('user')
    .exec(function (err, projects) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(projects);
      }
    });
};


/**
 * List of Markers for Home Page Map
 */
exports.markerList = function (req, res) {
  //todo filter this response to contain just what's needed for markers
  Project.find({
    'status': 'published'
  })
    .sort('-created')
    .exec(function (err, projects) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(projects);
      }
    });
};


/**
 * Returns an array of objects that contains the featured projects
 */
exports.getFeaturedProjects = function (req, res) {
  Project.find({ featured: true })
    .sort('-featuredBeginDate')
    .exec(function (err, projects) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(projects);
      }
    });
};


/**
 * Alchemy API for NLP
 **/

exports.nlpProjects = function (req, res, next) {
  console.log(req);
  var dirtyText = req.body.text;
  var sentKeywords = [];
  var sanitizedText = sanitizeHtml(dirtyText, {
    allowedTags: [],
    allowedAttributes: []
  });
  var alchemyApi = new AlchemyAPI(config.alchemyApi.alchemyKey);
  alchemyApi.keywords(sanitizedText, { 'sentiment': 0, 'outputMode': 'json' }, function (err, keywords) {
    if (err) {
      throw err;
      //} else if (req.body.useCase === 'server') {
      //  res.json(response);
    } else {
      console.log('keywords.keywords l. 317:\n', keywords.keywords);
      sentKeywords.push(keywords.keywords);
      console.log('sentKeywords l. 319:\n', sentKeywords);
    }
  });
  console.log('sentKeywords l. 322:\n', sentKeywords);

  req.project.nlp = sentKeywords;
  next();

};


/**
 function nlpKeywords(sanitizedText) {
  //return new Promise( //deleted bluebird, use native es6 promises if needed
    function (resolve, reject) {
      var alchemyApi = new AlchemyAPI(config.alchemyApi.alchemyKey);
      alchemyApi.keywords(sanitizedText, {'sentiment': 0, 'outputMode': 'json'},
        function (err, keywords) {
        if (keywords) {
          resolve(keywords);
        } else {
          let error = new Error('Error, error.');
          reject(error);
        }
      });
  });
}
 **/

/**
 if (req.body.story) {
    var sanitizedText = sanitizeHtml(req.body.story, {
      allowedTags: [],
      allowedAttributes: []
    });


    //do nlp and return a promise
    nlpKeywords(sanitizedText)
      .then(function (keywords) {
        projectKeywords = keywords.keywords;
        project.keywords.push(projectKeywords);
        console.log('project.keywords v1:\n', project.keywords);
        //return projectKeywords;
      })
      .catch(function (error) {
        console.log('Error:\n', error)
      });



var text = {
  body: {
    text: sanitizedText,
    useCase: 'server'
  }
};
//projects.nlpProjects(text, function(response) {
//  project.keywords.push(response.keywords);
//});

}
 **/


exports.markerData = function (req, res, next) {

  var markerColor = '';
  if (req.category === 'video') {
    markerColor = '#ff0011';
    res.send(markerColor);
  } else if (req.category === 'multimedia') {
    markerColor = '#ff0101';
    res.send(markerColor);
  } else if (req.category === 'essay') {
    markerColor = '#0015ff';
    res.send(markerColor);
  } else if (req.category === 'literature') {
    markerColor = '#15ff35';
    res.send(markerColor);
  } else if (req.category === 'interview') {
    markerColor = '#ff0101';
    res.send(markerColor);
  } else if (req.category === 'map') {
    markerColor = '#ff0101';
    res.send(markerColor);
  } else if (req.category === 'audio') {
    markerColor = '#ff0101';
    res.send(markerColor);
  } else {
    markerColor = '#00ff44';
    res.send(markerColor);
  }
  next();

};


/**
 *
 * update project to a featured project
 *
 * @param project
 */
let updateNewFeaturedProject = function (project) {
  project.featured = true;
  let featuredProjectOptions = { new: true };
  project.featuredBeginDate = Date.now();
  project.featuredEndDate = null;

  //setup new featured project variables
  Project.findOneAndUpdate({ _id: project._id }, project, featuredProjectOptions,
    function (err, newProject) {
      if (err) {
        return { message: errorHandler.getErrorMessage(err) };
      } else {
        return newProject;
      }
    });
};


/**
 * update project to no longer be a featured project
 *
 */
let updateOldFeaturedProject = () => {

  let featuredProjects = [];

  Project.find({ featured: true })
    .sort('-featuredBeginDate')
    .exec(function (err, projects) {
      if (err) {
        return { message: errorHandler.getErrorMessage(err) };
      } else {
        featuredProjects = projects;
      }
      if (featuredProjects.length === 3) {
        let oldProject = featuredProjects.pop();
        oldProject.featuredEndDate = Date.now();
        oldProject.featured = false;

        oldProject.save(function (err, updatedOldProject) {
          if (err) {
            return { message: errorHandler.getErrorMessage(err) };
          } else {
            return updatedOldProject;
          }
        });

      } else if (featuredProjects < 3) {
        return { message: 'Less than 3 Featured Projects. No projects were removed from the featured projects' };

      } else if (featuredProjects > 3) {
        return { message: 'ALERT: More than 3 Featured Projects before adding current project. NO PROJECTS WERE UPDATED' };
      }
    });
};


exports.updateFeaturedProjects = function (req, res) {
  updateOldFeaturedProject();
  updateNewFeaturedProject(req.body);
};




exports.googlePlacesData = (req, res) => {
    var results = {};
    var tempResults = [];
    var query = 'https://maps.googleapis.com/maps/api/v1/place/nearbysearch/json?key=AIzaSyBZ63pS3QFjYlXuaNwPUTvcYdM-SGRmeJ0&location=40.773,-111.902&radius=1000';
    request(query, function (error, response, body) {
      body = JSON.parse(body);
      res.jsonp(body);
      var pageToken = body['next_page_token'];
      console.log('pageToken: ', pageToken);
      console.log('body2: ', body);
      results = body;

      var secondQuery = 'https://maps.googleapis.com/maps/api/v1/place/nearbysearch/json?pagetoken=' + pageToken + '&key=AIzaSyBZ63pS3QFjYlXuaNwPUTvcYdM-SGRmeJ0';
      console.log('secondQuery: ', secondQuery);
      request(secondQuery, function (error, response, body) {
        console.log('body2: ', body);
        tempResults = results.push(body);
        console.log('final results: ', results);
      });
    });
};


exports.getApiKeys = (req, res) => {

  var environment = null;
  if (process.env.NODE_ENV === 'production') {
    environment = process.env;
  } else {
    environment = require('../../../../config/env/local-development.js').FRONT_END;
  }
  var publicKeys = {
    MAPBOX_KEY: environment.MAPBOX_KEY,
    MAPBOX_SECRET: environment.MAPBOX_SECRET,

    HERE_KEY: environment.HERE_KEY,
    HERE_SECRET: environment.HERE_SECRET,

    CENSUS_KEY: environment.CENSUS_KEY
  };
  res.jsonp(publicKeys);
  
};
