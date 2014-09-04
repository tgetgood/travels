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

(defn assoc-map
  [m & kvs]
  (assert (zero? (mod (count kvs) 2)) "Wrong number of args")

;; TODO: test that attaching a new map to a DOM node removes the old
;; one automatically.
(defn attach-map!
  [m elem]
  ())


