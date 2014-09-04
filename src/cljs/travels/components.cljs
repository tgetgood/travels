(ns travels.components
  (:require-macros [cljs.core.async.macros :refer [go go-loop]])
  (:require [travels.maps-wrapper :as mw]
            [travels.state :refer [root-state]]
            [travels.data-transforms :as dt]

            [cljs.core.async :refer [<! >! put! chan]]
            [om.core :as om :include-macros true]
            [om-tools.core :refer-macros [defcomponent]]
            [om-tools.dom :as dom :include-macros true]))

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
      (dom/img {:class "main-image" :src (dt/get-std-image-src app)})
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
      (om/build-all site-view (mapv #(val %) (:sites app))
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
        (om/build-all thumbnail-view (dt/thumb-urls app)))
      (dom/div {:class "description"}
        (dom/h2 nil "Description")
        (dom/span nil (:description app))))))

;;;; Map

(defcomponent map-view [app owner]
  (init-state [_]
    {:previous {}
     :directions-display nil
     :map nil})
  (did-mount [_]
    (let [m (mw/create-map (:map-data @app))]
      (mw/attach-map! m)
      (om/set-state! owner :map m)))
  (will-update [_ props state]
    (let [old-map (:map state)
          new-map-state (:map-data props)]
      (if (= (mw/get-state old-map) new-map-state)
        (let [new-map (mw/update-state old-map new-map-state)]
          (mw/attach-map! new-map)
          (om/set-state! owner :map new-map)))))
  (render [_]
    (dom/div {:class "pure-u-1-3" :id "map-view"}
      (dom/div {:id "map-canvas" :ref "map-canvas"}))))

;;;; Global App

(defcomponent browser-view [app owner]
  (render [_]
    (dom/div {:class "pure-g-r" :id "container"}
      (om/build sites-list app)
      (om/build details-view (:selected app))
      (om/build map-view (dt/process-map-data app)))))

(defn attach-root []
  (om/root browser-view root-state
    {:target (. js/document (getElementById "attach"))}))

