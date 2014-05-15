(ns travels.api
  (:require [travels.util :refer [ember-response]]
            [travels.database :refer [db sight photo]]
            [clojure.edn :as edn]))

(defn create-sight
  [data]
  ;; Validate!!!!!
  (ember-response :id
   (insert sight
     (values (get data "sight")))))

(defn get-sights
  []
  (ember-response :sights
    (select sight)))

(defn get-sightf
  [id]
  (ember-response :sight
  (select sight
    (where {:id (edn/read-string id)}))))
