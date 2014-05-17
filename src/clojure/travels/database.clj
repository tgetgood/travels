(ns travels.database
  (:require [clojure.java.jdbc :as sql]
            [clojure.string :as string]
            [korma.db :refer [defdb postgres]]
            [korma.core :as k :refer :all]
            [travels.config :as config]))

;;;;; Schemata

(def sight-schema
  {:name              :text
   :id                :bigserial
   :description       :text
   :address           :text
   :geocoordinates    :point
   :location          :text
   :photos            "bigint[]"
   :created           :timestamptz
   :last_modified     :timestamptz})

(def photo-schema
  {:id            :bigserial
   :sight         :bigint
   :link          :text
   :flagship      :bool
   :created       :timestamptz})


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
           {:classname   "org.postgresql.Driver"
            :subprotocol "postgresql"
            :subname     (str "//" (nth match 3))
            :user        (nth match 1)
            :password    (nth match 2)
            ;; :ssl         true ; Eventually needed
            :make-pool?  true})
         :else
         (throw (Exception. "Don't know which database to connect to.")))))

;;;;; create tables. Where should this be?

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
;  (entity-fields :name :description :photos)
  (has-many photo {:fk :sight}))

(defentity photo
  (pk :id)
  (database db)
  (table :photos)
  (belongs-to sight))

