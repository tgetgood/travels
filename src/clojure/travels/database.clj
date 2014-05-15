(ns travels.database
  (:require [clojure.java.jdbc :as sql]
            [clojure.string :as string]
            [korma.db :refer [defdb postgres]]
            [korma.core :as k :refer :all]
            [travels.config :as config]))

;;;;; DB init.

(def db
  (postgres
   (cond config/devdb?
         {:classname "org.postgresql.Driver"
          :subprotocol "postgresql"
          :subname "//localhost:5432/traveldb"}
         config/proddb?
         ;; ghetto ass URL parsing cause connection-uri doesn't work.
         (let [re #"postgres://([^:\s]+):([^:@\s]*)@(.*)"
               match (re-find re config/db-uri)]
           (println match)
           {:classname   "org.postgresql.Driver"
            :subprotocol "postgresql"
            :subname     (str "//" (nth match 3))
            :user        (nth match 1)
            :password    (nth match 2)
            ;; :ssl         true ; Eventually needed
            :make-pool?  true})
         :else
         (throw (Exception. "Don't know which database to connect to.")))))

;;;;; Schemata

(def sight-schema
  {:name              :text
   :id                :bigserial
   :description       :text
   :address           :text
   :geocoordinates    :point
   :location          :text
   :created           :timestamptz
   :last_modified     :timestamptz})

(def photo-schema
  {:id            :bigserial
   :sight_id      :bigint
   :link          :text
   :primary_photo :bool
   :created       :timestamptz})

;;;;; create tables. Where should this be?

(defn -wipe-tables!
  []
  (when config/devdb?
    (sql/db-do-commands
     db
     (sql/drop-table-ddl :sights)
     (sql/drop-table-ddl :photos))))

(defn -create-tables!
  []
  (sql/db-do-commands
   db
   (apply (partial sql/create-table-ddl :sights) sight-schema)
   (apply (partial sql/create-table-ddl :photos) photo-schema))) 

;;;;; entities

(declare sight photo)

(defentity sight
  (pk :id)
  (database db)
  (table :sights)
  (entity-fields :name :description :photos)
  (has-many photo {:fk :sight_id}))

(defentity photo
  (pk :id)
  (database db)
  (table :photos)
  (belongs-to sight))

(def test-sight
  {:name "some"
   :photos [{:link "sdfdsf" :primary_photo false}]
   })
 
