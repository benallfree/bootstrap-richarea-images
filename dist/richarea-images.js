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
	var assetRoot = parser.href.replace(/\/[^\/]+$/, "");

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
	          isCropperInitialized: false,
	          $modal: null,
	          $editor: null,
	          $root: null,
	          $referenceImage: null,
	          $fileInput: null,
	          shouldSave: false
	        },
	        computed: {
	          field: function field() {
	            return this.item.data[this.fieldName];
	          }
	        },
	        methods: {
	          showBsModal: function showBsModal() {
	            if (this.isCropperInitialized) return;
	            this.$editor.invisible();
	          },
	          shownBsModal: function shownBsModal() {
	            if (this.isCropperInitialized) return;
	            var w = Math.floor(this.$referenceImage.actual('width'));
	            var h = Math.floor(this.$referenceImage.actual('height'));
	            this.$editor.cropit({
	              exportZoom: this.$referenceImage.get(0).naturalWidth / w,
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
	              onImageLoaded: this.onImageLoaded,
	              onZoomChange: this.onZoomChange,
	              onOffsetChange: this.onOffsetChange
	            });
	            this.$editor.cropit('imageSrc', this.field.originalImage);
	          },
	          hideBsModal: function hideBsModal() {
	            var _this2 = this;

	            if (!this.config.editors.ImageEditor.uploadUrl) return;
	            if (!this.shouldSave) return;
	            $.post(this.config.editors.ImageEditor.uploadUrl, {
	              data: this.$editor.cropit('export')
	            }, function (data, status) {
	              console.log([data, status]);
	              if (status == 'success' && data.status == 'success') {
	                _this2.field.croppedImage = data.url;
	              }
	            });
	          },
	          onImageLoaded: function onImageLoaded() {
	            var _this3 = this;

	            if (!this.isCropperInitialized) {
	              var zoom = this.field.zoom == null ? this.$referenceImage.actual('width') / this.$referenceImage.get(0).naturalWidth : this.field.zoom;
	              this.$editor.cropit('zoom', zoom);
	              this.$editor.cropit('offset', this.field.offset);
	              this.isCropperInitialized = true;
	              this.$editor.visible();
	            } else {
	              (function () {
	                _this3.shouldSave = true;
	                var file = _this3.$fileInput.get(0).files[0];
	                var fr = new FileReader();
	                fr.onload = function () {
	                  if (!_this3.config.editors.ImageEditor.uploadUrl) return;
	                  $.post(_this3.config.editors.ImageEditor.uploadUrl, {
	                    data: fr.result
	                  }, function (data, status) {
	                    console.log([data, status]);
	                    if (status == 'success' && data.status == 'success') {
	                      _this3.field.originalImage = data.url;
	                      _this3.field.croppedImage = data.url;
	                    }
	                  });
	                };
	                fr.readAsDataURL(file);
	                _this3.field.croppedImage = _this3.$editor.cropit('export');
	              })();
	            }
	          },
	          onZoomChange: function onZoomChange() {
	            if (!this.isCropperInitialized) return;
	            this.shouldSave = true;
	            this.field.zoom = this.$editor.cropit('zoom');
	            this.field.croppedImage = this.$editor.cropit('export');
	          },
	          onOffsetChange: function onOffsetChange() {
	            if (!this.isCropperInitialized) return;
	            this.shouldSave = true;
	            var o = this.$editor.cropit('offset');
	            this.field.offset = { x: Math.floor(o.x), y: Math.floor(o.y) };
	            this.field.croppedImage = this.$editor.cropit('export');
	          }
	        },
	        mounted: function mounted() {
	          this.$root = $(this.$el);
	          this.$modal = this.$root.closest('.modal');
	          this.$editor = this.$root.find('.image-editor');
	          this.$referenceImage = this.$editor.find('.reference');
	          this.$fileInput = this.$editor.find('[type=file]');
	          this.$modal.on('show.bs.modal', this.showBsModal);
	          this.$modal.on('shown.bs.modal', this.shownBsModal);
	          this.$modal.on('hide.bs.modal', this.hideBsModal);
	        },

	        beforeDestroy: function beforeDestroy() {
	          this.$modal.off('show.bs.modal', this.showBsModal);
	          this.$modal.off('shown.bs.modal', this.shownBsModal);
	          this.$modal.off('hide.bs.modal', this.hideBsModal);
	        }

	      };
	    }
	  }]);

	  return ImageEditor;
	}(RichAreaBaseEditor);

	module.exports = ImageEditor;

/***/ }
/******/ ]);