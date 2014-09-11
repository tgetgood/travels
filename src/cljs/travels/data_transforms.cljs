(ns travels.data-transforms
  (:require [travels.maps-wrapper :refer [create-map]]))

(defn get-std-image-src
  [state n] 
  (-> state
      :images
      (nth n)
      :standard_resolution
      :url))

(defn thumb-urls
  [state]
  (map (fn [i n] [(-> i :thumbnail :url) n]) 
       (:images state) 
       (-> state :images count range)))


(defn process-map-data
  [state]
  (create-map 
     {:center (:user-location state)}
     {:markers []
      :directions (-> 
                   state
                   :directions
                   (get (:user-location state))
                   (get (-> state :selected :name)))}))

(defn sorted-site-list
  [sites]
  (let [checkfn (fn [x] (-> x :travel :walk :ctime))
        site-list (map val sites)
        has-time (group-by #(nil? (checkfn %)) site-list)]
    (concat (sort-by checkfn (get has-time false)) (get has-time true))))
           
