(ns travels.gmaps
   (:require-macros [cljs.core.async.macros :refer [go alt!]])
   (:require [cljs.core.async :refer [>! <! chan]]))

(defn get-geocode
  ([loc]
   (let [out (chan)]
     (get-geocode loc out)))
  ([loc out]
   (let [gc  (google.maps.Geocoder.)
         address (clj->js {:address loc})
         cb  (fn [res status]
               (cond (= status "OK")
                       (go (>! out (first res)))
                     (= status "OVER_QUERY_LIMIT")
                       (js/setTimeout
                         (fn [] (get-geocode loc out))
                         10000)))]
     (.geocode gc address cb)
     out)))

(defn init-map
  [loc elem]
  (let [geoc (get-geocode loc)
        out  (chan)]
    (go
      (let [coords (<! geoc)
            opts {:disableDefaultUI true
                  :zoom 13
                  :center (-> coords .-geometry .-location)
                  :mapTypeId google.maps.MapTypeId.ROADMAP}
            m    (google.maps.Map. elem (clj->js opts))]
        (>! out m)))
    out))

(defn goog-lat-long
  [{:keys [latitude longitude]}]
  (google.maps.LatLng. latitude longitude))

(defn create-marker
  [loc]
  (let [lat-lng (goog-lat-long loc)
        opts {:position lat-lng
              :map nil
              :title ""}]
    (google.maps.Marker. (clj->js opts))))

(defn get-distances
  [me dests]
  (let [out  (chan (quot (count dests) 25))
        opts {:origins [me]
              :destinations (map #(get % "name") dests)
              :travelMode google.maps.TravelMode.WALKING,
              :unitSystem google.maps.UnitSystem.METRIC}
        dm   (google.maps.DistanceMatrixService.)]
    (.getDistanceMatrix dm (clj->js opts)
                        (fn [r s] (go (>! out r))))
    out))





