(function($)
{
  $.Redactor.prototype.imagemanager = function()
  {
    return {
      langs: {
        en: {
          "upload": "Upload",
          "choose": "Choose"
        }
      },
      init: function()
      {
        if (!this.opts.imageManagerJson)
        {
          console.log('problem -- no imageManagerJson data');
          return;
        }
        console.log('\n\nthis.opts.imageManagerJson\n', this.opts.imageManagerJson, '\n\n');
        this.modal.addCallback('image', this.imagemanager.load);
      },
      load: function()
      {
        console.log('this.modal.addCallback(image, this.imagemanager.load)\n', this.modal.addCallback('image', this.imagemanager.load));
        var $box = $('<div style="overflow: auto; height: 300px; display: none;" class="redactor-modal-tab" data-title="Choose">');
        this.modal.getModal().append($box);

        $.ajax({
          dataType: "json",
          cache: false,
          url: this.opts.imageManagerJson,
          success: $.proxy(function(data)
          {
            console.log('success:: data', data);
            $.each(data, $.proxy(function(key, val)
            {
              // title
              var thumbtitle = '';
              if (typeof val.title !== 'undefined')
              {
                thumbtitle = val.title;
              }

              var img = $('<img src="' + val.thumb + '"  data-params="' + encodeURI(JSON.stringify(val)) + '" style="width: 100px; height: 75px; cursor: pointer;" />');
              $box.append(img);
              $(img).click($.proxy(this.imagemanager.insert, this));

            }, this));

          }, this)
        })
        .done(function(data){
          console.log('data: ', data);
        })
        .fail(function(err){
          console.log('err: ', err);
        });
      },
      insert: function(e)
      {
        var $el = $(e.target);
        var json = $.parseJSON(decodeURI($el.attr('data-params')));

        this.image.insert(json, null);
      }
    };
  };
})(jQuery);


// (function ($) {
//   $.Redactor.prototype.imagemanager = function () {
//     return {
//       langs: {
//         en: {
//           'upload': 'Upload',
//           'choose': 'Choose'
//         }
//       },
//       init: function () {
//         if (!this.opts.imageManagerJson) {
//           return;
//         }
//         var button = this.button.addAfter('lists', 'image', this.lang.get('image'));
//         this.button.addCallback(button, this.imagemanager.show);
//         this.modal.addCallback('image', this.imagemanager.load);
//       },
//       load: function () {
//         console.log('here!!');
//         var $box = $('<div style="overflow: auto; height: 300px; display: none;" class="redactor-modal-tab" data-title="Choose">');
//         this.modal.getModal().append($box);
//
//         /**
//          *
//          *
//          * is it possible to substitute this ajax call for an angular uploader?
//          *
//          */
//         $.ajax({
//           dataType: 'json',
//           cache: false,
//           // url: this.opts.imageManagerJson,
//           // url: '/api/v1/projects/' + project._id + '/s3/upload',
//           url: '/api/v1/projects/5662bca75312bbd5796b7923/s3/upload',
//           beforeSend: function() {
//             "use strict";
//             console.log('before send');
//           },
//           success: $.proxy(function (data) {
//             console.log('success:: data', data);
//             $.each(data, $.proxy(function (key, val) {
//               // title
//               var thumbtitle = '';
//               if (typeof val.title !== 'undefined') {
//                 thumbtitle = val.title;
//               }
//
//               var img = $('<img src="' + val.thumb + '"  data-params="' + encodeURI(JSON.stringify(val)) + '" style="width: 100px; height: 75px; cursor: pointer;" />');
//               $box.append(img);
//               $(img).click($.proxy(this.imagemanager.insert, this));
//
//             }, this));
//           }, this)
//         })
//         .fail(function(err){
//           "use strict";
//           console.log('err: ', err);
//         });
//
//       },
//       insert: function (e) {
//         var $el = $(e.target);
//         var json = $.parseJSON(decodeURI($el.attr('data-params')));
//
//         this.image.insert(json, null);
//       }
//     };
//   };
// })(jQuery);
