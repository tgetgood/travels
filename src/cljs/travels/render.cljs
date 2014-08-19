(ns travels.render
  (:require-macros [dommy.macros :refer [sel1]])
  (:require [travels.templates :as t]
            [travels.state :refer [index]]
            
            [dommy.core :as dom :refer [listen! append! set-html!]]))

(defn display-info
  "Returns a map representing the list of active items ready to be passed into
  a render function (template)"
  [active]
  (map (fn [d]
          {:name       (:name d)
           :image-src  (-> d
                           :images
                           first
                           :standard_resolution
                           :url)
           :walk-time  (-> d :walk :time :text)
           :walk-dist  (-> d :walk :distance)
           :drive-time (-> d :drive :time :text)
           :drive-dist (-> d :drive :distance)})
         active))

(defn detail-info
  "Returns a map representing the details on a given site ready for rendering."
  [site]
  {:description (:description site)
   :image-srcs  (map (fn [i]
                       (-> i
                          :thumbnail
                          :url))
                     (:images site))
   :name        (:name site)})


;;;; Manual rendering functions. Ugly as hell. Hopefully Handlebars will make
;;;; these unnecessary...

(defn render-main-list
  "Renders images in left scrolling bar."
  [active]
  (let [display-objs (display-info active)
        nodes (map t/imgnode display-objs)
        view (sel1 :#main-view)]
    (set-html! view "")
    (append! view nodes)
    (doall
      (map (fn [n i] (listen! n :mouseover (fn [ev] (reset! index i))))
           nodes
           (range (count nodes))))))

(defn render-details
  "Render middle detail panel."
  [site]
  (let [node (sel1 :#details)
        dobj (detail-info site)]
    (set-html! node "")
    (append! node (t/details dobj))))
