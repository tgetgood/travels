(ns travels.core
   (:require-macros [cljs.core.async.macros :refer [go alt! go-loop]]
                    [dommy.macros :as domm])
   (:require [cljs.core.async :refer [>! <! chan]]
             [ajax.core :as $]

             [travels.state :refer [onchange sites active selected]]
             [travels.render :refer [render-main-list render-details]]
             [travels.gmaps :as gm]))


(defn get-fake-data
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


(onchange active render-main-list)
(onchange selected render-details)

(defn ^:export init
  []
  (go
    (let [m (<! (gm/init-map "new delhi" (domm/sel1 :#map-canvas)))
          [out err] (get-fake-data)
          data (<! out)
          marker (<! (gm/create-marker m "new delhi"))]
      (reset! sites data)
    )))





      ; (doall (map (fn [d] (gm/create-marker m (.-name d))) data))




      ; (let [dists (<! (gm/get-distances "new delhi" data))
      ;       proc (->> dists
      ;                 .-rows
      ;                 first
      ;                 .-elements
      ;                 (map (fn [x] (.-duration x)))
      ;                 (filter (comp not nil?))
      ;                 (map #(.-text %))
      ;                 (clj->js))]
      ;   (.log js/console proc)))))



