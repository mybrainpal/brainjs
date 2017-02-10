/**
 * Proudly created by ohad on 10/02/2017.
 *
 * Copyright (c) 2016 Anton Antonov.
 */
const Promise   = require('bluebird'),
      PropTypes = require('prop-types'),
      pick      = require('lodash').pick,
      merge     = require('lodash').merge,
      gcs       = require('@google-cloud/storage'),
      path      = require('path');

const recursive = Promise.promisify(require('recursive-readdir'));

module.exports = class WebpackGoogleCloudStoragePlugin {
  static get schema() {
    return {
      directory     : PropTypes.string,
      include       : PropTypes.array,
      exclude       : PropTypes.array,
      storageOptions: PropTypes.object.isRequired,
      uploadOptions : PropTypes.shape({
                                        bucketName       : PropTypes.string.isRequired,
                                        forceCreateBucket: PropTypes.bool,
                                        gzip             : PropTypes.bool,
                                        destinationNameFn: PropTypes.func,
                                      }),
    };
  }

  static get ignoredFiles() {
    return ['.DS_Store'];
  }

  static defaultDestinationNameFn(file) {
    return file.path;
  }

  static getAssetFiles({assets}) {
    const files = assets.map((value, name) => ({name, path: value.existsAt}));
    return Promise.resolve(files);
  }

  static handleErrors(error, compilation, cb) {
    compilation.errors.push(
      new Error(`WebpackGoogleCloudStoragePlugin: ${error.stack}`)
    );
    cb();
  }

  constructor(options = {}) {
    PropTypes.validateWithErrors(this.constructor.schema,
                                 options,
                                 'WebpackGoogleCloudStoragePlugin');

    this.isConnected = false;

    this.storageOptions                  = options.storageOptions;
    this.uploadOptions                   = options.uploadOptions;
    this.uploadOptions.destinationNameFn = this.uploadOptions.destinationNameFn ||
                                           this.constructor.defaultDestinationNameFn;

    this.options = pick(options,
                        [
                          'directory',
                          'include',
                          'exclude',
                          'basePath',
                        ]);

    this.options.exclude = this.options.exclude || [];
  }

  connect() {
    if (this.isConnected) {
      return;
    }

    this.client = gcs(merge(this.storageOptions, {
      promise: Promise,
    }));

    this.isConnected = true;
  }

  filterFiles(files) {
    return Promise.resolve(files.filter(file =>
                                        this.isIncluded(file.name) && !this.isExcluded(file.name) &&
                                        !this.isIgnored(file.name)
                           )
    );
  }

  isIncluded(fileName) {
    return this.options.include.some(include => fileName.match(new RegExp(include)));
  }

  isExcluded(fileName) {
    return this.options.exclude.some(exclude => fileName.match(new RegExp(exclude)));
  }

  isIgnored(fileName) {
    return this.constructor.ignoredFiles.some(
      ignoredFile => fileName.match(new RegExp(ignoredFile))
    );
  }

  handleFiles(files) {
    return this.filterFiles(files)
               .then(filteredFiles => this.uploadFiles(filteredFiles));
  }

  apply(compiler) {
    this.connect();

    // NOTE: Use specified directory, webpack.config.output or current dir.
    this.options.directory = this.options.directory ||
                             compiler.options.output.path ||
                             compiler.options.output.context ||
                             '.';

    compiler.plugin('after-emit', (compilation, cb) => {
      if (this.options.directory) {
        recursive(this.options.directory, this.options.exclude)
          .then(files => files.map(f => ({name: path.basename(f), path: f})))
          .then(files => this.handleFiles(files))
          .then(() => cb())
          .catch(e => this.constructor.handleErrors(e, compilation, cb));
      } else {
        this.constructor.getAssetFiles(compilation)
            .then(files => this.handleFiles(files))
            .then(() => cb())
            .catch(e => this.constructor.handleErrors(e, compilation, cb));
      }
    });
  }

  uploadFiles(files = []) {
    const uploadOptions = this.uploadOptions;
    const bucket      = this.client.bucket(uploadOptions.bucketName);
    const uploadFiles = files.map(
      file =>
        bucket.upload(file.path, {
          destination: uploadOptions.destinationNameFn(file),
          gzip       : uploadOptions.gzip || false
        }, function (err, newFile) {
          if (err) {
            console.error('Failed to upload ' + file.path +
                          ' because ' + err.toString());
          } else {
            console.log('Uploaded ' + file.path);
            if (uploadOptions.makePublic) {
              newFile.makePublic();
            }
          }
        }));
    return Promise.all(uploadFiles);
  }
};
