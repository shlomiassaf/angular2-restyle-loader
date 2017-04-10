const reMeta = require('../../loader/angular2-restyle-loader');

const config = {
  context: __dirname,
  components: [
    {
      selector: 'md-slide-toggle, mat-slide-toggle',
      template: reMeta.uri('./slide-toggle/slide-toggle.html'),
      styles: [
        '.some { position: relative; }',
        reMeta.uri('./slide-toggle/slide-toggle.scss')
      ]
    }
  ]
};

module.exports = config;
