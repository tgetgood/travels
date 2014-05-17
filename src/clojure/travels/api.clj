(ns travels.api
  (:require [travels.util :refer [ember-response plural]]
            [travels.database :as db]
            [korma.core :refer :all]
            [clj-time.core :as t]
            [clj-time.coerce :as tc]
            [clojure.edn :as edn]))



(defmacro generate-api
  "Takes a keyword corresponding to a korma entity and defines the
  relevant CRUD endpoints. Functions currently are (for entity :user)

  create-user [data]
  get-user [id]
  get-users []

  TODO: I don't like the magic strings for namespacing (str
  \"db/\" (name entity)). There's got to be a better way..."
  [entity]
  `(do
     ;; create
     (defn ~(symbol (str "create-" (name entity)))
       [body#]
       (println body#)
       (ember-response ~entity
         (let [data# (assoc (get body# ~(str (name entity))) "created" (tc/to-timestamp (t/now)))]
           (insert ~(symbol (str "db/" (name entity))) 
             (values data#)))))
     ;; read
     (defn ~(symbol (str "get-" (name entity)))
       [id#]
       (ember-response ~entity
         (select ~(symbol (str "db/" (name entity)))
           (where {:id (edn/read-string id#)}))))
     
     (defn ~(symbol (str "get-" (name (plural entity))))
       []
       (ember-response ~(plural entity)
         (select ~(symbol (str "db/" (name entity))))))
     ;; update
     
     ;; delete
))

(generate-api :sight)
(generate-api :photo)

(create-sight {"sight" {"name" "afdf"}})
