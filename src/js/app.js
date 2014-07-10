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
	this.resource("navigate", { path: "/navigate/:location" }, function () {
		this.route('sight', { path: "/:sight_id" });
		this.route('thumbnails', { path: "/:sight_id/thumbnails" });
		this.route('wheretogo');
	});

	this.resource('sights', function () {
		this.route('edit');
		this.route("new");
	});
	
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

var bombayFakes = [
	{ "name": "Gateway to India",
		"tags": ["gatewaytoindia"],
		"description": "Big arch, not much to see.",
		"location": {"lat": 17, "lng": 77}
	}];

var delhiFakes = [
	{"id": 1,
	 "name": "India Gate and Rajpath",
	 "tags": ["indiagate", "rajpath"],
	 "description": "India Gate is a memorial raised in honour of the Indian soldiers who died during the Afghan wars and World War I. The cenotaph (or shrine) in the middle is constructed with black marble and depicts a rifle placed on its barrel, crested by a soldier's helmet.",
	 "location": {"lat":28.613110, "lng":77.229553} },
	{"id": 2,
	 "name": "Rashtrapati Bhavan",
	 "tags": ["rashtrapatibhavan"],
	 "description": "Built with a mix of European and Mughal/Indian styles, Rashtrapati Bhavan was originally built for the Governor General of India. Inaugurated in 1931 as the Viceregal Lodge, the name was changed in 1959 after India became a republic. Now it is the Presidential Palace of India.",
	 "location": {"lat":28.614459, "lng":77.199642} },
	{"id":3,
	 "name": "Connaught Place",
	 "tags": ["connaughtplace"],
	 "description": "Connaught Place is known for its vibrant atmosphere and planned layout. It has been the hot-spot both for the business men as well as tourists both from the country and abroad. The present day Connaught Place plays the role of a welcoming host to the continuous down stepping of huge masses who are attracted to the popular tourist destinations here.",
	 "location": {"lat":28.632305, "lng":77.218602} },
	{"name": "Lodhi Gardens",
	 "id":4,
	 "tags": ["lodhigardens"],
	 "description": "Lodhi Gardens, once called Lady Willingdon Park, laid out in 1930 this beautiful park contains 15th and 16th century monuments that are scattered among its well-kept lawns, flowers, shady trees and ponds. During the early morning and evening hours, the sprawling garden is a favourite spot for fitness freaks and those in search of solitude.",
	 "location": {"lat":28.593326, "lng":77.219581} },
	{"name": "Purana Quila",
	 "id":5,
	 "tags": ["puranaquila"],
	 "description": "The Purana Quila (Old Fort) is a very good example of Mughal military architecture.[2] Built by Pandavas, renovated by Humayun, with later modifications by Sher Shah Suri, the Purana Quila is a monument of bold design, which is strong, straightforward, and every inch a fortress. It is different from the well-planned, carefully decorated, and palatial forts of the later Mughal rulers. Purana Quila is also different from the later forts of the Mughals, as it does not have a complex of palaces, administrative, and recreational buildings as is generally found in the forts built later on. The main purpose of this now dilapidated fort was its utility with less emphasis on decoration. The Qal'a-I-Kunha Masjid and the Sher are two important monuments inside the fort. It was made by Aqeel in 1853.-----------------",
	 "location": {} },
	{"name": "Red Fort",
	 "id": 6,
	 "tags": ["redfort"],
	 "description": "The decision for constructing the Red Fort was made in 1639, when Shah Jahan decided to shift his capital from Agra to Delhi. Within eight years, Shahjahanabad was completed with the Red Fort-Qila-i-Mubarak (fortunate citadel) — Delhi's first fort — ready in all its magnificence to receive the Emperor. This entire architecture is constructed of huge blocks red sandstone. Though much has changed with the large-scale demolitions during the British occupation of the fort, its important structures have survived.On every independence day the Flag of India is hoisted by the Prime Minister of India here.",
	 "location": {} },
	{"name": "Salimgarh Fort",
	 "id": 7,
	 "tags": ["salimgarhfort"],
	 "description": "Salimgarh Fort, which is now part of the Red Fort complex, was constructed on an island of the Yamuna River in 1546. But a gate called the Bahadur Shahi Gate for entry into the Fort from the northern side was constructed only in 1854-55 by Bahadur Shah Zafar, the last Mughal ruler of India. The gate was built in brick masonry with moderate use of red sandstone. The fort was used during the Uprising in 1857 and also as a prison which housed Zebunnisa daughter of Aurangzeb and the British imprisoned the freedom fighters of the INA. The layout of the Red Fort was organized to retain and integrate this site with the Salimgarh Fort through the Bahadur Shah Gate. The fort has been renamed as Swatantrata Senani Smarak and a plaque at the entrance to the fort attests to this.",
	 "location": {} },
	{"name": "Chandni Chowk",
	 "id": 8,
	 "tags": ["chandnichowk"],
	 "description": "Chandni Chowk, a main marketplace in Delhi, keeps alive the city's living legacy of Shahjahanabad. Created by Shah Jahan the builder of Taj Mahal, the old city, with the Red Fort as its focal point and Jama Masjid as the praying centre, has a fascinating market called Chandni Chowk. Legend has it that Shah Jahan planned Chandni Chowk so that his daughter could shop for all that she wanted. The market was divided by canals. The canals are now closed, but Chandni Chowk remains Asia's largest wholesale market. Crafts once patronized by the Mughals continue to flourish there. Chowk is one of the oldest and busiest markets in central north Delhi, the Laal Quila (The Red Fort) and Fateh Puri Masjid. With the most famous mosque of Delhi Jama Masjid in the vicinity, along with Sis Ganj Gurudwara, Gauri Shankar Mandir, Jain Mandir and a lot of small temples, the place witnesses a genuine cultural harmony.",
	 "location": {} },
	{"name": "Safdarjung's Tomb",
	 "id": 9,
	 "tags": ["safdarjungstomb"],
	 "description": "The Safdarjung's Tomb is a garden tomb in a marble mausoleum.",
	 "location": {} },
	{"name": "Qutub Minar",
	 "id": 10,
	 "tags": ["qutubminar"],
	 "description": "The Qutub Minar is located in Qutb complex, Mehrauli in South Delhi. It was built by Qutub-ud-din Aibak of the Slave Dynasty, who took possession of Delhi in 1206. It is a fluted red sandstone tower, which tapers up to a height of 72.5 meters and is covered with intricate carvings and verses from the Qur'an. Qutub-ud-din Aibak began constructing this victory tower as a sign of Muslim domination of Delhi and as a minaret for the muezzin to call the faithful to prayer. However, only the first storey was completed by Qutub-ud-din. The other storeys were built by his successor Iltutmish. The two circular storeys in white marble were built by Ferozshah Tughlaq in 1368, replacing the original fourth storey.",
	 "location": {} },
	{"name": "Tughlaqabad",
	 "id": 11,
	 "tags": ["tughlaqabad"],
	 "description": "When Ghazi Malik founded the Tughlaq Dynasty in 1321, he built the strongest fort in Delhi at Tughlaqabad, completed with great speed within four years of his rule. It is said that Ghazi Malik, when only a slave to Mubarak Khilji, had suggested this rocky prominence as an ideal site for a fort. The Khilji Sultan laughed and suggested that the slave build a fort there when he became a Sultan. Ghazi Malik as Ghiyasuddin Tughlaq did just that: Tughlaqabad is Delhi's most colossal and awesome fort even in its ruined state. Within its sky-touching walls, double-storied bastions, and gigantic towers were housed grand palaces, splendid mosques, and audience halls.",
	 "location": {} },
	{"name": "Akshardham Temple",
	 "id": 12,
	 "tags": ["akshardhamtemple"],
	 "description": "Akshardham Temple it is the largest Hindu temple in the world. It was built in 2005. In the sprawling 100-acre (0.40 km2) land rests an intricately carved monument, high-technology exhibitions, an IMAX theatre, a musical fountain, a food court and gardens.[2]",
	 "location": {} },
	{"name": "Laxminarayan Temple",
	 "id": 13,
	 "tags": ["laxminarayantemple"],
	 "description": "The temple is built in honour of Lakshmi (Hindu goddess of wealth), and her consort Narayana (Vishnu, Preserver in the Trimurti) by B. R. Birla from 1933 and 1939, when it was inaugurated by Mahatma Gandhi. The side temples are dedicated to Shiva, Krishna and Buddha.",
	 "location": {} },
	{"name": "Cathedral Church of Redemption",
	 "id": 14,
	 "tags": ["cathedralchurchofredemption"],
	 "description": "Cathedral Church of Redemption, also known as Viceroy Church. Located east of Parliament House and Rashtrapati Bhavan, which was used by then viceroy of British India.",
	 "location": {} },
	{"name": "Gurdwara Bangla Sahib",
	 "id": 15,
	 "tags": ["gurdwarabanglasahib"],
	 "description": "One of the most prominent and largest Gurdwaras in Delhi, Gurdwara Bangla Sahib is the most visited one in the Delhi. Millions visit this Gurdwara from all over the world and of all religions to offer their prayers at this elegant yet historical Gurdwara in Delhi. The Gurdwara marks the place where the eighth Sikh Guru, Guru Harkrishan lived his last breath serving the helpless population ravaged by smallpox and cholera epidemic.[3] The Gurdwara offers free food (langar) to all visitors and devotees throughout the day.",
	 "location": {} },
	{"name": "ISKCON Temple",
	 "id": 16,
	 "tags": ["ISKCONtemple"],
	 "description": "ISKCON Temple also popularly called as the Hare Krishna temple is a famous Vaishnava temple with deities of Sri Radha Krishna. Located in South Delhi, the construction of the temple began in 1991 and was completed in 1998 under the planning of internationally renowned architect Achyut Kanvinde.",
	 "location": {} },
	{"name": "Jama Masjid",
	 "id": 17,
	 "tags": ["jamamasjid"],
	 "description": "The Masjid-i-Jahan Numa, commonly known as Jama Masjid, is the principal mosque of Old Delhi. Commissioned by the Mughal Emperor Shah Jahan and completed in the year 1656, it is one of the largest and best known mosques in India.",
	 "location": {} },
	{"name": "lotustemple",
	 "id": 18,
	 "tags": ["lotustemple"],
	 "description": "The Lotus Temple is an exceptionally beautiful structure, created by the Bahá'í House of Worship, situated in South Delhi and looks like a white lotus. It was built by the Bahá'í community.",
	 "location": {} },
	{"name": "Kalka Ji Mandir",
	 "id": 19,
	 "tags": ["kalkajimandir"],
	 "description": "Kalka Ji Mandir is a famous Hindu mandir or temple,This temple is situated on Kalkaji Mandir (Delhi Metro station) in the southern part of Delhi, India, in Kalkaji, a locality that has derived its name from this famous temple and is located opposite Nehru Place business centre.",
	 "location": {} },
	{"name": "National Museum, New Delhi",
	 "id": 20,
	 "tags": ["nationalmuseumdelhi"],
	 "description": "The National Museum, New Delhi is one of the largest museums in India. It holds variety of articles ranging from pre-historic era to modern works of art. It is run by the Ministry of Culture, part of the Government of India. The museum is situated on the corner of Janpath and Maulana Azad Road.",
	 "location": {} },
	{"name": "National Rail Museum",
	 "id": 21,
	 "tags": ["nationalrailmuseum", "nationalrailmuseumindia"],
	 "description": "The National Rail Museum is a museum in Chanakyapuri, New Delhi which focuses on the rail heritage of India it opened on the 9 July 1977. It is located in over 10 acres (40,000 m2) of land with both indoor and outdoor exhibits. A toy train offers rides around its site on regular days. The museum houses the world's oldest operational steam locomotive the 1855 built Fairy Queen certified by the Guinness Book of Records.",
	 "location": {} },
	{"name": "Jantar Mantar",
	 "id": 22,
	 "tags": ["jantarmantar"],
	 "description": "The Jantar Mantar consists of 13 architectural astronomy instruments, built by Maharaja Jai Singh II.",
	 "location": {} },
	{"name": "Nizamuddin Dargah",
	 "id": 23,
	 "tags": ["nizamuddindargah"],
	 "description": "Nizamuddin Dargah is the Mausoleum of the famous Sufi Saint Nizamuddin Auliya, Delhi.",
	 "location": {} },
	{"name": "Raj Ghat",
	 "id": 24,
	 "tags": ["rajghat"],
	 "description": "On the bank Yamuna River, which flows past Delhi, there is Raj Ghat, the final resting place of Mahatma Gandhi, the father of the nation. It has become an essential point of call for all visiting dignitaries. Two museums dedicated to Gandhi are situated nearby.",
	 "location": {} },
	{"name": "Shanti Vana",
	 "id": 25,
	 "tags": ["shantivana"],
	 "description": "Lying close to the Raj Ghat, the Shanti Vana (literally, the forest of peace) is the place where India's first Prime Minister Jawaharlal Nehru was cremated. The area is now a beautiful park adorned by trees planted by visiting dignitaries and heads of state.",
	 "location": {} },
	{"name": "National Zoological Park",
	 "id": 26,
	 "tags": ["delhizoo"],
	 "description": "The National Zoological Park is a 176-acre (71 ha) zoo near the Old Fort in Delhi, India. The zoo is home to about 1350 animals representing almost 130 species of animals and birds from around the world.",
	 "location": {} }
];

