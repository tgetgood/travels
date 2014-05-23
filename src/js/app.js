'use strict';

///// Extensions to Ember itself
//=================================
 
// Taken from: https://gist.github.com/mehulkar/3232255.
// No license specified...
Ember.ArrayProxy.prototype.flatten = Array.prototype.flatten = function() {
    var r = [];
    this.forEach(function(el) {
	r.push.apply(r, Ember.isArray(el)  ? el.flatten() : [el]);
    });
    return r;
};

// Global settings
// ===============================

Ember.TextSupport.reopen({
    attributeBindings: ['multi']
});

DS.RESTAdapter.reopen({
  namespace: 'api'
});



var App = Ember.Application.create();

// Models
//================================

App.Photo = DS.Model.extend({
	link:    DS.attr("string"),
	created: DS.attr("date"),
	flagship: DS.attr("boolean"),
	sight:   DS.belongsTo("sight")
});
	

App.Sight = DS.Model.extend({
	name:            DS.attr("string"),
	address:         DS.attr("string"),
	description:     DS.attr("string"),
	location:        DS.attr("string"),
	geocoordinates:  DS.attr("string"),
	photos:          DS.hasMany('photo', {inverse: 'sight', type: 'number'})
});

// App
//=================================

App.Router.map(function () {
	this.route("navigate");
	
	this.resource('sights', function () {
		this.resource('sight', { path: "/:sight_id" });
		this.route('edit');
	});
	this.route("newsight", { path: "sights/new" });
});

// Navigate
//====================================================================

App.NavigateController = Ember.ArrayController({
	queryParams: ['location'],
	location: null,
	activeImages: []
});





// New Sight
//====================================================================

App.NewsightRoute = Ember.Route.extend({
	actions: {
		save: function () {
			var unfinished = this.controller.get("photo_uploads").
				filter(function (item, i, elem) {
					return !item.get("done");
			});
			
			console.log(unfinished);
			if (unfinished.length > 0) {
				alert("Please wait for image uploads.");
				return;
			}
			
			var app = this;
			
			var sight = this.get('store').
				createRecord('sight', this.controller.sight).
				save().
				then(function (sight) {
					var photosToStore = app.controller.get("photo_uploads").
						filter(function (item, i, elem) {
							return (item.send && item.link !== "");
						}).map(function (item, i, elem) {
							return app.get('store').
								createRecord('photo', elem).
								save().then(function (photo) {
									sight.get("photos").addObject(photo);
								});
						});

					Promise.all(photosToStore).then(function (res) {
						sight.save();
					});
				});
		}
	}
});


App.NewsightController = Ember.ObjectController.extend({
	photo_uploads: [],
	sight: {
	 // photos: []
	}
});

App.NewsightView = Ember.View.extend({
	templateName: "newsight",
	didInsertElement: function () {
		var app = this;

		$("#more-images").change(function(evt) {
			evt.preventDefault();
			var file = this.files[0];
			var name = file.name;
			var size = file.size;
			var type = file.type;
/*
			if(file.name.length < 1) {
				alert("Empty filename.");
				$(this).val('');
				return -1;
			}
			else if(file.size > 100000) {
        alert("File is to big");
				$(this).val('');
				return -1;
			}
			else if(file.type != 'image/png' &&
							file.type != 'image/jpg' &&
							!file.type != 'image/gif' &&
							file.type != 'image/jpeg' ) {

				alert("We only accept png, jpg, and gif files.");
				$(this).val('');
				return -1;
			}
*/
			// Add photo descriptor to view
			
			var image = Ember.Object.create({
				pip: Array(0),
				togo: Array(10),
				flagship: false,
				send: true,
				name: name,
				show: true,
				link: "",
				done: false,
			});

			// Using set forces the UI to update.
			app.controller.set('photo_uploads', app.controller.get('photo_uploads').concat(image));
			
			$.ajax({
        url: '/fileupload',  
        type: 'POST',
        xhr: function() {  
          myXhr = $.ajaxSettings.xhr();
          if(myXhr.upload){ 
            myXhr.upload.addEventListener('progress', function(pro) {
							var feedback = Math.floor(pro.position / pro.totalSize) * 10;

							if (isNaN(feedback) || Ember.typeOf(feedback) !== "number") {
								return;
							}
							// Ghetto progress bar
							image.set("pip", Array(Math.max(0, feedback)));
							image.set("togo",  Array(Math.max(0, 10 - feedback)));
						}, false); 
          }
          return myXhr;
        },
        //Ajax events
        success: completeHandler = function(data) {
					var link = data.file.url;
					image.set("link", link);
					image.set("done", true);
        },
        error: errorHandler = function() {
					image.set("show", false);
					image.set("send", false);
					image.set("done", true);
        },
        data: file,
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
      }, 'json');
			
			$(this).val('');
		});
	}
});

