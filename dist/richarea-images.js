/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var scripts = document.getElementsByTagName("script"),
	    src = scripts[scripts.length - 1].src;
	var parser = document.createElement('a');
	parser.href = src;
	var assetRoot = parser.pathname.replace(/\/richarea-images.js/, "");

	RichArea.registerEditor(__webpack_require__(1), {
	  assetRoot: assetRoot
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ImageEditor = function (_RichAreaBaseEditor) {
	  _inherits(ImageEditor, _RichAreaBaseEditor);

	  function ImageEditor() {
	    _classCallCheck(this, ImageEditor);

	    return _possibleConstructorReturn(this, (ImageEditor.__proto__ || Object.getPrototypeOf(ImageEditor)).apply(this, arguments));
	  }

	  _createClass(ImageEditor, null, [{
	    key: 'initField',
	    value: function initField(field, layout, options) {
	      field.defaultValue.originalImage = options.editors.ImageEditor.assetRoot + field.defaultValue.originalImage;
	      field.defaultValue.croppedImage = options.editors.ImageEditor.assetRoot + field.defaultValue.croppedImage;
	    }
	  }, {
	    key: 'getVueData',
	    value: function getVueData() {
	      return {
	        props: ['item', 'fieldName', 'config'],
	        template: '\n        <div>\n          <div :data-field="fieldName" class="image-editor">\n            <input accept="image/gif,image/png,image/jpeg" class="cropit-image-input" type="file"></input>\n            <img :src="item.data[fieldName].croppedImage" class="reference" style="width:100%; display: none"/>\n            <div class="cropit-preview"></div>\n            <input class="cropit-image-zoom-input" type="range"></input>\n          </div>\n        </div>\n      ',
	        data: {
	          isCropperInitialized: false
	        },
	        computed: {
	          field: function field() {
	            return this.item.data[this.fieldName];
	          }
	        },
	        mounted: function mounted() {
	          var _this2 = this;

	          var $el = $(this.$el);
	          var $modal = $el.closest('.modal');
	          $modal.on('show.bs.modal', function () {
	            if (_this2.isCropperInitialized) return;
	            $modal.find('.image-editor').invisible();
	          });
	          $modal.on('shown.bs.modal', function () {
	            if (_this2.isCropperInitialized) return;

	            var $e = $el.find('.image-editor');
	            var $r = $e.find('.reference');
	            var w = Math.floor($r.actual('width'));
	            var h = Math.floor($r.actual('height'));
	            var shouldSave = false;
	            $e.cropit({
	              exportZoom: $r.get(0).naturalWidth / w,
	              imageBackground: false,
	              imageBackgroundBorderWidth: 0,
	              initialZoom: 'image',
	              width: w,
	              height: h,
	              maxZoom: 5,
	              onFileReadError: function onFileReadError() {
	                console.log('onFileReadError', arguments);
	              },
	              onImageError: function onImageError() {
	                console.log('onImageError', arguments);
	              },
	              smallImage: 'allow', // Allow images that must be zoomed to fit
	              onImageLoaded: function onImageLoaded() {
	                if (!_this2.isCropperInitialized) {
	                  $e.cropit('zoom', _this2.field.zoom);
	                  $e.cropit('offset', _this2.field.offset);
	                  _this2.isCropperInitialized = true;
	                  $modal.find('.image-editor').visible();
	                } else {
	                  shouldSave = true;
	                  var $fileInput = $e.find('[type=file]');
	                  var file = $fileInput.get(0).files[0];
	                  fr = new FileReader();
	                  fr.onload = function () {
	                    if (!_this2.config.imageUploadUrl) return;
	                    $.post(_this2.config.imageUploadUrl, {
	                      data: fr.result
	                    }, function (data, status) {
	                      console.log([data, status]);
	                      if (status == 'success' && data.status == 'success') {
	                        _this2.field.originalImage = data.url;
	                        _this2.field.croppedImage = data.url;
	                      }
	                    });
	                  };
	                  fr.readAsDataURL(file);
	                  _this2.field.croppedImage = $e.cropit('export');
	                }
	              },
	              onZoomChange: function onZoomChange() {
	                if (!_this2.isCropperInitialized) return;
	                shouldSave = true;
	                _this2.field.zoom = $e.cropit('zoom');
	                _this2.field.croppedImage = $e.cropit('export');
	              },
	              onOffsetChange: function onOffsetChange() {
	                if (!_this2.isCropperInitialized) return;
	                shouldSave = true;
	                var o = $e.cropit('offset');
	                _this2.field.offset = { x: Math.floor(o.x), y: Math.floor(o.y) };
	                _this2.field.croppedImage = $e.cropit('export');
	              }
	            });
	            $e.cropit('imageSrc', _this2.field.originalImage);

	            $modal.on('hide.bs.modal', function () {
	              if (!shouldSave) return;
	              if (!_this2.config.imageUploadUrl) return;
	              $.post(_this2.config.imageUploadUrl, {
	                data: $e.cropit('export')
	              }, function (data, status) {
	                console.log([data, status]);
	                if (status == 'success' && data.status == 'success') {
	                  _this2.field.croppedImage = data.url;
	                }
	              });
	            });
	          });
	        }
	      };
	    }
	  }]);

	  return ImageEditor;
	}(RichAreaBaseEditor);

	module.exports = ImageEditor;

/***/ }
/******/ ]);