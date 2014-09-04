(ns semion-sandbox.maps-wrapper
  (:require-macros [cljs.core.async.macros :refer [go go-loop]])
  (:require [cljs.core.async :refer [<! >! chan]]))

(defstruct map-wrapper 
  ;; TODO: Set this up as a schema of some sort.
  {:map-obj nil
   :dom-element nil
   
   :opts {:disableDefaultUI true
          :zoom 12
          :center nil
          :mapTypeId google.maps.MapTypeId.ROADMAP}

   :markers    []
   :directions {}})

(defn create-map
  "Returns a map wrapper object with given configuration."
  [opts & [markers directions-obj]]
  (assert (valid-map opts))
  (struct map-wrapper
          (google.maps.Map. nil (clj->js opts))
          nil
          opts
          markers
          directions-obj))

(defn- update-map!
  "Updates a map in place to reflect the given data."
  [[map-obj old-data] new-data]
  ())


(def maps (atom {}))

;; TODO: test that attaching a new map to a DOM node removes the old
;; one automatically.
(defn attach-map!
  "Creates a new map object attached to the given DOM element if one does not
  already exist and updates it to match the given data. If there is already a
  map attached it is modified to show the new data." 
  [map-data elem]
  (when (not (contains? @maps elem))
    (let [map-obj (google.maps.Map. elem (cljs->js (:opts map-data)))]
      (swap! maps (fn [s] (assoc s elem {:map map-obj :data map-data})))))
  (update-map! (get @maps elem) map-data))


