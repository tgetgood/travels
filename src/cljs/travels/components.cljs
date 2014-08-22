(ns travels.components
  (:require-macros [cljs.core.async.macros :refer [go go-loop]])
  (:require [cljs.core.async :refer [<! >! put! chan]]
            [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]))

(def root-state
  (atom
    {:sites []
     :accepted []
     :rejected []
     :index 0
     :selected {}
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
      (dom/div #js {:onMouseover (fn [ev] (put! focus @app))}
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
          (let [index (<! focus)]
            (om/transact! app :index
              (fn [i] index))
            (recur)))))
    om/IRenderState
    (render-state
      [this state]
      (dom/div #js {:className "pure-u-1-3"}
        (om/build-all site-view (:sites app)
          {:init-state state})))))

(defn contact-view [contact owner]
  (reify
    om/IRender
    (render [this]
      (dom/li nil (:name contact)))))


(defn contacts-view [app owner]
  (reify
    om/IRender
    (render [this]
      (dom/div nil
        (dom/h2 nil "Contact list")
        (apply dom/ul nil
          (om/build-all contact-view (:sites app)))))))


(defn attach-root
  []
  (om/root sites-list root-state
    {:target (. js/document (getElementById "attach"))}))

