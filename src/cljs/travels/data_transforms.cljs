(ns data-transforms)

(defn get-std-image-src
  [state] 
  (-> state
      :images
      first
      :standard_resolution
      :url))

(defn thumb-urls
  [state]
  (map (fn [i] (-> i :thumbnail :url)) (:images state)))

(defn process-map-data
  [state]
  {:directions (-> 
                 state
                 :directions
                 (get (:user-location state))
                 (get (-> state :selected :name)))})

