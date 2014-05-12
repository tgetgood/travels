(ns travels.database
  (:require [clojure.java.jdbc :as sql]
            [clojure.string :as string]
            [korma.db :refer [defdb postgres]]
            [travels.config :as config]))

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
  [db]
  (sql/db-do-commands
   db
   (sql/create-table-ddl :locations [:name :text])))

