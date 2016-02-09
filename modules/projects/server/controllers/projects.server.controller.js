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

  console.log('\n\n\n\nreq:\n', req);
  console.log('\n\n\n\nreq.body:\n', req.body);
  console.log('\n\n\n\nreq.project:\n', req.project);

  var project = _.extend(req.project, req.body);
  console.log('\n\n\n:::::::1111 update `project`:::::::\n', project);

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
  //console.log('\n\n\n:::::Update ALL ::::::: beginning, `projects`::::\n', projects, '\n\nprojects.length:\n', projects.length);
  var updatedProjects = [];
  let project = {};

  for (let i = 0; i < projects.length; i++) {
    project = _.extend(projects[i], req.body);

    //console.log('\n\n\n3333333   in for loop, `project`, to be saved:::::::::::\n', project, '\n\n\n');

    project.save(function (err) {
      updatedProjects.push(project);
    });
  }

  console.log('\n\n\n:::::::end of Update ALL `updatedProjects`:::::::\n', updatedProjects);
  res.jsonp(updatedProjects);

};


/**
 *


 exports.updateAll = function (req, res) {
  let projects = req.project;
  //console.log('\n\n\n:::::Update ALL ::::::: beginning of script ::::::: `projects`:::::::::::\n', projects, '\n\nprojects.length:\n', projects.length);
  var updatedProjects = [];
  let project = {};

  for (let i = 0; i < projects.length; i++) {
    //if(req.body) {

    project = _.extend(projects[i], req.body);
    console.log('\n\n\n3333333   in for loop, `project`, to be saved:::::::::::\n', project, '\n\n\n');

    //} else {
    //  project = req.projects[i];
    //  console.log('\n\n\nin for loop,  ELSE :: `project[i]`:::::::::::\n');
    //}

    project.save(function (err) {
      //if (err) {
      //  return res.status(400).send({
      //    message: errorHandler.getErrorMessage(err)
      //  });
      //} else {

      updatedProjects.push(project);

      //}
    });
  }
  console.log('\n\n\n:::::::end of Update ALL `updatedProjects`:::::::\n', updatedProjects);

  res.jsonp(updatedProjects);

};


 */


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


let featuredProjectOptions = {
  new: true
};

/**
 *
 * update project to a featured project
 *
 * @param project
 * @param res
 */
let updateNewFeaturedProject = function (project) {
  let newProjectUpdated = null;
  project.featured = true;
  project.featuredBeginDate = Date.now();
  project.featuredEndDate = null;

  //setup new featured project variables

  Project.findOneAndUpdate({ _id: project._id }, project, featuredProjectOptions,
    function (err, newProject) {
      if (err) {
        console.log('\n\n\n\n::::: inside `newFeaturedProject() UPDATE::` ::::  param: `err`:`\n', err, '\n\n');
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log('\n\n\n\n::::: inside `newFeaturedProject() UPDATE::` ::::  param: `newProject`:`\n', newProject, '\n\n');
        return newProject;
      }
    });
};


/**
 *
 * update project to no longer be a featured project
 *
 * @param req
 * @param res
 */
//let updateOldFeaturedProject = (req, res) => {
let updateOldFeaturedProject = (req, res) => {

  let featuredProjects = [];

  Project.find({ featured: true })
    .sort('-featuredBeginDate')
    //.sort({'featuredBeginDate': -1})
    .exec(function (err, projects) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        featuredProjects = projects;
      }
    //})
    //.then(function () {
      console.log('\n\n\n\n::::: `updateOldFeaturedProject()`::::  ::::  var: `featuredProjects`:`\n', featuredProjects, '\n\n\n\n');

      if (featuredProjects.length === 3) {
        let oldProject = featuredProjects.pop();
        oldProject.featuredEndDate = Date.now();
        oldProject.featured = false;

        console.log('\n\n\n\n::::: `updateOldFeaturedProject()`:::: inside if ::::  var: `oldProject`:`\n', oldProject, '\n\n');

        oldProject.save(function (err, updatedOldProject) {
          if (err) {
            console.log('\n\n\n\n::::: `updateOldFeaturedProject()`::::  ::::  param: `err`:`\n', err, '\n\n');
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            console.log('\n\n\n\n::::: `updateOldFeaturedProject()`::::  var  `updatedOldProject:`\n', updatedOldProject, '\n\n');
            res.jsonp(updatedOldProject)
              .status(200).send({
                message: 'Success: Removed ' + updatedOldProject.title + 'from the Featuerd Projects list'
              });
            return updatedOldProject;
          }
        });

      } else if (featuredProjects < 3) {
        console.log('\n\n\n\n::::: `updateOldFeaturedProject()`:::: inside else if  #1:::: ');
        res.status(200).send({
          message: 'Less than 3 Featured Projects. No projects were removed from the featured projects'
        });

      } else if (featuredProjects > 3) {
        console.log('\n\n\n\n::::: `updateOldFeaturedProject()`:::: inside else if  #2:::: ');
        res.status(200).send({
          message: 'ALERT: More than 3 Featured Projects before adding current project. NO PROJECTS WERE UPDATED'
        });
      }


    });

};



exports.updateFeaturedProjects = function(req, res) {

  updateOldFeaturedProject();

  updateNewFeaturedProject(req.body);

  //res.jsonp(projectRemoved);

};


exports.removeOldest = function(req, res) {

  updateOldFeaturedProject();

  res.jsonp(projectRemoved);


};
