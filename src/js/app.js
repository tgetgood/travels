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

App.Location = DS.Model.extend({
	name:    DS.attr("string"),
	address: DS.attr("string")
});

App.Router.map(function () {
	this.resource('locations', function () {
		this.resource('location', { path: "/:location_id" });
		this.resource('edit');
	});
	this.resource("newlocation", { path: "locations/new" });
});


App.NewlocationRoute = Ember.Route.extend({
	actions: {
		save: function () {
			this.get('store').
				createRecord('location', this.controller.location).
				save();
		},
		clickMe: function() {
			var data = this.get('store').find('location', 1);
			console.log(data.name);
		}
	}
});

App.NewlocationController = Ember.ObjectController.extend({
	location: {
		name: "",
		address: ""
	}
});
