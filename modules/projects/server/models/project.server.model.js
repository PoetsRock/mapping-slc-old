'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  mongoosastic = require('mongoosastic');

var ImageGallerySchema = new Schema({
  imageUrl: String,
  imageId: String,
  thumbImageUrl: String,
  thumbImageId: String,
  thumbImageSize: Number,
  thumbImageType: String,
  imageSize: Number,
  imageType: String,
  imageExt: String,
  imageTags: Array,
  imageName: String,
  isDefaultImage: Boolean,
  imageHash: String,
  imageS3Key: String,
  Location: String,
  ETag: String,
  metadata: Object
});

var DocumentGallerySchema = new Schema({
  documentName: String,
  documentSize: Number,
  documentTags: Array,
  documentType: String,
  documentExt: String,
  documentIcon: String,
  documentUrl: String,
  metadata: Object
});

/**
 * `ModifiedSchema` is a subCollection that consists of an array of objects. each object has two fields:
 * @prop modifiedBy {string}: userId of user who edited document
 * @prop modifiedAt {date}: timestamp that records when document was modified
 */
let ModifiedSchema = new Schema({
  modifiedBy: String,
  modifiedAt: Date
});

/**
 *
 * Project Schema
 * (also used for Admin panel)
 *
 **/

var ProjectSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: [{
      type: String,
      enum: ['received', 'pending', 'rejected', 'soft_rejection', 'revise', 'accepted', 'userPulled', 'staffPulled', 'published', 'edit']
    }],
    default: 'received'
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  publishedOn: {
    type: Date
  },
  firstName: {
    type: String,
    ref: 'User'
  },
  lastName: {
    type: String,
    ref: 'User'
  },
  title: {
    type: String,
    es_indexed: true,
    default: '',
    required: 'Please fill out the title of your submission',
    trim: true
  },
  shortTitle: {   //for featured projects, the title that will display in the street sign box
    type: String,
    es_indexed: true,
    default: '',
    trim: true
  },
  story: {
    type: String,
    es_indexed: true,
    trim: true
  },
  storySummary: {
    type: String,
    default: ''
  },
  street: {
    type: String,
    default: '',
    required: '',
    trim: true
  },
  street2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  zip: {
    type: Number,
    default: '',
    required: '',
    trim: true
  },
  lat: {
    type: Number,
    es_indexed: true,
    trim: true
  },
  lng: {
    type: Number,
    es_indexed: true,
    trim: true
  },
  location: {
    type: [Number],
    index: '2dsphere'
  },
  //stores a static .map image, created on new project creation
  //https://www.mapbox.com/developers/api/v1/static/#images
  mapImage: {
    type: String,
    trim: true
  },
  mapImageThumb: {
    type: String,
    trim: true
  },
  category: {
    type: [{
      type: String,
      enum: ['multimedia', 'essay', 'literature', 'interview', 'map', 'video', 'audio', 'photography', 'this-was-here']
    }],
    trim: true
  },
  keywords: {
    type: [{
      type: String
    }],
    default: []
  },
  tags: {
    type: [{
      type: String
    }]
  },
  relatedContent: {
    type: [{
      type: String
    }]
  },
  projectViewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: 'false'
  },
  featuredBeginDate: {
    type: Date
  },
  featuredEndDate: {
    type: Date
  },
  mainImage: {
    imageUrl: String,
    imageId: String,
    thumbImageUrl: String,
    thumbImageId: String,
    imageSize: Number,
    imageType: String,
    imageExt: String,
    imageName: String,
    imageTags: {
      type: [{
        type: String
      }]
    },
    default: {}
  },
  vimeoId: {
    type: String,
    es_indexed: true,
    trim: true
  },
  soundCloudId: {
    type: String,
    es_indexed: true,
    trim: true
  },
  markerColor: {
    type: String,
    default: ''
  },
  markerSymbol: {
    type: String,
    default: ''
  },

  imageGallery: [ImageGallerySchema],

  documentGallery: [DocumentGallerySchema],

  modified: [ModifiedSchema]

});


//create virtual attribute for full address
ProjectSchema.virtual('address').get(function () {
  return this.street + ' ' + this.city + ' ' + this.state + ' ' + this.zip;
});


//create virtual attribute setter for to spilt coordinates into lat and lng
ProjectSchema.virtual('geoCoordinates').get(function () {
  return this.lat + ', ' + this.lng;
}).set(function (geoCoordinates) {
  var splitCoordinates = geoCoordinates.split(', ');
  this.lat = splitCoordinates[0] || '';
  this.lng = splitCoordinates[1] || '';
});

//see mongoose-function library in node modules
//source: https://github.com/aheckmann/mongoose-function
var defaultKeywords = [];
ProjectSchema.methods.setDefaultKeywords = function () {
  defaultKeywords.push(project.fullName, project.title);
};
console.log('defaultKeywords: ', defaultKeywords);


ProjectSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

mongoose.model('Project', ProjectSchema);
mongoose.model('ImageGallery', ImageGallerySchema);
mongoose.model('DocumentGallery', DocumentGallerySchema);
mongoose.model('Modified', ModifiedSchema);
