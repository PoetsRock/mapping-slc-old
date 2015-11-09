/**
 * Created by poetsrock on 11/13/14.
 */

module.exports = {

    alchemyKey: '9eb2296b11f66a08cb20ef6771bbe32b523a0840',

    //US Census API Key
    censusKey: '4d396163ae90829a66916a08b3af462608c87316',

    //Cloudinary
    cloudinaryKey: '176182552531851',
    cloudinarySecret: 'bAHO5GflAOEIAW4SbZRzmaxMKok',

    emailKey: '',
    emailAddress: 'christanseer@hotmail.com',

    krakenKey: 'cd5c43377c25aa4fb43e6db37c408df7',
    krakenSecret: '3a876e48662689c42f85bae1a7c1a6bba936dbfd',

    //geocoding api via http://developer.here.com
    hereKey: 'p2ylB3rWtlPf8qVLBeCs',
    hereSecret: 'lQ16v8NyFSQ00RpaH3CMMg',

    //geolocated places and businesses apis
    instagramKey: 'c9a2f3de6eea4f3d9a16b65954f0f138',
    instagramSecret: 'e8b738fec3494c0987859aa78d1f0956',

    fourSquareKey: 'ANGO23TGLHZJUIIRTFCYBRHF03TNRVI5L0RPPUUMGDYODCTK',
    fourSquareSecret: 'CLXAKGVLEAFGNQSW1K5P4CCQVTXPWF3UZ0GKICKW2CRLX2EI',

/**
 *   Mapbox mapping service api via https://www.mapbox.com/mapbox.js/api/v1/v2.1.4/
 *   Mapbox sits on top of Leaflet.js @ http://leafletjs.com/reference.html
 *   Leaflet.js in turn is the main js library for Open Street Maps
**/
    mapboxSecret: 'pk.eyJ1IjoicG9ldHNyb2NrIiwiYSI6Imc1b245cjAifQ.vwb579x58Ma-CcnfQNamiw',
    mapboxKey: 'poetsrock.map-55znsh8b',

    //todo need to pull thses out of here; won't be available on production server
    mapboxMaps: {
        'grayMap': 'L.mapbox.tileLayer(\'poetsrock.b06189bb\')',
        'mainMap': 'L.mapbox.tileLayer(\'poetsrock.la999il2\')',
        'topoMap': 'L.mapbox.tileLayer(\'poetsrock.la97f747\')',
        'greenMap': 'L.mapbox.tileLayer(\'poetsrock.jdgpalp2\')',
        'landscape': 'L.tileLayer(\'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png\')',
        'watercolor': 'L.tileLayer(\'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png\')'
    },

    s3Id: 'AKIAJNURVYVK3YRNKLCA',
    s3Secret: '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',

    yelpKey: 'if7aWpJFqEcJ6q8tM-Y9qQ',
    yelpSecret: 'FZU4zSc-S3NJgI_aKm2O0_4ym6c',

    vimeoKey: '6565bb005d7bffac18d89cbc4ef57af1bccde906',
    vimeoSecret: 'V7h0cZTU0VqBDjYdnAoBmuJb1/XoQzPQJ09NB9uSit6M8LJnt10bDwO7EQFbs9RbMM2Yruo/UZEeVSuG7dMNZW+W+950+Iny/31V5AJ9pokT6Gezzto3R8qnp0mO6NTs',
    vimeoToken: 'a72958bf1f855bd7c58f3a354953c183',


    //social media accounts
    facebookKey: '319019724936363',
    facebookSecret: '3ebfd75fff26823c6ab3f462c7060af0',
    twitterKey: '8CcbaDkZ6P5U4AsCyDFpqI2sI',
    twitterSecret: 'pNt4bKHblud2TmbqGElP8LkLC9PvyjSa9hdLhk35NmTD9BKzfc',
    googleKey: 'AIzaSyD3yA-DyCpAJnbwQ0p0jbAZSpSg0dzPpvE',
    googleServerKey: 'AIzaSyBZ63pS3QFjYlXuaNwPUTvcYdM-SGRmeJ0',
    googleSecret: 'PY2QWsCLXHVr5bTAEd_w92sI',
    linkedInKey: '75g2nxzppxpqjs',
    linkedInSecret: 'jNbubafbNyfVN4F7'

};
