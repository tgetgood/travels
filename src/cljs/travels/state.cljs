(ns travels.state
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs.core.async :refer [<! >! chan onto-chan mult tap]]

            [travels.maps-data :as md]))

;;;;; App State
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(def site-store (atom {}))

(def root-state
  (atom
    {:sites {}
     :accepted []
     :rejected []
     :selected {}
     :directions {}
     :user-location nil}))

(defn- tap-watch
  [f m]
  (let [out (chan)]
    (f out)
    (tap m out)))

(defn update-store
  [in-ch]  
  (go (loop [] 
        (let [[id datum] (<! in-ch)]
          (if (contains? id @site-store)
            (swap! root-state (fn [s] 
                                (update-in s [:sites id] #(merge % datum))))
            (swap! root-state (fn [s] 
                                (update-in s [:sites] #(conj % {id datum})))))
          (recur)))))

(defn get-directions
  [in-ch]
  (go (loop []
        (let [[id datum] (<! in-ch)
              origin (:user-location @root-state)
              dest   (:name datum)
              dirs   (<! (md/get-directions 
                           {:origin origin
                            :destination dest
                            :travelMode google.maps.TravelMode.WALKING}))]
          (swap! root-state 
                 (fn [s] (update-in s [:directions origin] 
                           #(assoc % dest dirs))))
          (swap! root-state assoc-in [:sites id :travel] 
                 {:walk 
                  {:time 
                   (-> dirs .-routes first .-legs first .-duration .-text)
                   :distance 
                   (-> dirs .-routes first .-legs first .-distance .-text)}})
          (recur)))))

(defn handle-new-data
  [in-ch]
  (let [m (mult in-ch)]
    (tap-watch update-store m)
    (tap-watch get-directions m)))
