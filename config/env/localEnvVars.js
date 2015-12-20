if (process.env === 'local' || process.env === 'local-development' || process.env === 'development') {

  process.env['CENSUS_KEY'] = '4d396163ae90829a66916a08b3af462608c87316';

  process.env['HERE_KEY'] = 'p2ylB3rWtlPf8qVLBeCs';
  process.env['HERE_SECRET'] = 'lQ16v8NyFSQ00RpaH3CMMg';

  process.env['MAPBOX_KEY'] = 'pk.eyJ1IjoicG9ldHNyb2NrIiwiYSI6Imc1b245cjAifQ.vwb579x58Ma-CcnfQNamiw';
  process.env['MAPBOX_SECRET'] = 'poetsrock.map-55znsh8b';

  process.env['VIMEO_KEY'] = '';
  process.env['VIMEO_KEY'] = '';
  process.env['VIMEO_KEY'] = '';

  process.env['SOUNDCLOUD_KEY'] = '';
  process.env['SOUNDCLOUD_KEY'] = '';

}

console.log('process.env[\'MAPBOX_KEY\']: ', process.env['MAPBOX_KEY']);
