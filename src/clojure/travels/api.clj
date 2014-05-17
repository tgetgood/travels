(ns travels.api
  (:require [travels.util :refer [ember-response]]
            [travels.database :as db]
            [korma.core :refer :all]
            [clj-time.core :as t]
            [clj-time.coerce :as tc]
            [clojure.edn :as edn]))

(def irregular-plurals
  {:person :people})

(defn plural
  "Returns the plural of the given keyword. Please make sure the arg
  is a keyword."
  [sing]
  (if (contains? irregular-plurals sing)
    (get irregular-plurals sing)
    (keyword (str (name sing) "s"))))


(defmacro generate-api
  "Takes a keyword corresponding to a korma entity and defines the
  relevant CRUD endpoints. Functions currently are (for entity :user)

  create-user [data]
  get-user [id]
  get-users []

  TODO: I don't like the magic strings for namespacing (str
  \"db/\" (name entity)). There's got to be a better way..."
  [entity]
  ;; create
  `(defn ~(symbol (str "create-" (name entity)))
     [body#]
     (ember-response ~entity
       (let [data# (assoc (get body# ~(str entity)) :created (tc/to-timestamp (t/now)))]
         (insert ~(symbol (str "db/" (name entity))) 
           (values data#)))))
  ;; read
  `(defn ~(symbol (str "get-" (name entity)))
    [id#]
    (ember-response ~entity
      (select ~(symbol (str "db/" (name entity)))
        (where {:id (edn/read-string id#)}))))
  `(defn ~(symbol (str "get-" (name (plural entity))))
    []
    (ember-response ~(plural entity)
      (select ~(symbol (str "db/" (name entity))))))
  ;; update

  ;; delete
  
)



(generate-api :sight)


 


            

