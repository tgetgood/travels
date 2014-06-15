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

var App = Ember.Application.create();

// Models
//================================


// App
//=================================

App.Router.map(function () {
	this.route("navigate", { path: "/navigate/:location" });
	
	this.resource('sights', function () {
		this.resource('sight', { path: "/:sight_id" });
		this.route('edit');
	});
	this.route("newsight", { path: "sights/new" });
});

// Navigate
//====================================================================

var clientID = "4a6a3fb4b8464bfe9098d1e901d2aa6e"

var getLocationTags = function (loc) {
	return ["marinedrive", "gatewaytoindia"];
}

var appendAuth = function (url) {
	var res = url;
	if (url.indexOf("?") !== -1) {
		res = res + "&";
	}
	else {
		res = res + "?";
	}
		return res + "client_id=" + clientID;
};

var tagInfoURL = function (tag) {
	var baseURL = "https://api.instagram.com/v1/tags/";
	return appendAuth(baseURL + tag);
};

var getTagsURL = function (tag) {
	var url = "https://api.instagram.com/v1/tags/" + tag + "/media/recent";
	return appendAuth(url);
};

var getPostsForTag = function (tag) {
	
	return $.ajax(getTagsURL(tag), {
		type: "GET",
		"method": "GET",
		dataType: "jsonp",
		headers: {"Access-Control-Allow-Origin": "true"}
	}).then(function (data) {
		// Drop meta-data (will be used elsewhere...) and return only
		// those posts which are images.
		return data.data.filter(function(item) {
			return item.type = "image";
		});
	});
};				

var filterCaption = function (text) {
	return text.replace(/#[a-zA-Z-']+/g, "").trim();
}

App.NavigateRoute = Ember.Route.extend({
	model: function (params) {
		var app = this;
		var tags = getLocationTags(params.location);
		
		for (var i = 0; i < tags.length; i++) {
			var p = getPostsForTag(tags[i]);
			p.then(function (data) {
				var im = app.controller.get("all");
				app.controller.set("all", im.concat(data));
			});
		}
		return {};
	},
	actions: {
		drag: function (event) {
//			this.controller.set("description", event);
		},
		accept: function (post) {
			var a = this.controller.get("accepted");
			this.controller.set("accepted", a.concat([post]));
		},
		reject: function (post) {
			var r = this.controller.get("rejected");
			this.controller.set("rejected", r.concat([post]));
		}
	}
});

App.NavigateController = Ember.ObjectController.extend({
	accepted: [],
	acceptIDs: function () {
		return this.get("accepted").map(function (item) { return item.id; });
	}.property("accepted"),
	rejected: [],
	rejectIDs: function () {
		return this.get("rejected").map(function (item) { return item.id; });
	}.property("rejected"),
	all: [],
	current: function () {
		var all = this.get("all");

		if (all.length === 0) {
			return {};
		}
		
		var acids = this.get("acceptIDs");
		var rejids = this.get("rejectIDs");

		return all.filter(function (item) {
			return !acids.contains(item.id) && !rejids.contains(item.id);
		})[0] || {};

	}.property("all", "acceptIDs", "rejectIDs"),
	image: function () {
		var im =  this.get("current").images;
		if (im) {
			return im["standard_resolution"].url;
		}
	}.property("current"),
	description: function () {
		var cap = this.get("current").caption;
		if (cap && cap.text) {
			
			var t = filterCaption(cap.text);

			if (t === "") {
				return "- - -";
			}
			else {
				return t;
			}
		}
		else {
			return "- - -";
		}
	}.property("current"),
	tags: function () {
		return this.get("current").tags;
	}.property("current")
});

App.MovableImage = Ember.View.extend({
	touchStart: function (evt) {
		this.controller.send("drag", evt);
	},
	touchMove: function (evt) {
	},
	dragStart: function (evt) {
		console.log("START");
		console.log(evt);
		this.get("controller").send("drag", evt);
	},
	drag: function (evt) {
		console.log("MOVE");
		console.log(evt);
	},
	dragEnd: function (evt) {
		console.log("END");
		console.log(evt);
	},
	didInsertElement: function () {
		}
});

// Sight
//====================================================================

App.SightRoute = Ember.Route.extend({
	model: function (params) {
		return $.get("/api/sights/" + params.sight_id).then(function (data) {
			return data.sight;
		});
	}
});

App.SightController = Ember.ObjectController.extend({
	sight: function () {
		return this.get("model");
	}.property("model"),
	current_image: function () {
		return this.get("sight").photos[0].link;
	}.property("sight")
});

App.SightView = Ember.View.extend({
	didInsertElement: function() {

	}
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
			
			if (unfinished.length > 0) {
				alert("Please wait for image uploads.");
				return;
			}
			var photos = this.controller.get("photo_uploads").
				filter(function (item, i, elem) {
					return (item.send && item.link !== "");
				}).map(function (item, i, elem) {
					return {link: item.link};
				});
		
			this.controller.sight.photos = photos;

			$.ajax({
				url: '/api/sights',  
        type: 'POST',
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(this.controller.sight)
			});
		}
	}
});

App.NewsightController = Ember.ObjectController.extend({
	photo_uploads: [],
	sight: {
		photos: []
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

			// Sanitise

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

			// Add photo descriptor to view
			
			var image = Ember.Object.create({
				pip: Array(0),
				togo: Array(10),
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
				ContentType: "application/image",
        xhr: function() {  
          var myXhr = $.ajaxSettings.xhr();
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
        success: function(data) {
					var link = data.file.url;
					image.set("link", link);
					image.set("done", true);
        },
        error: function(err) {
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
		});
		$(this).val('');
	}
});

