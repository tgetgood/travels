(ns travels.components
  (:require-macros [cljs.core.async.macros :refer [go go-loop]])
  (:require [travels.gmaps :as gm]
            
            [cljs.core.async :refer [<! >! put! chan]]
            [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]))

(def root-state
  (atom
    {:sites []
     :accepted []
     :rejected []
     :selected {}
     :markers []
     :map-canvas nil}))

(defn travel-bar
  [props owner]
  (reify 
    om/IRender
    (render
      [this]
      (dom/div #js {:className "distance-bar"} 
        (dom/div #js {:className "walk"} 
                (str "Walk: " (-> props :walk :time) " (" 
                     (-> props :walk :distance) ")"))
        (dom/div #js {:className "drive"}
                (str "drive " (-> props :drive :time) " (" 
                     (-> props :drive :distance) ")"))))))

(defn get-std-image
  [app]
  (-> app 
      :images
      first
      :standard_resolution
      :url))

(defn site-view
  [app owner]
  (reify 
    om/IRenderState
    (render-state 
      [this {:keys [focus]}]
      (dom/div #js {:onMouseOver (fn [_] (go (>! focus @app)))}
        (dom/h2  #js {:className "site-name"} (:name app))
        (dom/img #js {:className "main-image" :src (get-std-image app)})
        (om/build travel-bar app)))))

(defn sites-list
  [app owner]
  (reify
    om/IInitState
    (init-state [_]
      {:focus (chan)})
    om/IWillMount
    (will-mount [_]
      (let [focus (om/get-state owner :focus)]
        (go-loop []
          (let [current (<! focus)]
            (om/transact! app :selected
              (fn [_] current))
            (recur)))))
    om/IRenderState
    (render-state
      [this state]
      (apply dom/div #js {:id "main-view" :className "pure-u-1-3"}
        (om/build-all site-view (:sites app)
          {:init-state state})))))

(defn thumbnail-view
  [src owner]
  (reify
    om/IRender
    (render [_]
      (dom/div #js {:className "pure-u-1-3"}
        (dom/img #js {:src src})))))

(defn thumb-urls
  [app]
  (map (fn [i] (-> i :thumbnail :url))
       (:images app)))

(defn details-view
  [app owner]
  (reify
    om/IRender
    (render [_]
      (dom/div #js {:id "details" :className "pure-u-1-3"}
        (dom/h2 #js {:id "details-title"} (:name app))
        (apply dom/div #js {:id "photos" :className "pure-g"}
          (om/build-all thumbnail-view (thumb-urls app)))
        (dom/div #js {:className "description"} 
          (dom/h2 nil "Description")
          (dom/span nil (:description app)))))))

(defn map-view
  [app owner]
  (reify
    om/IDidMount
    (did-mount [_]
      (let [m (gm/init-map "new delhi" (om/get-node owner "map-canvas"))]
        (om/transact! app :map-canvas 
          (fn [_] m))))
    om/IRender
    (render [_]
      (dom/div #js {:className "pure-u-1-3" :id "map-view"}
        (dom/div #js {:id "map-canvas" :ref "map-canvas"})))))


(defn browser-view
  [app owner]
  (reify 
    om/IRender
    (render
      [_]
      (dom/div #js {:className "pure-g-r" :id "container"}
        (om/build sites-list app)
        (om/build details-view (:selected app))
        (om/build map-view app))))) 


(defn attach-root
  []
  (om/root browser-view root-state
    {:target (. js/document (getElementById "attach"))}))

