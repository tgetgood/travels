(ns travels.util)

(defmacro ember-response
  "Returns a web response compatible with ember data. If the given
  function returns a collection, that will become the value of prop,
  if it returns nil, this returns a 404, if it throws an exception
  this returns a 503."
  [prop call]
  `(try
    (if-let [v# ~call]
      {:status 200 :body {~prop v#}}
      {:status 404 :body "Wha chu talkin bout?"})
    (catch Exception e#
      {:status 503 :body (.toString e#)})))


(def irregular-plurals
  {:person :people})

(defn plural
  "Returns the plural of the given keyword. Please make sure the arg
  is a keyword."
  [sing]
  (if (contains? irregular-plurals sing)
    (get irregular-plurals sing)
    (keyword (str (name sing) "s"))))
