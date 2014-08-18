(ns travels.core
   (:require-macros [cljs.core.async.macros :refer [go alt! go-loop]]
                    [dommy.macros :as domm]
                    [tailrecursion.javelin :refer [cell= defc defc=]])
   (:require [cljs.core.async :refer [>! <! chan]]
             [ajax.core :as $]
             [dommy.utils :as domu]
             [dommy.core :as dom]
             [tailrecursion.javelin :as jav]

             [travels.gmaps :as gm]))


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


(defn watch
  "Returns a channel to which will be pushed the new value of c each time it
  changes. Changes follow javelin semantics."
  ([c]
   (watch c 1))
  ([c buf]
   (let [out (chan buf)]
     (cell= (when (not (nil? c)) 
              (go (>! out c))))
     out)))

(defn onchange
  "Calls function on new value of cell every time it changes."
  [cell func]
  (let [ch (watch cell)]
    (go
      (while true
        (let [v (<! ch)]
          (func v))))))

(defc sites [])
(defc accepted [])
(defc rejected [])

(defc= active
  (filter #(not (or (some #{%} accepted) (some #{%} rejected))) sites))

(defc selected
  {})

(defc= urls
  (map (fn [d]
          (-> d
              :images
              first
              :standard_resolution
              :url))
         active))

(domm/deftemplate imgnode
  [src]
  [:div
    [:img.main-image {:src src}]])

(domm/deftemplate thumb
  [src]
  [:div.pure-u-1-3.thumbnail
   [:img {:src src}]])

(defn render-main-list
  [urls]
  (dom/append! (domm/sel1 :#main-view) (map imgnode urls)))

(defn render-details
  [site]
  (let [imgs (map (fn [i]
                    (-> i
                        :thumbnail
                        :url))
                 (:images site))
        des  (:description site)]
      (dom/set-text! (domm/sel1 :#description) des)
      (dom/append! (domm/sel1 :#photos) (map thumb imgs))))

(onchange urls render-main-list)
(onchange selected render-details)

(defn ^:export init
  []
  (go
    (let [m (<! (gm/init-map "new delhi" (domm/sel1 :#map-canvas)))
          [out err] (get-fake-data)
          data (<! out)]
      (reset! sites data)
      (reset! selected (first @sites))

    )))





      ; (doall (map (fn [d] (gm/create-marker m (.-name d))) data))
      ; (gm/create-marker m "new delhi")




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



