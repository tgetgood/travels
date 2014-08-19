(ns travels.templates
  (:require-macros [dommy.macros :refer [deftemplate]]))

(deftemplate imgnode
  [{:keys [name 
           image-src
           walk-time
           walk-distance
           drive-time]
           }]
  [:div.main-image-container 
   [:h2.site-name name]
   [:img.main-image {:src image-src}]
   [:div.dist-bar
    [:div.walk  (str "Walk: " walk-time "(" walk-distance ")")]
    [:div.drive (str "Drive: " drive-time)]]])

(deftemplate thumb
  [src]
  [:div.pure-u-1-3
   [:img {:src src}]])

(deftemplate details
  [{:keys [name image-srcs description]}]
  [:div#details
   [:h2#details-title name]
   [:div#photos 
    (map thumb image-srcs)]
   [:div#description 
    [:h2 "Description"]
    [:span description]]])