var getCityData = function (location) {
	return new Promise(function (s, f) {
		s(delhiFakes);
	});
}

var ContentStore = Ember.Object.extend({
	data: [],
	syncToLocation: function (location) {
		this.set("data", delhiFakes);
		return this.get("data");
	},
	getByID: function (id) {
		return this.get("data").findBy("id", id);
	}
});
		
var cs = new ContentStore();

App.NavigateIndexController = Ember.Controller.extend({
	needs: "navigate"
});

App.NavigateIndexView = Ember.View.extend({
	didInsertElement: function () {
		this.controller.get("controllers.navigate").send("initial");
	}
});

App.NavigateRoute = Ember.Route.extend({
	model: function (params) {
		return cs.syncToLocation(location);
	},

	setupController: function(controller, model){
    this._super(controller, model);
  },

	actions: {
		dragStart: function () {
//			this.controller.set("description", event);
		},

		drag: function () {
		},

		next: function () {
			this.controller.set("rawIndex", this.controller.get("rawIndex") + 1);

			this.transitionTo("navigate.sight", this.controller.get("current").id);
		},

		previous: function () {
			this.controller.set("rawIndex", this.controller.get("rawIndex") - 1);

			this.transitionTo("navigate.sight", this.controller.get("current").id);
		},
			
		accept: function (post) {
			var a = this.controller.get("accepted");
			this.controller.set("accepted", a.concat([post]));

			this.transitionTo("navigate.sight", this.controller.get("current").id);
		},
		
		reject: function (post) {
			var r = this.controller.get("rejected");
			this.controller.set("rejected", r.concat([post]));

			this.transitionTo("navigate.sight", this.controller.get("current").id);
		},
		
		initial: function () {
			this.transitionTo("navigate.sight", this.controller.get("current").id);
		}
	}
});

