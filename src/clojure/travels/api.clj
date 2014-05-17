(ns travels.api
  (:require [travels.util :refer [ember-response plural]]
            [travels.database :as db]
            [korma.core :refer :all]
            [clj-time.core :as t]
            [clj-time.coerce :as tc]
            [clojure.edn :as edn]))

(defn maybe-convert
  "This is a hack to typecast string ids from ember into bigint ids
  for postgres. There's got to be a cleaner way..."
  [m]
  (if-let [num (get m "sight")]
    (assoc m "sight" (Integer. num))
    m))


(defmacro generate-api
  "Takes a keyword corresponding to a korma entity and defines the
  relevant CRUD endpoints. Functions currently are (for entity :user)

  create-user [data]
  get-user [id]
  get-users []
  update-user [request]
  delete-user [id]

  TODO: I don't like the magic strings for namespacing (str
  \"db/\" (name entity)). There's got to be a better way..."
  [entity]
  `(do
     ;; create
     (defn ~(symbol (str "create-" (name entity)))
       [body#]
       (ember-response ~entity
         (let [inner# (maybe-convert (get  body# ~(str (name entity))))
               data# (assoc inner# "created" (tc/to-timestamp (t/now)))]
           (insert ~(symbol "db" (str (name entity))) 
             (values data#)))))
     ;; read
     (defn ~(symbol (str "get-" (name entity)))
       [id#]
       (ember-response ~entity
         (select ~(symbol "db" (str (name entity)))
           (where {:id (edn/read-string id#)}))))
     
     (defn ~(symbol (str "get-" (name (plural entity))))
       []
       (ember-response ~(plural entity)
         (select ~(symbol "db" (str (name entity))))))
     ;; update
     (defn ~(symbol (str "update-" (name entity)))
       [req#]
       (let [{:keys [id#]} (:route-params req#)
             body#         (maybe-convert (get (:body req#) ~(str (name entity))))
             data#         (assoc body# "last_modified" (tc/to-timestamp (t/now)))]
         (ember-response ~entity
           (do
             (update ~(symbol "db" (str (name entity)))
                     (set-fields data#)
                     (where {:id id#}))
             data#))))
                         
     ;; delete
     (defn ~(symbol (str "delete-" (name entity)))
       [id#]
       (ember-response ~entity
         (let [old# (select ~(symbol "db" (str (name entity)))
                            (where {:id id#}))]
           (delete ~(symbol "db" (str (name entity)))
                   (where {:id id#}))
           old#)))
           
))

(generate-api :sight)
(generate-api :photo)

