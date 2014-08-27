(ns travels.core
   (:require-macros [cljs.core.async.macros :refer [go alt! go-loop]])
   (:require [cljs.core.async :refer [>! <! chan]]
             [ajax.core :as $]
             [travels.state :as state]
             [travels.components :as components]))


(defn g->loc
  [geo]
  (let [pos (-> geo .-geometry .-location)]
    {:latitude (.-k pos) :longitude (.-B pos)}))

(defn get-locations
  [data]
  (let [out (chan (count data))]
    (doall (map (fn [d]
                  (go (let [sitename (:name d)
                            geo (<! (gm/get-geocode sitename))]
                        (>! out {:sitename sitename :location (g->loc geo)}))))
                data))
    out))

(defn index-of [s v]
  (loop [idx 0 items s]
    (cond
      (empty? items) nil
      (= v (first items)) idx
      :else (recur (inc idx) (rest items)))))

(defn update-locations
  [data]
  (let [geos (get-locations data)]
    (go (loop []
          (let [{:keys [sitename location]} (<! geos)
                site (first (filter #(= sitename (:name %)) data))
                index (index-of data site)]

            (swap! components/root-state 
                   #(assoc-in % [:sites index :location] location))
            (recur))))))

(def req
  #js {:origin "new delhi"
       :destination "india gate"
       :travelMode google.maps.TravelMode.WALKING
       :unitSystem google.maps.UnitSystem.METRIC})


(defn ^:export init
  []
  (components/attach-root)
  (go
    (let [[out err] (get-fake-data)
          data (<! out)
        ];  mark (<! (gm/get-geocode "new delhi"))]

      ;; State management in the main loop...

      (swap! state/root-state (fn [x] (assoc x :sites data)))
      (swap! state/root-state #(assoc % :user-location (g->loc mark)))

      ; (update-locations data)

      (let [direct (google.maps.DirectionsService.)
            dirs   (chan)]


        (.route direct req (fn [res stat]
                             (swap! components/root-state #(assoc % :directions res)))))

      )))

