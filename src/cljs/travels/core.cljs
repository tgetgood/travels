(ns travels.core
   (:require-macros [cljs.core.async.macros :refer [go]])
   (:require [cljs.core.async :refer [>! <! chan]]
             [ajax.core :as $]))


(defn handler
  [res]
  (if (not (first res))
    (.log js/console "failed to load from server")
    (.log js/console (second res))))

(defn get-fake-data
  []
  ($/ajax-request "/api/fakedatadelhi" :get
         {:format ($/json-response-format {})
          :handler handler }))
          

(defn ^:export init []
  (.log js/console  (get-fake-data)))

