(ns travels.database
  (:require [clojure.java.jdbc :as sql]))

(def db
  {:subprotocol "postgresql"
   :subname     "//localhost:5432/traveldb"})
   

(defn -create-tables!
  (sql/db-do-commands
   db
   (sql/create-table-ddl :locations [:name :text :address :text])))

