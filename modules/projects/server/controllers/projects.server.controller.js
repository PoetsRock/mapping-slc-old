'use strict';


var mongoose = require('mongoose'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Project = mongoose.model('Project'),
  multiparty = require('multiparty'),
  util = require('util'),
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
  s3Url = 'https://' + s3Config.bucket + '.s3-' + s3Config.region + '.amazonaws.com',
  crypto = require('crypto'),
  moment = require('moment'),
  tinify = require('tinify'),
  apiKeys = require('../../../../config/env/production.js');


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


exports.parseFileUpload = (req, res, next) => {
  // parse a file upload
  var form = new multiparty.Form();

  form.parse(req, function (err, fieldsObject, filesObject) {
    if (err) {
      // console.log('parseFileUpload callback `err`:\n', err, '\n\n');
    }
    // console.log('parseFileUpload callback `fieldsObject`:\n', fieldsObject, '\n\n');
    // console.log('parseFileUpload callback `filesObject`:\n', filesObject, '\n\n');
    // res.writeHead(200, {'content-type': 'text/plain'});
    // res.write('received upload:\n\n');
    // res.end(util.inspect({fields: fieldsObject, files: filesObject}));

    if (!req.body) {
      return req.body = {};
    }
    req.body.data = { fields: fieldsObject, files: filesObject };
    req.body.dataAsStr = util.inspect({ fields: fieldsObject, files: filesObject });
    // console.log('parseFileUpload callback `req.body`:\n', req.body, '\n\n');
    next();
  });

};



/**
 * upload user profile image to Amazon S3
 */

exports.uploadProjectDocuments = (req, res) => {

  let project = req.body.project;
  let fileName = req.body.filename;
  if(1 !== 1) {
    fileName = req.body.filename.replace(/\s/g, '_'); //substitute all whitespace with underscores
  }
  let path = s3Config.directory.project + '/' + project._id + '/' + fileName;
  let readType = 'public-read';
  let expiration = moment().add(5, 'm').toDate(); //15 minutes
  let s3Policy = {
    'expiration': expiration,
    'conditions': [{
      'bucket': s3Config.bucket
    },
      ['starts-with', '$key', path],
      {
        'acl': readType
      },
      {
        'success_action_status': '201'
      },
      ['starts-with', '$Content-Type', req.body.type],
      ['content-length-range', 2048, 10485760], //min and max
    ]
  };

  let stringPolicy = JSON.stringify(s3Policy);
  let base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

  // sign policy
  let signature = crypto.createHmac('sha1', config.S3_SECRET)
    .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

  let credentials = {
    url: s3Url,
    fields: {
      key: path,
      AWSAccessKeyId: config.S3_ID,
      acl: readType,
      policy: base64Policy,
      signature: signature,
      'Content-Type': req.body.type,
      success_action_status: 201
    }
  };

  /** save document URLs to MongoDb */

  
  // "fileUrls" : [
  // "https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/565a966a087f5958b73386e6/test.docx",
  //   "https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/565a966a087f5958b73386e6/test.pdf"
  // ],
  
  let newFileUrl = 'https://s3-us-west-1.amazonaws.com/' + s3Config.bucket + '/' + s3Config.directory.project + '/' + project._id + '/' + fileName;

  let updatedFileUrls = project.fileUrls.push(newFileUrl);
  console.log(':::: updatedFileUrls :::::\n', updatedFileUrls);
  console.log(':::: project.fileUrls :::::\n', project.fileUrls);
  Project.update( {_id: project._id}, { fileUrls: project.fileUrls }, { runValidators: true }, function(err, response) {
    if(err) {
      let errMessage = {
        message: 'Error dating database for project file upload',
        error: err
      };
      console.log('errMessage:\n', errMessage, '\n\n');
      res.jsonp(errMessage);
    }
    console.log('::::: file upload update db successful::: var `response`:\n', response, '\n\n');
    console.log('credentials:\n', credentials, '\n\n');
    res.jsonp(credentials);
  });
};




/**
 *
 * Uploads documents to s3 - stores files in `mapping-slc-file-upload/project-directory/<project-id>/`
 *
 * @param req
 * @param res
 */
exports.streamProjectDocuments = (req, res) => {

  var project = req.project;

  var file = req.body.data.files.file[0];
  var filePath = req.body.data.files.file[0].path;
  var fileName = req.body.data.files.file[0].originalFilename;
  var type = req.body.data.files.file[0].headers['content-type'];
  var aclLevel = req.body.data.fields['data[securityLevel]'];

  if (/\s/g.test(fileName)) {
    fileName = fileName.replace(/\s/g, '_');
  }

  /** config aws s3 config settings, file object, and create a new instance of the s3 service */
  let awsS3Config = {
    accessKeyId: config.S3_ID,
    secretAccessKey: config.S3_SECRET,
    region: 'us-west-1',
    Key: s3Config.directory.project + '/' + project._id + '/' + fileName,
    Bucket: s3Config.bucket
  };
  let fileStream = fs.createReadStream(filePath);
  let s3obj = {
    header: { 'x-amz-decoded-content-length': file.size },
    ACL: aclLevel || 'private',
    region: 'us-west-1',
    Key: s3Config.directory.project + '/' + project._id + '/' + fileName,
    Bucket: s3Config.bucket,
    ContentLength: file.size,
    ContentType: type,
    Body: fileStream
    // ServerSideEncryption: 'AES256'
  };



/** now upload image to S3 */

 let s3 = new AWS.S3(awsS3Config);

 s3.upload({ Bucket: s3obj.Bucket, Key: s3obj.Key, Body: s3obj.Body })
   .on('httpUploadProgress', function(evt) { console.log(evt); })
   .send(function(err, data) {
     if(err) {
       console.log('s3 upload error message:\n', err);
     }
     console.log('s3 upload project files :: SUCCESSFUL UPLOAD :: Response var `data`:\n', data);

     /** now save main document url and ETag to mongoDb */
     let updatedProject = {
       fileUrls: data.Location,
       fileEtags: data.ETag
     };
     Project.update(updatedProject);

     /** now respond with a success message */
     // res.jsonp({ message: 's3 file upload was successful', mainImageUrl: data.Location });

     let response = {
       message: 's3 file upload was successful',
       s3obj: s3obj
     };
     res.jsonp(response);

   });

};





/**
 *
 * Uploads images and files to s3 - stores files in `mapping-slc-file-upload/project-directory/<project-id>/`
 *
 * @param req
 * @param res
 */
exports.uploadProjectFiles = (req, res) => {

  var project = req.project;
  var user = req.user;

  // for(var i = 0; )

  // console.log('req:\n', req, '\n\n\n\n\n');
  // console.log('\n\n\n\n\n:::::::::::::::::::::::::::::::::::::::::::::::::::\n\n\n\n\n');
  // console.log('req.headers:\n', req.headers, '\n\n');
  // console.log('req.project:\n', req.project, '\n\n');
  // console.log('req.user:\n', req.user, '\n\n');
  // console.log('req.body.data:\n', req.body.data, '\n\n');
  // console.log('req.body.data.fields:\n', req.body.data.fields, '\n\n');
  // console.log('req.body.data.fields[\'data[securityLevel]\']:\n', req.body.data.fields['data[securityLevel]'], '\n\n');
  // console.log('req.body.data.fields:\n', req.body.data.fields['data'][securityLevel], '\n\n');
  // console.log('req.body.data.files:\n', req.body.data.files, '\n\n');
  //
  // console.log('req.body.data.files.file[0].path:\n', req.body.data.files.file[0].path, '\n\n');
  // console.log('req.body.data.files.file[0].headers:\n', req.body.data.files.file[0].headers, '\n\n');
  // console.log('req.body.data.files.file[0].headers[\'content-type\']:\n', req.body.data.files.file[0].headers['content-type'], '\n\n');
  // console.log('req.body.data.files.file[0].size:\n', req.body.data.files.file[0].size, '\n\n');
  // console.log('req.body.data.files.file[0].originalFilename:\n', req.body.data.files.file[0].originalFilename, '\n\n');
  //
  // console.log('req.body.data.files.file[0]:\n', req.body.data.files.file[0], '\n\n');

  // console.log('req.body.data.files.file[0].originalFilename:\n', req.body.data.files.file[0].originalFilename, '\n\n');

  var file = req.body.data.files.file[0];
  var filePath = req.body.data.files.file[0].path;
  var headers = req.body.data.files.file[0].headers;
  var fileName = req.body.data.files.file[0].originalFilename;
  var type = req.body.data.files.file[0].headers['content-type'];
  var aclLevel = req.body.data.fields['data[securityLevel]'];

  if (/\s/g.test(fileName)) {
    fileName = fileName.replace(/\s/g, '_');
  }

  /** config aws s3 config settings, file object, and create a new instance of the s3 service */
  let awsS3Config = {
    accessKeyId: config.S3_ID,
    secretAccessKey: config.S3_SECRET,
    region: 'us-west-1',
    Key: s3Config.directory.project + '/' + project._id + '/' + fileName,
    Bucket: s3Config.bucket
  };
  let fileStream = fs.createReadStream(filePath);
  let s3obj = {
    header: { 'x-amz-decoded-content-length': file.size },
    ACL: aclLevel || 'private',
    region: 'us-west-1',
    Key: s3Config.directory.project + '/' + project._id + '/' + fileName,
    Bucket: s3Config.bucket,
    ContentLength: file.size,
    ContentType: type,
    Body: fileStream
    // ServerSideEncryption: 'AES256'
  };

  /** now call on function that compresses image and also creates cropped thumbnail version */
  tinify.key = config.TINY_PNG_KEY;
  tinify.key = config.TINY_PNG_KEY;
  let source = tinify.fromFile(filePath);
  source.store({
    service: 's3',
    aws_access_key_id: config.S3_ID,
    aws_secret_access_key: config.S3_SECRET,
    region: 'us-west-1',
    path: s3Config.bucket + '/' + s3Config.directory.project + '/' + project._id + '/' + fileName
  });

  source.resize({
      method: 'cover',
      width: 150,
      height: 150
    })
    .store({
      service: 's3',
      aws_access_key_id: config.S3_ID,
      aws_secret_access_key: config.S3_SECRET,
      region: 'us-west-1',
      path: s3Config.bucket + '/' + s3Config.directory.project + '/' + project._id + '/' + 'thumb_' + fileName
    });

  /** now save the image URLs to mongoDb */
  let updatedProject = {
    mainImageUrl: 'https://' + awsS3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + s3Config.directory.project + '/' + project._id + '/' + fileName,
    mainImageThumbnailUrl: 'https://' + awsS3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + s3Config.directory.project + '/' + project._id + '/' + 'thumb_' + fileName
  };
  Project.update(updatedProject);


  let response = 's3 file upload was successful';
  res.send(response);
};


/**
 *
 * Uploads images and files to s3 - stores files in `mapping-slc-file-upload/project-directory/<project-id>/`
 *
 * @param {object} image
 */
let _createAndSaveThumbnail = (image) => {

// let optimizedThumbnail = _createThumbnail(image);

  /** now upload thumbnail image to S3 */
// s3obj.Body = optimizedThumbnail;
// s3.upload({ Bucket: s3ThumbObj.Bucket, Key: s3ThumbObj.Key, Body: s3ThumbObj.Body })
//   .send(function(err, data) {
//     if(err) {
//       console.log('s3 upload image thumbnail error message:\n', err);
//     }
//     let mainImageThumbnail = data;
//     console.log('s3 upload project data var `imageResponse`:\n', mainImageThumbnail);
//     return mainImageThumbnail;
//   });


};

/**
 *
 * Compress an image before uploading file
 *
 * @param {string} imageUrl
 * @returns {string} optimizedImg
 */
let _compressImage = (imageUrl) => {
  tinify.key = config.tinyPngKey;
  fs.readFile(imageUrl, function (err, sourceData) {
    if (err) {
      throw err;
    }
    tinify.fromBuffer(sourceData).toBuffer(function (err, optimizedImg) {
      if (err) {
        throw err;
      }
      return optimizedImg;
    });
  });
};


/**
 *
 * Create a cropped thumbnail image and compress it before uploading files
 *
 * @param image
 * @ returns {string}
 */
let _createThumbnail = (image) => {

};







/**
 * get pre-signed URL from AWS S3
 *
 * req.params.id {string} - user._id
 * req.params.imageId {string} - file name with extension
 */
exports.getS3SignedUrl = (req, res) => {
  console.log('hereh hereh herehe her herhe rehr eh r');
  // var params = { Bucket: 'myBucket', Key: 'myKey' };

  var awsS3Config = {
    accessKeyId: config.S3_ID,
    secretAccessKey: config.S3_SECRET,
    region: 'us-west-1'
  };
  var s3 = new AWS.S3(awsS3Config);
  var fileToGet = req.params.fileId;
  var userIdBucket = req.params.userId;
  var fileData = {
    fileToGet: fileToGet,
    userIdBucket: userIdBucket,
    params: {
      Bucket: s3Config.bucket + '/' + s3Config.directory.user + '/' + userIdBucket,
      Key: fileToGet
    }
  };
  // var pathToLocalDisk = 'modules/users/client/img/profile/uploads/';
  // var userProfileImage = pathToLocalDisk + fileToGet;

  s3.getSignedUrl('getObject', fileData.params,
    (err, url) => {
      if(err) {
        res.status(400).send({
          message: 'Error',
          error: err
        })
      }
      console.log('The URL is: ', url);
      res.status(200).send({
        message: 'Success: URL is availble for 15 minutes',
        url: url
      })
    });
};

/**
 * get file from AWS S3
 *
 * req.params.id {string} - user._id
 * req.params.imageId {string} - file name with extension
 */

exports.getS3File = function (req, res) {
  var awsS3Config = {
    accessKeyId: config.S3_ID,
    secretAccessKey: config.S3_SECRET,
    region: 'us-west-1'
  };
  var s3 = new AWS.S3(awsS3Config);
  var fileToGet = req.params.fileId;
  var userIdBucket = req.params.userId;
  var fileData = {
    fileToGet: fileToGet,
    userIdBucket: userIdBucket,
    params: {
      Bucket: s3Config.bucket + '/' + s3Config.directory.user + '/' + userIdBucket,
      Key: fileToGet
    }
  };
  var pathToLocalDisk = 'modules/users/client/img/profile/uploads/';
  var userProfileImage = pathToLocalDisk + fileToGet;
  //var fileType = '';


  s3.getObject(fileData.params, function (err, callback) {
    //require('string_decoder');
    if (err) {
      console.log('err:\n', err);
      res.send({
        message: 'ERROR, yo: ' + err
      })
    } else {
      // var imageAsBase64Array = callback.Body.toString('base64');
      // var imageAsUtf8 = callback.Body.toString('Utf8');

      // console.log('callback.Body:\n', callback.Body, '\n\n\n');
      // console.log('userProfileImage:\n', userProfileImage, '\n\n\n');

      fs.writeFile(userProfileImage, callback.Body, 'base64',
        (err) => {
          if (err) {
            throw err;
          }
          res.status(200).send({
            message: 'Success: File Delivered:\n'
            // fullResponse: callback,
            // imageAsBase64Array: imageAsBase64Array,
            // imageAsUtf8: imageAsUtf8
          });
        });
    }
  });
};
