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
		enumerable: false,
		configurable: true,
		writable: false,
		value: function (prop, handler) {
			var	oldval = this[prop];
			var newval = oldval;
			var getter = function () {
				return newval;
			};
			var setter = function (val) {
				oldval = newval;
				newval = handler.call(this, prop, oldval, val);
				return newval;
			};

			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					get: getter,
					set: setter,
					enumerable: true,
					configurable: true
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
	location: null,
	mapInit:false,
	map: null,
	accepted: [],
	rejected: [],
	index: 0,
	data: [],
	current: {}
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

	return queue[index];
}

state.watch("accepted", function(p, o, newval) {
	var s = _.clone(state);

	s.accepted  = newval;
	state.current = maintainQueue(s);

	return newval;
});

state.watch("rejected", function(p, o, newval) {
	var s = _.clone(state);

	s.rejected  = newval;
	state.current = maintainQueue(s);

	return newval;
});

state.watch("index", function(p, o, newval) {
	var s = _.clone(state);

	s.index  = newval;
	state.current = maintainQueue(s);

	return newval;
});

// Main View
// ====================================================================

var hideMulti = function (hash) {
	var view = hash.substring(1);

	$("#main-view").hide();
	$("#more-pictures").hide();
	$("#map-view").hide();

 if (view === "thumbs") {
		$("#more-pictures").show();
	}
	else if (view === "map") {
		$("#map-view").show();
		if (!state.mapInit) {
			initMap(state.location);
			state.mapInit = true;
		}
	}
	else {
		$("#main-view").show(); //...
	}
};

var render = function (current) {
	$("#site-name").text(current.name);
	$("#description").text(current.description);

	$("#principle-image").attr("src", current.shownImage);
	current.watch("shownImage", function (prop, oldval, newval) {
		$("#principle-image").attr("src", newval);
	});


	var mp = $("#more-pictures");
	mp.html("");

	for (var i = 0; i < current.images.length; i++) {
		(function (i) {
			var el = $('<div>').attr('class', "pure-u-1-3 nav-thumb").attr("id", "th-" + i);
			mp.append(el.append($("<img>").attr("src", current.images[i].thumbnail.url)));

			(new Hammer($("#th-" + i)[0])).on("tap", function (evt) {
				current.shownImage = current.images[i]["low_resolution"].url;
				location.hash = "";
			});
		})(i);
	}
};

var unrender = function () {
	// Post animation cleanup This is really sloppy. I wonder if it
	// would be reasonable to destroy the old element when it swipes off
	// screen an create a new one afresh.
	var el = $("#main-drag");
	el.removeClass("drag-side");
	el.css("left", "0px");
	_.delay(function() {el.addClass("drag-side");}, 200)
}

var getCurrent = function (c) {
	var current = _.clone(c);

	if (current.images && current.images.length > 0 &&
			(current.shownImage === "" || current.shownImage === undefined)) {
		current.shownImage = current.images[0]["low_resolution"].url;
	}

	return current;
}

// Global watchers
//====================================================================

window.onhashchange = function (evt) {
	var hash = parseUrl(evt.newURL).hash;
	hideMulti(hash);
}

state.watch("current", function (prop, oldval, newval) {
	unrender();

	if (oldval) {
		oldval.unwatch("images");
		oldval.unwatch("shownImage");
	}

	var current = getCurrent(newval);

	render(current);

	return current;;
});

// Maps
//====================================================================

