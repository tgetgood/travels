(ns travels.server
  (:require [ajax.core :as $]))

(defn- get-fake-data
  []
  (let [out (chan)
        err (chan)]
    ($/ajax-request "/api/fakedatadelhi" :get
           {:format ($/json-response-format {:keywords? true})
            :handler (fn [x]
                       (go
                         (if (first x)
                           (>! out (second x))
                           (>! err (second x)))))})
    [out err]))

(defn- handle-response
  [in-ch out-ch]
    ;; Split the sites into separate events
    (go 
      (let [sites (<! in-ch)
            site-map (map #({:id (:name %) :data %}) sites)]
        (onto-chan out-ch site-map))))

(defn fetch
  []
  (let [out-ch (chan)
        [out err] (get-fake-data)]
    (handle-response out out-ch)
    out))


