(ns travels.api
  (:require [travels.util :refer [ember-response]]
            [korma.core :as k :refer :all]))

(defentity sights
  (pk :id)
  (entity-fields :name :description :flagship_photo :additional_photos))

(defn create-sight
  [data]
  ;; Validate!!!!!
  (ember-response :id
   (insert sights
     (values data))))

(defn get-sights
  []
  (ember-response :sights
    (select sights)))

(defn get-sight
  [id]
  (ember-response :sight
  (select sights
    (where (:id id)))))