App.NavigateController = Ember.ArrayController.extend({
	needs: ["navigateSight"],

	accepted: [],
	rejected: [],

	seenIDs: function () {
		return this.get("accepted").mapBy("name").
			concat(this.get("rejected").mapBy("name"));
	}.property("accepted", "rejected"),

	queue: function () {
		var all = this.get("model");
		var seen = this.get("seenIDs");

		return all.filter(function (item, i, e) {
			return !seen.contains(item.name);
		});
	}.property("content", "seenIDs"),

	rawIndex: 0,
	index: function () {
		var i = this.get("rawIndex");
		var l = this.get("queue").length;
		while (i < 0) {
			i += l;
		}
		return i % l;
	}.property("rawIndex"),
	
	current: function () {
		// FIXME: We need to nullify and then asynchronously repopulate
		// the images whenever the current selection is changed. This
		// seems like a very un-ember way to achieve that.

		var app = this;
		var index = this.get("index");
		var current = this.get("queue")[index];

		if (current === undefined) {
			return {};
		}
		
		return current;
	}.property("queue", "index")
});


App.NavigateSightRoute = Ember.Route.extend({
	model: function(params) {
		var id = params.sight_id;
		var current = cs.getByID(parseInt(id));
		var app = this;

		if (this.get("last") && this.get("last") === id) {
			return current;
		}
		else {
			this.set("last", id);
		}

		for (var i = 0; i < current.tags.length; i++) {
			 getIG(getTagsURL(current.tags[i])).then(function (data) {
				 var viable = data.data.filter(function(item) {
					 return item.type === "image" && item.location !== null;
				 });
				 app.controller.set("images", app.controller.get("images").concat(viable));
			 });
		}
		
		return current;
	},

	last: null,
	
	actions: {
		"view-map": function () {
			this.transitionTo("navigate.wheretogo");
		},
		
		"view-thumbs": function () {
			this.transitionTo("navigate.thumbnails", this.controller.get("id"));
		}
	}
});

