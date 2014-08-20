(ns travels.state
  (:require-macros [tailrecursion.javelin :refer [cell= defc defc=]]
                   [cljs.core.async.macros :refer [go]])
  (:require [cljs.core.async :refer [>! <! chan]]
            [tailrecursion.javelin]))

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
  [cell func] (let [ch (watch cell)]
    (go
      (while true
        (let [v (<! ch)]
          (func v))))))

;;;;; Logic for maintaining application state.
;;;;;
;;;;; Currently state is maintained by a small collection of atoms that are
;;;;; accessed directly by various parts of the program. They are declarative
;;;;; and auto-update giving nice reactivity, but this doesn't feel good...


(defc sites [])
(defc accepted [])
(defc rejected [])
(defc index 0)

(defc map-canvas {})

(defc= active
  (filter #(not (or (some #{%} accepted) (some #{%} rejected))) sites))

(defc= selected
  (when (not (empty? active))
    (nth active index)))

(defc= map-select
  [map-canvas selected])

