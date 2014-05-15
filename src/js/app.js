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

// App
//=================================

var App = Ember.Application.create();

DS.RESTAdapter.reopen({
  namespace: 'api'
});

App.Sight = DS.Model.extend({
	name:            DS.attr("string"),
	address:         DS.attr("string") //,
//	description:     DS.attr("string"),
//	location:        DS.attr("string"),
//	flagship_photo:  DS.attr("string")
});

App.Router.map(function () {
	this.resource('sights', function () {
		this.resource('sight', { path: "/:sight_id" });
		this.resource('edit');
	});
	this.resource("newsight", { path: "sights/new" });
});


App.NewsightRoute = Ember.Route.extend({
	actions: {
		save: function () {
			this.get('store').
				createRecord('sight', this.controller.sight).
				save();
		},
		addImage: function (path) {
			this.controller.addPhoto(path);
			this.controller.resetCurrentImage();
		}
	}
});

App.NewsightController = Ember.ObjectController.extend({
	sight: {
		additional_photos: [{path:"testy"}]
	},
	current_image: "",
	resetCurrentImage: function () {
		this.set("current_image", "");
	},
	addPhoto: function (path) {
		this.sight.additional_photos.push({path:path});
		this.set('sight', this.sight);
		console.log(this.sight);
	}
});
