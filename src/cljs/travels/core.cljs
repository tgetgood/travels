(ns travels.core
   (:require-macros [cljs.core.async.macros :refer [go alt! go-loop]])
   (:require [cljs.core.async :refer [>! <! chan]]
             [ajax.core :as $]
             [travels.components :as components]))

(defn get-fake-data
  []
  (let [out (chan)
        err (chan)]
    ($/ajax-request "/api/fakedatadelhi" :get
           {:format ($/json-response-format {:keywords? true})
            :handler (fn [x]
                       (go
                         (if (first x)
                           (>! out (second x))
                           (>! err (second x)))))})
    [out err]))

(defn ^:export init
  []
  (components/attach-root)
  (go
    (let [[out err] (get-fake-data)
          data (<! out)]
      (swap! components/root-state (fn [x] (assoc x :sites data)))
      )))


      ; (doall (map (fn [d]
      ;               (go
      ;                 (let [mark (<! (gm/create-marker m (.-name d)))]
      ;                   (loop []
      ;                     (let [data  @sites
      ;                           index (.indexOf (map #(.-name %) data) (.-name d))
      ;                           ndata (concat
      ;                                   (take index data)
      ;                                   [(assoc (nth index data) :marker mark)]
      ;                                   (drop (inc index) data))]
      ;                       (if (compare-and-set! sites data ndata)
      ;                         ndata
      ;                         (recur)))))))
      ;            data))
    ; )))









      ; (let [dists (<! (gm/get-distances "new delhi" data))
      ;       proc (->> dists
      ;                 .-rows
      ;                 first
      ;                 .-elements
      ;                 (map (fn [x] (.-duration x)))
      ;                 (filter (comp not nil?))
      ;                 (map #(.-text %))
      ;                 (clj->js))]
      ;   (.log js/console proc)))))



