(ns travels.api
  (:require [travels.util :refer [ember-response]]
            [travels.database :refer [db]]
            [clojure.edn :as edn]
            [korma.core :as k :refer :all]))

(defentity sights
  (pk :id)
  (database db)
  (entity-fields :name :description :flagship_photo :additional_photos))

(defn create-sight
  [data]
  ;; Validate!!!!!
  (ember-response :id
   (insert sights
     (values (get data "sight")))))

(defn get-sights
  []
  (ember-response :sights
    (select sights)))

(defn get-sight
  [id]
  (ember-response :sight
  (select sights
    (where {:id (edn/read-string id)}))))
