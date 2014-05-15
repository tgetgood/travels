(ns travels.api
  (:require [travels.util :refer [ember-response]]
            [travels.database :refer [db]]
            [monger.collection :as mc]
            [monger.query :as q]
            [clojure.edn :as edn]
            [clj-time.core :as t]))

(def sights-coll "sights")

(defn create-sight
  [data]
  ;; Validate!!!!!
  (ember-response :id
   (let [body (assoc data :created (t/now))]
     (mc/ensure-index db sights-coll (array-map :id 1) {:unique true})
     (mc/ensure-index db sights-coll (array-map :location 1) {})
     (let [res (mc/insert-and-return db sights-coll data)
           id  (.toString (:_id res))]
       (mc/update db sights-coll data (assoc data :id id))
       {:status 200 :body {:id id}}))))
                      

(defn get-sights
  []
  (ember-response :sights
    (q/with-collection db sights-coll
      (q/find)
      (q/fields {:_id 0}))))

(defn get-sight
  [id]
  (ember-response :sight
    (q/with-collection db sights-coll
      (q/find {:id (edn/read-string id)})
      (q/fields {:_id 0}))))