App.NavigateSightController = Ember.ObjectController.extend({
	needs: ["navigate", "navigateThumbnails"],

	curl: undefined,
	images: [],

	current: function () {
		this.set("images", []);
		this.set("curl", undefined);
		
		return this.get("controllers.navigate.current");
	}.property("controllers.navigate.current"),

	id: function () {
		return this.get("model").id;
	}.property("model"),

	description: function () {
		return this.get("model").description;
	}.property("model"),
	
	name: function () {
		return this.get("model").name;
	}.property("model"),
	
	image: function () {
		var images = this.get("images");
		var curl = this.get("curl");

		if (typeof(curl) === "undefined" && images.length > 0) {
			return images[0].images["standard_resolution"].url;
		}
		return curl;
	}.property("images", "curl"),
});

App.NavigateThumbnailsRoute = Ember.Route.extend({
	model: function(params) {
		return params.sight_id;
	},
	actions: {
		"set-image": function (image) {
			this.controller.get("controllers.navigateSight").set("curl",
																													 image.images["standard_resolution"].url);

			this.transitionTo("navigate.sight", this.controller.get("controllers.navigate.current").id);
		}
	}
});

App.NavigateThumbnailsController = Ember.Controller.extend({
	needs: ["navigate", "navigateSight"],
	images: function () {
		return this.get("controllers.navigateSight.images");
	}.property("controllers.navigateSight.images")
});

