'use strict';

/*
 * Intergalactic Travel Prototype.
 * 2014-07-10

 * Copyright Thomas Getgood
`* All rights reserved.
*/

// JS extensions
//====================================================================
 /*
	* object.watch polyfill
	*
	* 2012-04-03
	*
	* By Eli Grey, http://eligrey.com
	* Public Domain.
	* NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	*/

// object.watch
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop, handler) {
			var
			oldval = this[prop]
			, newval = oldval
			, getter = function () {
				return newval;
			}
			, setter = function (val) {
				oldval = newval;
				return newval = handler.call(this, prop, oldval, val);
			}
			;
			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					get: getter
					, set: setter
					, enumerable: true
					, configurable: true
				});
			}
		}
	});
}

// object.unwatch
if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}

// Fake Data
//====================================================================

var delhiFakes = [
	{"id": 1,
	 "name": "India Gate and Rajpath",
	 "tags": ["indiagate", "rajpath"],
	 "description": "India Gate is a memorial raised in honour of the Indian soldiers who died during the Afghan wars and World War I. The cenotaph (or shrine) in the middle is constructed with black marble and depicts a rifle placed on its barrel, crested by a soldier's helmet." },
	{"id": 2,
	 "name": "Rashtrapati Bhavan",
	 "tags": ["rashtrapatibhavan"],
	 "description": "Built with a mix of European and Mughal/Indian styles, Rashtrapati Bhavan was originally built for the Governor General of India. Inaugurated in 1931 as the Viceregal Lodge, the name was changed in 1959 after India became a republic. Now it is the Presidential Palace of India." },
	{"id":3,
	 "name": "Connaught Place",
	 "tags": ["connaughtplace"],
	 "description": "Connaught Place is known for its vibrant atmosphere and planned layout. It has been the hot-spot both for the business men as well as tourists both from the country and abroad. The present day Connaught Place plays the role of a welcoming host to the continuous down stepping of huge masses who are attracted to the popular tourist destinations here." },
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

// IG Interaction
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

// Helpers
//====================================================================

function parseUrl( url ) {
    var a = document.createElement('a');
    a.href = url;
    return a;
}

// State...
//====================================================================

var state = {
	map: null,
	markers: [],
	accepted: [],
	rejected: [],
	index: 0,
	data: delhiFakes,
	current: delhiFakes[0]
};

var maintainQueue = function (state) {
	var sids = _.map(state.accepted, function (x) {
		return x.id;
	}).concat(_.map(state.rejected, function (x) {
		return x.id;
	}));
	
	var queue = _.filter(state.data, function (d) {
		return !_.contains(sids, d.id);
	});


	var index = state.index;
	var len = queue.length;

	while (index < 0) {
		index += len;
	}
	
	index = index % len;
	
	state.index = index;
	
	return queue[index];
}	

state.watch("accepted", function(p, o, newval) {
	state.accepted  = newval;
	state.current = maintainQueue(state);
});

state.watch("rejected", function(p, o, newval) {
	state.rejected  = newval;
	state.current = maintainQueue(state);
});
state.watch("index", function(p, o, newval) {
	state.index  = newval;
	state.current = maintainQueue(state);
});

// Main View
// ====================================================================

var hideMulti = function (hash) {
	var state = hash.substring(1);

	$("#main-view").hide();
	$("#more-pictures").hide();
	$("#map-view").hide();
	
	if (state === "main") {
		$("#main-view").show();
	}
	else if (state === "thumbs") {
		$("#more-pictures").show();
	}
	else if (state === "map") {
		$("#map-view").show();
	}
	else {
		$("#main-view").show(); //...
	}
};

var getCurrent = function (c) {
	var current = _.clone(c);
	
	current.images = [];
	current.shownImage = "";

	for (var i = 0; i < current.tags.length; i++) {
		getIG(getTagsURL(current.tags[i])).then(function (data) {
			var viable = data.data.filter(function(item) {
				return item.type === "image" && item.location !== null;
			});

			if (current.shownImage === "") {
				current.shownImage = viable[0].images["standard_resolution"].url;
			}

			if (!current.images) {
				// Weirdest bug...
				return;
			}
			current.images = current.images.concat(viable);
		});
	}
	
	return current;
}

var render = function (current) {
	$("#site-name").text(current.name);
	$("#description").text(current.description);
	
	current.watch("shownImage", function (prop, oldval, newval) {
		$("#principle-image").attr("src", newval);
	});
	
	current.watch("images", function (prop, oldval, newval) {
		var mp = $("#more-pictures");
		mp.html();
		for (var i = 0; i < newval.length; i++) {
			(function (i) {
				mp.append($('<div>').attr('class', "pure-u-1-3 nav-thumb").on("click", function (evt) {
					current.shownImage = newval[i].images["standard_resolution"].url;
				}).append($("<img>").attr("src", newval[i].images.thumbnail.url)));
			})(i);
		}
	});	
};

// Global watchers
//====================================================================

window.onhashchange = function (evt) {
	var hash = parseUrl(evt.newURL).hash;
	hideMulti(hash);
}
hideMulti(document.location.hash);

state.watch("current", function (prop, oldval, newval) {
	oldval.unwatch("images");
	oldval.unwatch("shownImage");

	render(getCurrent(newval));
});

// Maps
//====================================================================

var initMap = function(location) {
	if (typeof(google) !== "undefined") {
		var geocoder = new google.maps.Geocoder();

		geocoder.geocode({address: location}, function (results, status) {
			var mapOptions = {
				disableDefaultUI: true,
				zoom: 14,
				center: results[0].geometry.location,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			state.map = new google.maps.Map($('#map-canvas')[0],
																			mapOptions);

			google.maps.event.addListenerOnce(map, 'idle', function() {
				google.maps.event.trigger(map, 'resize');
			});
		});
	}
};
	
var addMarker = function(map, location) {	

	if (!map) {
		return;
	}
	
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({address: location.name}, function (results, status) {
		if (!results || results.length === 0) {
			return;
		}

		var marker = new google.maps.Marker({
			position: results[0].geometry.location,
			map: map,
			title: location.name
		});
	});
};

// Bindings
//====================================================================

// Test
// ====================================================================

initMap("new delhi");

_.delay(function () {return addMarker(state.map, {name: "G.B. Road delhi"});}, 2000);;


state.index = 8;
