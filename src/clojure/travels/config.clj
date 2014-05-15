(ns travels.config
  (:require [environ.core :refer [env]]
            [clojure.edn :as edn]))

(defn getenv
  "Takes an environ formatted var keyword and grabs the value.
   If not present returns default if given."
  ([var-key] (getenv var-key nil))
  ([var-key default]
     (if-let [val (env var-key)]
       val
       default)))


(def port (edn/read-string (getenv :port "8000")))

(def dev-server? (= (getenv :dev-mode "") "TRUE"))

(def devdb? (= (getenv :dev-mode "") "TRUE"))

(def proddb? (= (getenv :prod-mode "") "TRUE"))

(def db-uri (getenv :mongohq-url "postgres://thomas:@localhost:5432/traveldb"))
