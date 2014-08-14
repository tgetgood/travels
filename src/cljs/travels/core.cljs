(ns travels.core
   (:require-macros [cljs.core.async.macros :refer [go alt!]]
                    [dommy.macros :as domm])
   (:require [cljs.core.async :refer [>! <! chan]]
             [ajax.core :as $]
             [dommy.utils :as domu]
             [dommy.core :as dom]))


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
          

(defn get-geocode
  [loc]
  (.log js/console loc)
  (let [out (chan)
        gc (google.maps.Geocoder.)
        address (clj->js {:address loc})]
    (.geocode gc address (fn [res status]
                             ;; TODO: check status, handle errors
                             (when (< 0 (count res))
                               (go (>! out (first res))))))
    out))

(defn init-map
  [loc]
  (let [geoc (get-geocode loc)
        out (chan)]
    (go 
      (let [coords (<! geoc)
            opts {:disableDefaultUI true
                  :zoom 13
                  :center (-> coords .-geometry .-location)
                  :mapTypeId google.maps.MapTypeId.ROADMAP}
            m (google.maps.Map. (domm/sel1 :#map-canvas) (clj->js opts))]
        (>! out m)))
    out))
        

(defn create-marker
  [map loc]
  (let [out (chan)
        geo (get-geocode loc)]
    (go 
      (let [coords (<! geo) 
            opts {:position (-> coords .-geometry .-location)
                  :map map
                  :title loc}]
        (>! out (google.maps.Marker. (clj->js opts)))))
    out))


(defn ^:export init 
  []
  (go
    (let [m (<! (init-map "new delhi"))
          [out err] (get-fake-data)
           data (<! out)]
        (doall (map (fn [d] (create-marker m (get d "name"))) data)))))


