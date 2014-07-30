(ns travels.files
  (require [travels.util :refer [ember-response]]
           [digest]))

(def image-dir "image-assets")

(defn upload
  [req]
  (ember-response :file
    (let [data (.bytes (:body req))
          hash (digest/md5 data)
          filename (str image-dir "/" hash)
          fileurl (str "images/" hash)]
      (spit filename (:body req))
      {:url fileurl})))

