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

Ember.TextSupport.reopen({
    attributeBindings: ['multi']
});

// App
//=================================

var App = Ember.Application.create();

DS.RESTAdapter.reopen({
  namespace: 'api'
});

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

App.Router.map(function () {
	this.resource('sights', function () {
		this.resource('sight', { path: "/:sight_id" });
		this.route('edit');
	});
	this.route("newsight", { path: "sights/new" });
});


App.NewsightRoute = Ember.Route.extend({
	actions: {
		save: function () {
			var that = this;
			var sight = this.get('store').
				createRecord('sight', this.controller.sight).
				save().
				then(function (sight) {
					sight.photos = [];
					var p = that.get('store').createRecord('photo', {
						primary: true, link:"first", sight:sight});
					
					sight.get("photos").addObject(p);
					
					p.save().then(function (p) {
						//						sight.photos.push(p);
						//					sight.get("photos").addObject(p);
						
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
			
			var image = {
				pip: Array(0),
				togo: Array(10),
				flagship: false,
				send: true,
				name: name
			};

			// Using set forces the UI to update.
			app.controller.set('photo_uploads', app.controller.get('photo_uploads').concat(image));
			
      var formData = new FormData($('#more-images')[0]);

			$.ajax({
        url: 'script',  //server script to process data
        type: 'POST',
        xhr: function() {  // custom xhr
          myXhr = $.ajaxSettings.xhr();
          if(myXhr.upload){ // if upload property exists
            myXhr.upload.addEventListener('progress', function(pro) {
							console.log(pro);
						}, false); // progressbar
          }
          return myXhr;
        },
        //Ajax events
        success: completeHandler = function(data) {
					var link = data.file.link;
					image.link = link;
					image.done = true;
        },
        error: errorHandler = function() {
          alert("Computer says no.");
        },
        // Form data
        data: formData,
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
      }, 'json');
			
			$(this).val('');
		});
	}
});

