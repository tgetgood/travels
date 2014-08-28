(ns travels.state
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs.core.async :refer [<! >! chan onto-chan]]

            [travels.maps-data :as md]))

;;;;; App State
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(def site-store (atom {}))

(def root-state
  (atom
    {:sites site-store
     :accepted []
     :rejected []
     :selected {}
     :directions nil
     :user-location nil}))

(defn handle-new-data
  [in-ch]
  (let [[id datum] (<! in-ch)]
    (if (contains? id @site-store)
      (update-in site-store [id] #(conj % datum))
      (swap! site-store #(conj % {id #{datum}})))))

