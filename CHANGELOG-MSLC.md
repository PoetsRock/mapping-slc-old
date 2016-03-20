# Overview of Changes and Updates for Mapping SLC

<a name="0.4.2"></a>
## 0.4.2 (2016-03-20)

###Features Added

####File Uploading
* added file uploading to project creation and allowed for uploading multiple files


###Changes
* edited `project.server.model.js`:
    * remove `mainImage` and `mainImgThumbnail` fields
    * added following fields:
        * `mainImageUrl`
        * `mainImageEtag`
        * `mainImageThumbnailUrl`
        * `mainImageThumbnailEtag`
        * `imageGallery`
        * `imageGalleryEtags`
        

###To Do

####Back end Uploading
* image optimization
* create and optimize thumbnails
* create separate function for uploading documents
* decide whether to handle the logic for determining image vs document on front end or back end
    * if handled on front end, could create a new end point for uploading documents

####Front end Uploading
* create logic for handling non-image files
* disable file uploading for video
* find out at what size i should limit uploading, based on s3 pricing
* disable file uploading when total upload size is greater determined size
* add CAPTCHA to all forms and uploads
    * probably not immediately critical since most forms require a user to be signed in
