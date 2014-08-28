(ns travels.server
  (:require-macros [cljs.core.async.macros :refer [go alt! go-loop]])
  (:require [cljs.core.async :refer [>! <! chan onto-chan]]
            [ajax.core :as $]))

(defn- get-fake-data
  []
  (let [res (chan)
        err (chan)]
    ($/ajax-request "/api/fakedatadelhi" :get
           {:format ($/json-response-format {:keywords? true})
            :handler (fn [x]
                       (go
                         (if (first x)
                           (>! res (second x))
                           (>! err (second x)))))})
    [res err]))

(defn- handle-response
  [in-ch out-ch]
    ;; Split the sites into separate events
    (go 
      (let [sites (<! in-ch)
            site-map (map (fn [s] [(:name s) s]) sites)]
        (onto-chan out-ch site-map))))

(defn fetch
  []
  (let [out-ch (chan)
        [res err] (get-fake-data)]
    (handle-response res out-ch)
    out-ch))


