'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  mongoosastic = require('mongoosastic');

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
  /**
   * `ModifiedBy` is an array of objects
   * @prop {string}: userId of user who edited document
   * @prop {string}: timestamp that records when document was modified
   */
  ModifiedBy: {
    type: [{
      type: String
    }],
    default: []
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
  category: {
    type: [{
      type: String,
      enum: ['multimedia', 'essay', 'literature', 'interview', 'map', 'video', 'audio', 'this was here']
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
  imageGallery: {
    type: [{
      type: String
    }],
    trim: true
  },
  featured: {
    type: Boolean,
    default: 'false'
  },
  featuredBeginDate: {
    type: Date
  },
  mainImage: {
    type: String,
    trim: true
  },
  //mainImage: {
  //  type: Buffer
  //},
  //mainImgThumbnail: {
  //  type: Buffer
  //},
  mainImgThumbnail: {
    type: String
  },
  mainImageUrl: {
    type: String,
    trim: true
  },
  mainImgThumbnailUrl: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    set: function (url) {
      if (!url) {
        return null;
      } else {
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
          url = 'http://' + url;
        }
        return url;
      }
    }
  },
  markerColor: {
    type: String,
    default: ''
  },
  markerSymbol: {
    type: String,
    default: ''
  }
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
