(ns travels.api
  (:require [travels.util :refer [ember-response plural]]
            [travels.database :as db]
            [korma.core :refer :all]
            [clj-time.core :as t]
            [clj-time.coerce :as tc]
            [clojure.edn :as edn]))


(defn create-sight
  [body]
  (let [sight (insert db/sight (assoc body "photos" []))
        sid (:id sight)
        photos (map #(assoc % :sight sid) (get body "photos"))
        pid (insert db/photo (values photos))
        pids (map inc (range (- pid (count photos)) pid))]
    (update db/sight
            (set-fields {:photos pids})
            (where {:id sid}))))

(defn get-sight
  [id]
  (select db/sight
          (where {:id id})))
        
    
