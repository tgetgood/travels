(ns travels.files
  (require [travels.util :refer [ember-response]]
           [digest]))

(def image-dir "image-assets")

(defn upload
  [req]
  (ember-response :file
    (let [data (.bytes (:body req))
          filename (str image-dir "/" (digest/md5 data))]
      (with-open [w (clojure.java.io/output-stream filename)]
        (.write w (.bytes (:body req)))
        {:filename filename}))))

