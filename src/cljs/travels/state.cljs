(ns travels.state
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs.core.async :refer [<! >! chan]]

            [travels.maps-data :as md]))

;;;;; App State
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(def root-state
  (atom
    {:sites []
     :accepted []
     :rejected []
     :selected {}
     :directions nil
     :user-location nil}))

(defn- get-fake-data
  []
  (let [out (chan)
        err (chan)]
    ($/ajax-request "/api/fakedatadelhi" :get
           {:format ($/json-response-format {:keywords? true})
            :handler (fn [x]
                       (go
                         (if (first x)
                           (>! out (second x))
                           (>! err (second x)))))})
    [out err]))

(defn load-data-from-server
  [search-term]
  (let [[out err] (get-fake-data)
        data-points (chan 5)]
    
    ;; Split the sites into separate events
    (go 
      (let [sites (<! out)]
        (onto-chan data-points sites)))

    ;; make sure enough data comes back with a point. If not, get it.
    (go (loop []
          (let [site (<! data-sta-points)]
            (swap! root-state (fn [s] (update-in s [:sites] #(conj % site)))))))))
  
