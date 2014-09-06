(ns travels.data-transforms
  (:require [travels.maps-wrapper :refer [create-map]]))

(defn get-std-image-src
  [state] 
  (-> state
      :images
      first
      :standard_resolution
      :url))

(defn thumb-urls
  [state]
  (map (fn [i] (-> i :thumbnail :url)) (:images state)))

(defn process-map-data
  [state]
  {:map-data
   (create-map 
     {:center (:user-location state)}
     []
     (-> 
       state
       :directions
       (get (:user-location state))
       (get (-> state :selected :name))))})


