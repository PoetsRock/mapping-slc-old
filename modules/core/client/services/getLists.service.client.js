(function () {
  'use strict';

  angular
  .module('core')
  .service('getLists', getLists);

  getLists.$inject = [];


  function getLists() {
    return {

      listStates: function listStates() {
        return this.states = ('UT AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' + 'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX VT VA WA WV WI WY').split(' ').map(function (state) {
          return {abbrev: state};
        });
      },

      listRoles: function listRoles() {
        return this.roles = ['user', 'blocked', 'unregistered', 'registered', 'contributor', 'admin', 'superUser'].map(function (role) {
          return {userRole: role};
        });
      },

      listStatuses: function listStatuses() {
        return this.statuses = [
          { category: 'sortOrder', name: 'Received', value: 'received' },
          { category: 'sortOrder', name: 'Pending', value: 'pending' },
          { category: 'sortOrder', name: 'Rejected', value: 'rejected' },
          { category: 'sortOrder', name: 'Soft Rejection', value: 'soft_rejection' },
          { category: 'sortOrder', name: 'Revise', value: 'revise' },
          { category: 'sortOrder', name: 'Pulled by User', value: 'userPulled' },
          { category: 'sortOrder', name: 'Pulled by Admin', value: 'adminPull' },
          { category: 'sortOrder', name: 'Accepted', value: 'accepted' },
          { category: 'sortOrder', name: 'Published', value: 'published' }
        ].map(function(status) {
          return { status: status };
        });
      },

      // listStatusesforUser: function listStatuses() {
      //   return this.statuses = [
      //     { category: 'sortOrder', name: 'Received', value: 'received' },
      //     { category: 'sortOrder', name: 'Pending', value: 'pending' },
      //     { category: 'sortOrder', name: 'Rejected', value: 'rejected' },
      //     { category: 'sortOrder', name: 'Soft Rejection', value: 'soft_rejection' },
      //     { category: 'sortOrder', name: 'Revise', value: 'revise' },
      //     { category: 'sortOrder', name: 'Pulled by User', value: 'userPulled' },
      //     { category: 'sortOrder', name: 'Pulled by Admin', value: 'adminPull' },
      //     { category: 'sortOrder', name: 'Accepted', value: 'accepted' },
      //     { category: 'sortOrder', name: 'Published', value: 'published' }
      //   ].map(function(status) {
      //     return { status: status };
      //   });
      // },

      listCategories: function listCategories() {
        return this.categories = [
          { category: 'sortOrder', name: 'Essay', value: 'essay' },
          { category: 'sortOrder', name: 'Multimedia', value: 'multimedia' },
          { category: 'sortOrder', name: 'Video', value: 'video' },
          { category: 'sortOrder', name: 'Audio', value: 'audio' },
          { category: 'sortOrder', name: 'Photography', value: 'photography' },
          { category: 'sortOrder', name: 'This Was Here', value: 'this-was-here' }
        ].map(function (category) {
          return { category: category }
        });
      },

      listProjectSorts: function listProjectSorts() {
        return this.projectSorts = [
          { category: 'sortOrder', name: 'Date Submitted', value: 'createdOn' },
          { category: 'sortOrder', name: 'Title', value: 'title' },
          { category: 'sortOrder', name: 'Author Name', value: 'user.lastName' },
          { category: 'sortOrder', name: 'Submission Status', value: 'status' }
        ].map(function (projectSort) {
          return { projectSort: projectSort }
        });
      },

      listFeaturedProjects: function featuredProjects() {
        return this.featuredProjects = [
          { category: 'sortOrder', name: 'Featured', value: 'true' },
          { category: 'sortOrder', name: 'Not Featured', value: 'false' }
        ].map(function (featuredProject) {
          return { featuredProject }
        });
      },

      listYesNo: function listYesNo() {
        return this.yesNo = [
          { category: 'sortOrder', name: 'Yes', value: 'true' },
          { category: 'sortOrder', name: 'No', value: 'false' }
        ].map(function (yesNo) {
          return { yesNo }
        });
      }

    };
  }

  return getLists;

}());
