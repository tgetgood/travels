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
  (let [current-location (maps/create-marker (:user-location state) "user")
        loc-of-interest (maps/create-marker (-> state :selected :location) "site")]
  {:directions (-> state :directions
                   (get (:user-location state))
                   (get (-> state :selected :location)))}))

