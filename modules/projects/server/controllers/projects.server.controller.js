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
  sanitizeHtml = require('sanitize-html'),
  Promise = require('bluebird'),
  fs = Promise.promisifyAll(require('fs')),
  exports = Promise.promisifyAll(exports);








function nlpKeywords(sanitizedText) {
  return new Promise(
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
  //console.log('\n\n\nreq.body:\n', req.body, '\n\n\n\nreq.project:\n', req.project);
  var projectKeywords = [];
  var project = req.project;
  project = _.extend(project, req.body);

  if (req.body.story) {
    var sanitizedText = sanitizeHtml(req.body.story, {
      allowedTags: [],
      allowedAttributes: []
    });

    /**
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
     **/

    //  /**
    var text = {
      body: {
        text: sanitizedText,
        useCase: 'server'
      }
    };
    projects.nlpProjects(text, function(response) {
      project.keywords.push(response.keywords);
    });

    //getKeywords.then(function(projectKeywords){
    //  return project.keywords.push(projectKeywords);
    //});
    //**/
  }
  console.log('project.keywords v2:\n', project.keywords);
  console.log('projectKeywords:\n', projectKeywords);
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
 * List of GeoCoordinates for Projects
 */
exports.markerList = function (req, res) {
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
 */
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
  Project.find({featured: true})
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

//var dirtyText = 'All decent people feel sorrow and righteous fury about the latest slaughter of innocents, in California. Law enforcement and intelligence agencies are searching for motivations, including the vital question of how the murderers might have been connected to international terrorism. That is right and proper. But motives do not matter to the dead in California, nor did they in Colorado, Oregon, South Carolina, Virginia, Connecticut and far too many other places. The attention and anger of Americans should also be directed at the elected leaders whose job is to keep us safe but who place a higher premium on the money and political power of an industry dedicated to profiting from the unfettered spread of ever more powerful firearms. It is a moral outrage and a national disgrace that civilians can legally purchase weapons designed specifically to kill people with brutal speed and efficiency. These are weapons of war, barely modified and deliberately marketed as tools of macho vigilantism and even insurrection. America’s elected leaders offer prayers for gun victims and then, callously and without fear of consequence, reject the most basic restrictions on weapons of mass killing, as they did on Thursday. They distract us with arguments about the word terrorism. Let’s be clear: These spree killings are all, in their own ways, acts of terrorism. Every weekday, get thought-provoking commentary from Op-Ed columnists, The Times editorial board and contributing writers from around the world. Opponents of gun control are saying, as they do after every killing, that no law can unfailingly forestall a specific criminal. That is true. They are talking, many with sincerity, about the constitutional challenges to effective gun regulation. Those challenges exist. They point out that determined killers obtained weapons illegally in places like France, England and Norway that have strict gun laws. Yes, they did. But at least those countries are trying. The United States is not. Worse, politicians abet would-be killers by creating gun markets for them, and voters allow those politicians to keep their jobs. It is past time to stop talking about halting the spread of firearms, and instead to reduce their number drastically — eliminating some large categories of weapons and ammunition. It is not necessary to debate the peculiar wording of the Second Amendment. No right is unlimited and immune from reasonable regulation. Certain kinds of weapons, like the slightly modified combat rifles used in California, and certain kinds of ammunition, must be outlawed for civilian ownership. It is possible to define those guns in a clear and effective way and, yes, it would require Americans who own those kinds of weapons to give them up for the good of their fellow citizens. What better time than during a presidential election to show, at long last, that our nation has retained its sense of decency?';

/**
 * Alchemy API for NLP
 **/

exports.nlpProjects = function (req, res) {
  console.log(req);
  var dirtyText = req.body.text;
  var sentKeywords = [];
  var sanitizedText = sanitizeHtml(dirtyText, {
    allowedTags: [],
    allowedAttributes: []
  });
  var alchemyApi = new AlchemyAPI(config.alchemyApi.alchemyKey);
  alchemyApi.keywords(sanitizedText, {'sentiment': 0, 'outputMode': 'json'}, function (err, keywords) {
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
  res.send(sentKeywords);
};

/**
 * Kraken.io Img Optimization
 */

//exports.krakenImageUpload = function(req, res) {
//	var kraken = new Kraken({
//		api_key: keys.krakenKey,
//		api_secret: keys.krakenSecret
//	});
//
//	var opts = {
//		file: '/path/to/image/file.jpg',
//		wait: true
//	};
//
//	kraken.upload(opts, function(data) {
//		if (data.success) {
//			console.log('Success. Optimized image URL: %s', data.kraked_url);
//		} else {
//			console.log('Fail. Error message: %s', data.error);
//		}
//	});
//
//};
