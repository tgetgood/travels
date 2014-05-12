(ns travels.api
  (:require [korma.core :as k :refer :all]))

(defentity sights
  (pk :id)
  (entity-fields :name :description :flagship_photo :additional_photos))

(defn create-sight
  [data]
  ;; Validate!!!!!
  (insert sights
    (values data)))