var initMap = function(location) {
	if (typeof(google) !== "undefined") {
		var geocoder = new google.maps.Geocoder();

		geocoder.geocode({address: location}, function (results, status) {
			var mapOptions = {
				disableDefaultUI: true,
				zoom: 13,
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
		// FIXME: Not the worst leak, but terrible practice.
		_.delay(function () {addMarker(state.map, location);}, 2000);
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

// Event Handlers
//====================================================================

var go = function (h) {
	return function() {
		location.hash = h;
	};
};

var goToMap    = go("#map");
var goToThumbs = go("#thumbs");
var goToMain   = go("");


var reject = function (c) {
	state.rejected = state.rejected.concat([c]);
};

var accept = function (c) {
	state.accepted = state.accepted.concat([c]);
	addMarker(state.map, c);
};


// Hammer Time
//=====================================================================

var ges = new Hammer($("#main-drag")[0]);
ges.on("swipe", function (ev) {
	var el = $("#main-drag");

	if (ev.deltaX > 0) {
		el.css("left", screen.width + "px");
		_.delay(accept, 500, state.current);
	}
	else {
		el.css("left", "-" + screen.width + "px");
		_.delay(reject, 500, state.current);
}
});

var hpan = 0;
var vpan = 0;

ges.on("pan", function (ev) {
	var el = $("#main-drag");
	el.removeClass("drag-side");
	el.css("left", (parseInt(el.css("left")) + ev.deltaX + "px"));

	console.log(el.css("left"))
	console.log(ev.deltaX)

if (ev.isFinal) {
		el.addClass("drag-side");
		el.css("left", "0px");
	}

});

ges.on("panstop", function (ev) {
//	console.log(ev);
});

// Using Hammer for buttons prevents swipe-press issues.
(new Hammer($("#image-container")[0])).on("tap", goToThumbs);
(new Hammer($("#map")[0])).on("tap", goToMap);
(new Hammer($("#back-to-main")[0])).on("tap", goToMain);

// Init
// ====================================================================

// Set view based on hash
hideMulti(document.location.hash);

// Fake search
state.location = "new delhi";

// Get fake data
$.get("/api/fakedatadelhi").then(function(data) {
	var data = JSON.parse(data);
	state.data = data;
	state.current = data[0];
});


// Begin shamelessly stolen dragging code.
//====================================================================

function mouseX (e) {
  if (e.pageX) {
    return e.pageX;
  }
  if (e.clientX) {
    return e.clientX + (document.documentElement.scrollLeft ?
      document.documentElement.scrollLeft :
      document.body.scrollLeft);
  }
  return null;
}

function mouseY (e) {
  if (e.pageY) {
    return e.pageY;
  }
  if (e.clientY) {
    return e.clientY + (document.documentElement.scrollTop ?
      document.documentElement.scrollTop :
      document.body.scrollTop);
  }
  return null;
}

function draggable (clickCl) {
  var p = $(clickCl);
  var drag = false;
  var offsetX = 0;
  var offsetY = 0;
  var mousemoveTemp = null;

  if (p) {
    var move = function (x,y) {
	//		console.log(x)
      p.css("left", (parseInt(p.css("left"))+x) + "px");
      p.css("top", (parseInt(p.css("top")) +y) + "px");
    }
    var mouseMoveHandler = function (e) {
      e = e || window.event;

      if(!drag){return true};

      var x = mouseX(e);
      var y = mouseY(e);
      if (x != offsetX || y != offsetY) {
        move(x-offsetX,y-offsetY);
        offsetX = x;
        offsetY = y;
      }
      return false;
    }
    var start_drag = function (e) {
      e = e || window.event;

      offsetX=mouseX(e);
      offsetY=mouseY(e);
      drag=true; // basically we're using this to detect dragging

      // save any previous mousemove event handler:
      if (document.body.onmousemove) {
        mousemoveTemp = document.body.onmousemove;
      }
      document.body.onmousemove = mouseMoveHandler;
      return false;
    }
    var stop_drag = function () {
      drag=false;

      // restore previous mousemove event handler if necessary:
      if (mousemoveTemp) {
        document.body.onmousemove = mousemoveTemp;
        mousemoveTemp = null;
      }
      return false;
    }
    p.on("mousedown", start_drag);
		p.on("touchstart", start_drag);

    p.on("mouseup", stop_drag);
		p.on("touchend", stop_drag);
  }
}

//draggable("#main-drag");

