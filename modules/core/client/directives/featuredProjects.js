'use strict';

angular.module('core').directive('featuredProjects', function() {
        return {
            restrict: 'E',
            templateUrl: '/modules/core/client/directives/views/featured-projects.html'

//            controller: function() {
//              document.getElementById('photo-3').onload = function() {
//              var c=document.getElementById('inverse-photo-3');
//              var ctx=c.getContext('2d');
//              var img=document.getElementById('photo-3');
//              ctx.drawImage(img,0,0);
//              var imgData=ctx.getImageData(0,0,c.width,c.height);
//// invert colors
//              for (var i=0;i<imgData.data.length;i+=4)
//              {
//                imgData.data[i]=255-imgData.data[i];
//                imgData.data[i+1]=255-imgData.data[i+1];
//                imgData.data[i+2]=255-imgData.data[i+2];
//                imgData.data[i+3]=255;
//              }
//              ctx.putImageData(imgData,0,0);
//
//                //<canvas id="inverse-photo-3" width="220" height="277" style="border:1px solid #d3d3d3;" class="desaturate">
//                //  Your browser does not support the HTML5 canvas tag.</canvas>
//
//            }
//          }


        };
    });
