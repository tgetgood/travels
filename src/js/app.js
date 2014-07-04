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

// Go (map)
//====================================================================

App.GoRoute = Ember.Route.extend({
});

App.GoController = Ember.Controller.extend({
	location: function () {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({address: "bombay"}, function (results, status) {
			console.log(results);
		});
	}
});

App.GoView = Ember.View.extend({
	didInsertElement: function() {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({address: "bombay"}, function (results, status) {
			var map;
			var mapOptions = {
				zoom: 8,
				center: results[0].geometry.location
			};
			map = new google.maps.Map(document.getElementById('map-canvas'),
																mapOptions);
			
			console.log(map);
		});
	}
});


// Navigate
//====================================================================

var clientID = "4a6a3fb4b8464bfe9098d1e901d2aa6e"

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

// Currently Set to get 100 results at a time, if IG respects that...
var getTagsURL = function (tag) {
	var url = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?count=100";
	return appendAuth(url);
};

var getIG = function (url) {
	return $.ajax(url, {
		type: "GET",
		"method": "GET",
		dataType: "jsonp",
		headers: {"Access-Control-Allow-Origin": "true"}
	});
};				

var filterCaption = function (text) {
	return text.replace(/#[0-9a-zA-Z-']+/g, "").trim();
}

// Look for faces in the given image.
var findAFace = function(url) {
	var image = new Image();
	
	image.onload = function () {
		new HAAR.Detector(haarcascade_frontalface_alt, Parallel).
			image(image).
			interval(40).
			complete(function () {
				console.log(this);
			}).
			detect(1, 1.25, 0.5, 1, true); 
	};

	image.src = url;
};

var bombayFakes = [
	{ "name": "Gateway to India",
		"tags": ["gatewaytoindia"],
		"description": "Big arch, not much to see.",
		"location": {"lat": 17, "long": 77}
	}];

var delhiFakes = [
	{"name": "India Gate and Rajpath",
	 "tags": ["indiagate", "rajpath"],
	 "description": "India Gate is a memorial raised in honour of the Indian soldiers who died during the Afghan wars and World War I.[1] The names of the soldiers who died in these wars are inscribed on the walls. The cenotaph (or shrine) in the middle is constructed with black marble and depicts a rifle placed on its barrel, crested by a soldier's helmet. Each face of the cenotaph has inscribed in gold the words Amar Jawan (in Hindi, meaning Immortal Warrior). The green lawns at India Gate are a popular evening and holiday rendezvous for young and old alike. Every year the Republic day celebrations are made in Delhi.The armymen and other citizens of India who are awarded or who participate in the celebration walk through the Rajpath.[2]",
	 "location": {} },
	{"name": "Sansad Bhavan",
	 "tags": ["sansadbhavan"],
	 "description": "Sansad Bhavan or the Parliament of India is a circular building designed by the British architects Sir Edwin Lutyens and Sir Herbert Baker in 1912–1913. Construction began in 1921, and in 1927 the building was opened as the home of the Council of State, the Central Legislative Assembly, and the Chamber of Princes.",
	 "location": {} }
	];
	


// Invoke IG
// this.set("nextURL", getTagsURL(params.location));
// this.updateQueue();



App.NavigateRoute = Ember.Route.extend({
	model: function (params) {
		var location = params.location;
		return location;
	},

	actions: {
		drag: function (event) {
//			this.controller.set("description", event);
		},

		next: function () {
		},

		previous: function () {
		},

		"view-map": function () {
			this.controller.set("viewState", "map");
		},

		"view-thumbs": function () {
			this.controller.set("viewState", "thumbs");
		},
		
		"set-image": function (im) {
			this.controller.set("current-image", im.images["standard_resolution"].url);
			this.controller.set("viewState", "main");
		},
		
		accept: function (post) {
			this.controller.set("all", this.controller.get("all").without(post));
			
			var a = this.controller.get("accepted");
			this.controller.set("accepted", a.concat([post]));
		},
		
		reject: function (post) {
			this.controller.set("all", this.controller.get("all").without(post));

			var r = this.controller.get("rejected");
			this.controller.set("rejected", r.concat([post]));
		}
	}
});

App.NavigateController = Ember.ObjectController.extend({
	viewState: "main",
	hideMap: function () {
		return !(this.get("viewState") === "map");
	}.property("viewState"),
	hideMain : function () {
		return !(this.get("viewState") === "main");
	}.property("viewState"),
	hideThumbs: function() {
		return !(this.get("viewState") === "thumbs");
	}.property("viewState"),

	accepted: [],
	rejected: [],
	all: delhiFakes,

	images: [],
	"current-image": "",

	seenIDs: function () {
		return this.get("accepted").mapBy("id").
			concat(this.get("rejected").mapBy("id"));
	}.property("accepted", "rejected"),
	
	queue: function () {
		var all = this.get("all");

		return all;
	}.property("all"),
	
	current: function () {
		// FIXME: We need to nullify and then asynchronously repopulate
		// the images whenever the current selection is changed. This
		// seems like a very un-ember way to achieve that.

		var app = this;
		var current = this.get("queue")[0] || {};
		
		this.set("images", [{}]);
		this.set("current-image", "");
		
		for (var i = 0; i < current.tags.length; i++) {
			this.getImages(current.tags[i]).then(function (images) {
				var existing = app.get("images");
				app.set("images", existing.concat(images));
				
				if (images.length > 0 && app.get("current-image") === "") {
					app.set("current-image", images[0].images["standard_resolution"].url);
				}
			});
		}
		
		return current;
	}.property("queue"),
	
	getImages: function (tag) {
		var app = this;
		
		return getIG(getTagsURL(tag)).then(function (data) {
			var seenIDs = app.get("seenIDs");

			var viable = data.data.filter(function(item) {
				return item.type = "image" && item.location !== null;
			}).filter(function (item) {
				return !seenIDs.contains(item.id);
			});

			return viable;
		});
	},
	
	description: function () {
		var des = this.get("current").description;
		return des.substring(0, 255);
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


// Index
//====================================================================

App.IndexRoute = Ember.Route.extend({
	actions: {
		navigate: function (location) {
			this.transitionTo("navigate", location);
		}
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

