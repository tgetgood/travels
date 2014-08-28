(ns travels.core
   (:require-macros [cljs.core.async.macros :refer [go alt! go-loop]])
   (:require [cljs.core.async :refer [>! <! chan]]
             [travels.state :as state]
             [travels.server :as server]
             [travels.components :as components]))


(def req
  #js {:origin "new delhi"
       :destination "india gate"
       :travelMode google.maps.TravelMode.WALKING
       :unitSystem google.maps.UnitSystem.METRIC})


(defn ^:export init
  []
  (components/attach-root)

  (state/handle-new-data (server/fetch))
    ; (update-locations data)

    ; (let [direct (google.maps.DirectionsService.)
    ;       dirs   (chan)]


    ;   (.route direct req (fn [res stat]
    ;                        (swap! components/root-state #(assoc % :directions res)))))

    )

