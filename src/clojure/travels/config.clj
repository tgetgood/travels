(ns travels.config
  (:require [environ.core :refer [env]]
            [clojure.edn :refer [read-string]]))

(defn getenv
  "Takes an environ formatted var keyword and grabs the value.
   If not present returns default if given."
  ([var-key] (getenv var-key nil))
  ([var-key default]
     (if-let [val (env var-key)]
       val
       default)))

(def dev-server? (= (getenv :dev-mode "") "TRUE"))

(def port (read-string (getenv :port "8000")))
