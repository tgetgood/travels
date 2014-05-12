(ns travels.database
  (:require [clojure.java.jdbc :as sql]
            [clojure.string :as string]
            [korma.db :refer [defdb postgres]]
            [travels.config :as config]))

(def sight-schema
  {:name              :text
   :id                :bigserial
   :description       :text
   :address           :text
   :geocoordinates   :point
   :location          :text
   :flagship_photo    :text
   :additional_photos "text[]"
   :created           :timestamptz
   :last_modified     :timestamptz})
   

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

(defn -create-tables!
  []
  (sql/db-do-commands
   db
   (apply (partial sql/create-table-ddl :sights) sight-schema))) 

