(ns travels.database
  (:require [monger.collection :as mc]
            [monger.core :as mg]
            [monger.db :as mdb]
            [clojure.string :as string]
            [travels.config :as config]))

;;;;; DB init.

(defn- init
  []
  (cond config/devdb?
          (mg/connect)
        config/proddb?
          (mg/connect-via-uri config/db-uri)
        :else
          (throw (Exception. "Don't know how to connect to database."))))

(def db (mg/get-db (init) "travelsdb"))
            
