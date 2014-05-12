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
		clickMe: function() {
			var data = this.get('store').find('sight', 0);
			console.log(data.name);
		}
	}
});

App.NewsightController = Ember.ObjectController.extend({
	sight: {
		name: "",
		address: ""
	}
});
