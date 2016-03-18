'use strict';


var mongoose = require('mongoose'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Project = mongoose.model('Project'),

  config = require(path.resolve('./config/config')),
  AlchemyAPI = require('alchemy-api'),
  projects = require('./projects.server.controller'),
  sanitizeHtml = require('sanitize-html'),
  //Promise = require('bluebird'),
  //fs = Promise.promisifyAll(require('fs')),
  //exports = Promise.promisifyAll(exports);
  AWS = require('aws-sdk'),
  s3Config = {
    keys: require('../../../../config/env/production.js'),
    bucket: 'mapping-slc-file-upload',
    region: 'us-west-1',
    directory: {
      project: 'project-directory',
      user: 'user-directory',
      admin: 'admin-directory'
    }
  },
  crypto = require('crypto'),
  moment = require('moment'),
  tinify = require('tinify'),
  s3Url = 'https://' + s3Config.bucket + '.s3-' + s3Config.region + '.amazonaws.com';


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
  //console.log('\n\n\n:::::::1111 update `project`:::::::\n', req.body);
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
      if(!err) {
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


exports.uploadProjectFiles = function (req, res) {

  var project = req.body.project;
  var file = req.body.file;
  var fileName = req.body.filename;
  
  if (!/\s/g.test(fileName)) {
    fileName = req.body.filename.replace(/\s/g, '_');
    console.log('substitute all whitespace with underscores, var `fileName` : ', fileName);
  }

  var path = s3Config.directory.project + '/' + project._id + '/' + fileName;
  var readType = req.body.securityLevel || 'private';

  // console.log('\n\n`uploadProjectFiles()` var `req`:\n', req, '\n\n');
  console.log('\n\n`uploadProjectFiles()` var `req.headers`:\n', req.headers, '\n\n');
  // console.log('\n\n`uploadProjectFiles()` var `path`:\n', path, '\n\n');

  console.log('\n\n`uploadProjectFiles()` var `req.body.file.size`:\n', req.body.file.size, '\n\n');
  console.log('\n\n`uploadProjectFiles()` var `req.body.file.name`:\n', req.body.file.name, '\n\n');
  // console.log('\n\n`uploadProjectFiles()` var `req.body.file`:\n', req.body.file, '\n\n');

  // var readType = 'public-read';
  // var expiration = moment().add(5, 'm').toDate(); //15 minutes
  // var s3Policy = {
  //   'expiration': expiration,
  //   'conditions': [{
  //     'bucket': s3Config.bucket
  //   },
  //     ['starts-with', '$key', path],
  //     {
  //       'acl': readType
  //     },
  //     {
  //       'success_action_status': '201'
  //     },
  //     ['starts-with', '$Content-Type', req.body.type],
  //     ['content-length-range', 2048, 10485760], //min and max
  //   ]
  // };
  //
  // var stringPolicy = JSON.stringify(s3Policy);
  // var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

  // // sign policy
  // var signature = crypto.createHmac('sha1', config.S3_SECRET)
  //   .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

  // //now compress if image
  // let optimizedImage = compressImage(image);


  /** now upload files to S3 */

  // policy: base64Policy,
  // signature: signature,

  //GrantReadACP:
  //Metadata — (map<String>) A map of metadata to store with the object in S3


  let awsS3Config = {

  };

  // let fileImage = fs.createReadStream(fileName).pipe(zlib.Gzip());
  // let fileImage = fs.createReadStream();
  let s3obj = {
    Url: s3Url,
    params: {
      accessKeyId: config.S3_ID,
      secretAccessKey: config.S3_SECRET,
      region: 'us-west-1',
      Key: path,
      Bucket: s3Config.bucket
    },
    AWSAccessKeyId: config.S3_ID,
    ACL: readType,

    Body: file,
    ContentLength: req.body.file.size
    // ContentType: req.body.type
    // ServerSideEncryption: 'AES256',
    // success_action_status: 201
  };

  // console.log('\n\n`uploadProjectFiles()` var `awsS3Config`:\n', awsS3Config, '\n\n');
  // console.log('\n\n`uploadProjectFiles()` var `fileImage`:\n', fileImage, '\n\n');
  // console.log('\n\n`uploadProjectFiles()` var `s3obj`:\n', s3obj, '\n\n');


    // s3.upload(s3obj).
    //   on('httpUploadProgress', function(evt) {
    //     console.log('httpUploadProgress - evt:\n', evt);
    // }).
    //   send(function(err, s3FileData) {
    //     if(err) {
    //       console.log('err:\n', err);
    //     }
    //     console.log('s3FileData:\n', s3FileData);
    // });



  // var s3obj = new AWS.S3(s3obj.params);
  let s3 = new AWS.S3(awsS3Config.params);
  s3.upload({ Body: s3obj.Body })
    .on('httpUploadProgress', function(evt) { console.log(evt); })
    .send(function(err, data) { console.log(err, data) });


  ////now save url to mongoDb

  //user.profileImageURL = 'https://s3-' + s3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + s3Config.directory.user + '/' + user._id + '/' + fileName;
  //
  //var updateUser = {
  //  user: user
  //};

  //Users.update(updateUser);


//now respond with a success message
  res.jsonp({ 'message': 'success' });

};


let compressImage = (image) => {
  tinify.key = config.tinyPngKey;
  var fs = require("fs");
  // fs.readFile('unoptimized.jpg', function(err, sourceData) {
  fs.readFile(image, function(err, sourceData) {
    if (err) {
      throw err;
    }
    tinify.fromBuffer(sourceData).toBuffer(function(err, optimizedImg) {
      if (err) {
        throw err;
      }
      return optimizedImg
    });
  });
};
