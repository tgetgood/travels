(ns travels.components
  (:require-macros [cljs.core.async.macros :refer [go go-loop]])
  (:require [travels.gmaps :as gm]
            
            [cljs.core.async :refer [<! >! put! chan]]
            [om.core :as om :include-macros true]
            [om-tools.core :refer-macros [defcomponent]]
            [om-tools.dom :as dom :include-macros true]))

;;;;; App State
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(def root-state
  (atom
    {:sites []
     :accepted []
     :rejected []
     :selected {}
     :directions nil
     :user-location nil}))

;;;;; Data Formatting
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn get-std-image-src
  [app]
  (-> app 
      :images
      first
      :standard_resolution
      :url))

(defn thumb-urls
  [app]
  (map (fn [i] (-> i :thumbnail :url)) (:images app))) 

;;;;; Components
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;;;; Left Bar

(defcomponent travel-bar [props owner]
  (render [this]
    (dom/div {:class "distance-bar"} 
      (dom/div {:class "walk"} 
        (str "Walk: " (-> props :walk :time) " (" 
             (-> props :walk :distance) ")"))
      (dom/div {:class "drive"}
        (str "drive " (-> props :drive :time) " (" 
             (-> props :drive :distance) ")")))))
(defcomponent site-view [app owner]
  (render-state [this {:keys [focus]}]
    (dom/div {:on-mouse-over (fn [_] (go (>! focus @app)))
              :on-click (fn[_] (.log js/console (clj->js @app)))}
      (dom/h2  {:class "site-name"} (:name app))
      (dom/img {:class "main-image" :src (get-std-image-src app)})
      (om/build travel-bar app))))

(defcomponent sites-list [app owner]
  (init-state [_]
    {:focus (chan)})
  (will-mount [_]
    (let [focus (om/get-state owner :focus)]
      (go-loop []
        (let [current (<! focus)]
          (om/transact! app :selected
            (fn [_] current))
          (recur)))))
  (render-state [this state]
    (dom/div {:id "main-view" :class "pure-u-1-3"}
      (om/build-all site-view (:sites app)
        {:init-state state})))) 

;;;; Details Pane 

(defcomponent thumbnail-view [src owner]
  (render [_]
    (dom/div {:class "pure-u-1-3"}
      (dom/img {:src src}))))

(defcomponent details-view [app owner]
  (render [_]
    (dom/div {:id "details" :class "pure-u-1-3"}
      (dom/h2 {:id "details-title"} (:name app))
      (dom/div {:id "photos" :class "pure-g"}
        (om/build-all thumbnail-view (thumb-urls app)))
      (dom/div {:class "description"} 
        (dom/h2 nil "Description")
        (dom/span nil (:description app))))))

;;;; Map 

(defcomponent map-view [app owner]
  (init-state [_]
    {:directions-display nil
     :selected-marker nil
     :user-marker nil
     :directions nil
     :map nil})
  (did-mount [_]
    (let [mch (gm/init-map "new delhi" (om/get-node owner "map-canvas"))]
      (go (let [m  (<! mch)
                dd (google.maps.DirectionsRenderer.)]
            (om/set-state! owner :map m)
            (.setMap dd m)
            (om/set-state! owner :directions-display dd)))))
  (will-update [_ props state]
    (when (not (nil? (om/get-state owner :map)))
      (when (not (= (:directions props) (:directions state)))
        (.setDirections (:directions-display state) (:directions props))
        (om/set-state! owner :directions (:directions props)))
      (letfn [(move-marker! [old-key new-key]
                (let [old-marker   (old-key state)
                      new-position (new-key props)]
                  (let [new-marker (gm/create-marker new-position)]
                    (when old-marker 
                      (.setMap old-marker nil))
                    (.setMap new-marker (:map state))
                    (om/set-state! owner old-key new-marker))))]
          (move-marker! :selected-marker :selected-location)
          (move-marker! :user-marker :user-location))))
  (render [_]
    (dom/div {:class "pure-u-1-3" :id "map-view"}
      (dom/div {:id "map-canvas" :ref "map-canvas"}))))

;;;; Global App

(defcomponent browser-view [app owner]
  (render [_]
    (dom/div {:class "pure-g-r" :id "container"}
      (om/build sites-list app)
      (om/build details-view (:selected app))
      (om/build map-view {:directions (:directions app)
                          :user-location (:user-location app)
                          :selected-location (-> app :selected :location)}))))

(defn attach-root []
  (om/root browser-view root-state
    {:target (. js/document (getElementById "attach"))}))

