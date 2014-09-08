(ns travels.core
   (:require-macros [cljs.core.async.macros :refer [go alt! go-loop]])
   (:require [cljs.core.async :refer [>! <! chan]]
             [travels.state :as state]
             [travels.server :as server]
             [travels.components :as components]))

(defn ^:export init
  []
  (components/attach-root)

  (swap! state/root-state assoc 
         :user-location {:lat 28.650144 :lng 77.232335})

  (state/handle-new-data (server/fetch)))

