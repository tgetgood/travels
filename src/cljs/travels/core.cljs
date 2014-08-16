(ns travels.core
   (:require-macros [cljs.core.async.macros :refer [go alt!]]
                    [dommy.macros :as domm])
   (:require [cljs.core.async :refer [>! <! chan]]
             [ajax.core :as $]
             [dommy.utils :as domu]
             [dommy.core :as dom]
             
             [travels.gmaps :as gm]))


(defn get-fake-data
  []
  (let [out (chan)
        err (chan)]
    ($/ajax-request "/api/fakedatadelhi" :get
           {:format ($/json-response-format {})
            :handler (fn [x] 
                       (go 
                         (if (first x)
                           (>! out (second x))
                           (>! err (second x)))))})
    [out err]))
          



(defn ^:export init 
  []
  (go
    (let [m (<! (gm/init-map "new delhi" (domm/sel1 :#map-canvas)))
          [out err] (get-fake-data)
          data (<! out)]
      (doall (map (fn [d] (gm/create-marker m (get d "name"))) data))
      (gm/create-marker m "new delhi")
      (let [dists (<! (gm/get-distances "new delhi" data))
            proc (->> dists
                      .-rows 
                      first 
                      .-elements 
                      (map (fn [x] (.-duration x)))
                      (filter (comp not nil?))
                      (map #(.-text %))
                      (clj->js))]
        (.log js/console proc)))))




