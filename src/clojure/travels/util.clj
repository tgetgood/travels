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
      {:status 404})
    (catch Exception e#
      {:status 503 :body (.toString e#)})))
