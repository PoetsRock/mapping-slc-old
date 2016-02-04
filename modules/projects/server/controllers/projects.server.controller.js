'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Project = mongoose.model('Project'),
  _ = require('lodash'),
  config = require(path.resolve('./config/config')),
  AlchemyAPI = require('alchemy-api'),
  projects = require('./projects.server.controller'),
  sanitizeHtml = require('sanitize-html');
//Promise = require('bluebird'),
//fs = Promise.promisifyAll(require('fs')),
//exports = Promise.promisifyAll(exports);

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


//
// export default function getReplies(topicId) {
//  return new Promise(function (resolve, reject) {
//
//    _getRepliesForTopic(topicId,
//
//      function (data) {
//        if (data.replies) {
//          resolve(replies);
//        } else {
//          let error = new Error("An error occurred");
//          reject(error);
//
//        }
//      });
//  });
//}
//
// getReplies(1)
// .then(function (replies) {
//    return replies.filter(reply => !reply.isAbuse);
//  })
// .then(function (filteredReplies) {
//    console.log(filteredReplies);
//  })
// .catch(function (error) {
//    console.log(error)
//    ;
//  });

// **/


/**
 * Project middleware
 */
exports.updateFeaturedProjects = function (req, res, next) {
  var oldFeaturedProject = {};
  var newFeaturedProject = _.extend(req.project, req.body);
  let project = [];

  Project.find({ featured: true })
    .sort('featuredBeginDate')
    .exec(function (err, projects) {

      if (err) {
        console.log('featuredProjects `err`::::::\n', err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });

      } else if (projects.length >= 3) {  //`projects.length` should equal 3, bc the new featured project has not been added yet
        oldFeaturedProject = projects.pop();
        oldFeaturedProject.featured = false;
        project.push(oldFeaturedProject);
        console.log('project with just oldFeaturedProject:::\n', project);
      } else {
        return res.status(200).send({
          message: 'no featured projects were removed'
        });
      }

      newFeaturedProject.featured = true;
      newFeaturedProject.featuredBeginDate = Date.now();

      project.push(newFeaturedProject);
      req.project = project;
      console.log('req.project at the end, should have two projects in it:::\n', req.project);

      next();
    });

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

  console.log('!!!!project create req: \n', project);
  console.log('!!!!project.markerColor: \n', project.markerColor);

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

  console.log('\n\n\nreq.body:\n', req.body);
  console.log('\n\n\n\nreq.project:\n', req.project);

  var project = _.extend(req.project, req.body);
  console.log('\n\n\n:::::::1111 update `project`:::::::\n', project);
  //var project = {};
  //if (req.project) {
  //  console.log('\n\n\nreq.body:\n', req.body);
  //  console.log('\n\n\n\nreq.project:\n', req.project);
  //  project = _.extend(req.project, req.body);
  //} else {
  //  project = req.body;
  //  console.log('\n\n\n:::::::1111  project:::::::\n', project);
  //}

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
  //console.log('\n\n\nUpdate ALL ::::::: `req`:::::::::::\n', req);
  let projects = req.project;
  console.log('\n\n\n:::::Update ALL ::::::: beginning of script ::::::: `projects`:::::::::::\n', projects, '\n\nprojects.length:\n', projects.length);
  var updatedProjects = [];
  let project = {};

  for (let i = 0; i > projects.length; i++) {
    if(req.body) {
      console.log('\n\n\nin for loop, first IF conditional  `req.body`:::::::::::\n', req.body);
      project = _.extend(projects[i], req.body);
      //console.log('\n\n\nin for loop, first IF conditional  `project[i]`:::::::::::\n', project[i]);
      console.log('\n\n\nin for loop, first IF conditional  `project[i]`:::::::::::\n');
    } else {
      project = req.projects[i];
      //console.log('\n\n\nin for loop,  ELSE :: `project[i]`:::::::::::\n', project[i]);
      console.log('\n\n\nin for loop,  ELSE :: `project[i]`:::::::::::\n');
    }

    console.log('\n\n\n:::::::SAVEEEEEE  Update ALL  `project`:::::::\n', project);

    project.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        updatedProjects.push(project);
        console.log('\n\n\nin SAVEEEEE, in ELSE conditional:: `updatedProjects`:::::::::::\n', updatedProjects);
      }
    });
  }
  console.log('\n\n\n:::::::end of Update ALL `updatedProjects`:::::::\n', updatedProjects);
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

exports.findOneVideoId = function (req, res) {
  Project.findById(req.body._id)
    .exec(function (err, project) {
      if (err) {
        return next(err);
      }
      if (!project) {
        return next(new Error('Failed to load project ' + id + 'associated with the requested video.')
        )
      }
      res.vimeoId = project.vimeoId;
    });
};

/**
 * Project middleware
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
 * Project middleware test
 */
exports.middleWareTest = function (req, res, next) {


  let project = _.extend(req.project, req.body);
  project.testField = 'working';

  req.project = project;
  console.log('::::::::::::::::::::::::::test middleware `project`::::::\n', project);
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
 * Returns an array of objects that contains the featured projects
 */
exports.getFeaturedProjects = function (req, res) {
  Project.find({ featured: true })
    .sort('-featuredBeginDate')
    //.limit(3)
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
 *
 * @param req
 * @param res
 * @param next
 *
 *

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
 //console.log('project.keywords v2:\n', project.keywords);
 //console.log('projectKeywords:\n', projectKeywords);

 *
 *
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
