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
				save().then(function (sight) {
					sight.photos = [];
					var p = that.get('store').createRecord('photo', {
						primary: true, link:"first", sight:sight});

					sight.get("photos").addObject(p);

					p.save().then(function (p) {
						//						sight.photos.push(p);
						//					sight.get("photos").addObject(p);
				
						sight.save();
					});
				// var p2 = that.get('store').createRecord('photo', {
				// 	primary:false, link:"second", sight:sight});
				
				// p2.save();
				// sight.get("photos").addObject(p2);
				

				
				});
		}
	}
});

App.NewsightController = Ember.ObjectController.extend({
	sight: {
	 // photos: []
	}
});
