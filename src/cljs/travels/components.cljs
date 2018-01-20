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
        (str "walk time: "
             (-> props :walk :time) " ("
             (-> props :walk :distance) ")")))))

(defcomponent thumbnail-view [[src n] owner]
  (render-state [this {:keys [img-chan]}]
    (dom/div {:class ""
              :on-mouse-over (fn [_] (put! img-chan n))}
      (dom/img {:src src :class "thumbnail"}))))

(defcomponent site-view [app owner]
  (init-state [_]
    {:desc false
     :img-n 0
     :img-chan (chan)})
  (will-mount [_]
    (let [img-chan (om/get-state owner :img-chan)]
      (go (loop []
            (om/set-state! owner :img-n (<! img-chan))
            (recur)))))
  (render-state [this {:keys [focus desc img-n img-chan]}]
    (dom/div {:on-mouse-over (fn [_] (go (>! focus @app)))}
      (dom/div {:class "title-bar"
                :on-mouse-over (fn [_](om/set-state! owner :desc true))
                :on-mouse-out (fn [_](om/set-state! owner :desc false))}
        (dom/h2  {:class "site-name"} (:name app))
        (when desc
          (dom/div {:class "description"}
                   (:description app))))
      (dom/img {:class "main-image" :src (dt/get-std-image-src app img-n)})
      (dom/div {:class "pure-g thumb-bar"}
        (om/build-all thumbnail-view (dt/thumb-urls app)
                      {:init-state {:img-chan img-chan}}))
      (om/build travel-bar (:travel app)))))

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
      (om/build-all site-view (dt/sorted-site-list (:sites app))
        {:init-state state}))))

;;;; Map

(defcomponent map-view [app owner]
  (init-state [_]
    {:map-data nil})
  (did-mount [_]
    (let [map-data (om/get-state owner :map-data)]
      (mw/attach-map! (om/get-node owner "map-canvas") map-data)
      (om/set-state! owner :map-data map-data)))
  ;; Is did-update better or does it matter?
  (will-update [_ props state]
    (when (not= (:map-data state) (:map-data props))
        (mw/attach-map! (om/get-node owner "map-canvas") (:map-data props))
        (om/set-state! owner :map-data (:map-data props))))
  (will-unmount [_]
    (mw/detach-map! (om/get-node owner "map-canvas")))
  (render [_]
    (dom/div {:class "pure-u-2-3" :id "map-view"}
      (dom/div {:id "map-canvas" :ref "map-canvas"}))))

;;;; Global App

(defcomponent browser-view [app owner]
  (render [_]
    (dom/div {:class "pure-g-r" :id "container"}
      (om/build sites-list app)
      (om/build map-view {:map-data (dt/process-map-data app)}))))

(defn attach-root []
  (om/root browser-view root-state
    {:target (. js/document (getElementById "attach"))}))