var mapSetup = function (location) {

	
	return map;
};

App.NavigateWheretogoRoute = Ember.Route.extend({
	model: function (params) {
		return {location:this.modelFor("navigate").location};
	},

	setupController: function(controller, model){
    this._super(controller, model);

		var map = controller.get("map");
		
		if (!map) {
			return;
		}

		var accepted = controller.get("controllers.navigate.accepted");
		
		var markers = controller.get("currentMarkers");
		
		var geocoder = new google.maps.Geocoder();
		
		var toAdd = accepted.filter(function (n, i, that) {
			return markers.filter(function (o, j, that) {
				return o.title === n.name;
			}).length === 0;
		});

		
		for (var i = 0; i < toAdd.length; i++) {
			(function (m) {
				geocoder.geocode({address: m.name}, function (results, status) {
					console.log(results[0].geometry.location)
					var marker = new google.maps.Marker({
						position: results[0].geometry.location,
						map: map,
						title: m.name
					});

					controller.set("currentMarkers",
									controller.get("currentMarkers").concat([marker]));
				});
			})(toAdd[i]);
		}
	},

	actions: {
		"view-main": function () {
			var current = this.controllerFor("navigate").get("current").id;
			this.transitionTo("navigate.sight", current);
		}
	}
});

App.NavigateWheretogoController = Ember.ObjectController.extend({
	needs: "navigate",
	
	location: function () {
		return this.get("model").location;
	}.property("model"),
	
	map: null,

	currentMarkers: []
});

App.NavigateWheretogoView = Ember.View.extend({
	didInsertElement: function() {
		var app = this;
//		var location = this.controller.get("location");
		var location = "new delhi";

		if (typeof(google) !== "undefined") {
			var geocoder = new google.maps.Geocoder();
			var map;

			geocoder.geocode({address: location}, function (results, status) {
				var mapOptions = {
//					disableDefaultUI: true,
					zoom: 14,
					center: results[0].geometry.location,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				
				map = new google.maps.Map($('#map-canvas')[0],
																	mapOptions);

				app.controller.set("map", map);

				google.maps.event.addListenerOnce(map, 'idle', function() {
					google.maps.event.trigger(map, 'resize');
				});
			});
		}
	}
});


// Widgets
//====================================================================

App.MovableImage = Ember.View.extend({
	touchStart: function (evt) {
		this.controller.send("drag", evt);
	},
	touchMove: function (evt) {
	},
	dragStart: function (evt) {
		this.get("controller").send("drag", evt);
	},
	drag: function (evt) {
	},
	dragEnd: function (evt) {
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

