(ns travels.state
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs.core.async :refer [<! >! chan onto-chan]]

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
     :directions nil
     :user-location nil}))

(defn handle-new-data
  [in-ch]
  (go (loop [] 
        (let [[id datum] (<! in-ch)]
          (if (contains? id @site-store)
            (swap! root-state (fn [s] 
                                (update-in s [:sites id] #(merge % datum))))
            (swap! root-state (fn [s] 
                                (update-in s [:sites] #(conj % {id datum})))))
          (recur)))))

