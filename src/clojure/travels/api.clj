(ns travels.api
  (:require [travels.util :refer [ember-response plural]]
            [travels.database :as db]
            [korma.core :refer :all]
            [clj-time.core :as t]
            [clj-time.coerce :as tc]
            [clojure.edn :as edn]))


(defn create-sight
  [body]
  (let [sight (insert db/sight (values (assoc body "photos" nil)))
                                             ; "created" (tc/date-time (t/now)))))
        sid (:id sight)
        photos (map #(assoc % "sight" sid );"created" (tc/date-time (t/now)))
                    (get body "photos"))]
    (if (> (count photos) 0)
      (let [pid (:id (insert db/photo (values photos)))
            pids (mapv inc (range (- pid (count photos)) pid))]
        (println (sql-only (update db/sight
                (set-fields {"photos" pids})
                (where {:id sid}))))
        (assoc body "photos" photos))
      body)))

(defn get-sight
  [id]
  (select db/sight
          (where {:id id})))
        
    
