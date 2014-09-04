(ns travels.maps-wrapper)

(def default-map-opts 
  {:disableDefaultUI true
   :zoom 12
   :center nil
   :mapTypeId google.maps.MapTypeId.ROADMAP})

(defn create-map
  "Returns a hashmap representing a desired map display state.
  Basically just fills in a bunch of defaults..."
  [map-opts & [extra-data]]
  (let [opts (merge default-map-opts map-opts)
        {:keys [markers directions]} extra-data]
    {:opts opts
     :markers (if (nil? markers) [] markers)
     :directions directions}))

(defn- update-map!
  "Updates a map in place to reflect the given data."
  [{:keys [map-obj map-data]} new-data]
  ())

(def maps (atom {}))

(defn attach-map!
  "Creates a new map object attached to the given DOM element if one does not
  already exist and updates it to match the given data. If there is already a
  map attached it is modified to show the new data." 
  [elem map-data]
  (when (not (contains? @maps elem))
    (let [map-obj (google.maps.Map. elem (clj->js (:opts map-data)))]
      (swap! maps (fn [s] (assoc s elem {:map-obj map-obj :map-data map-data})))))
  (update-map! (get @maps elem) map-data))

(defn detach-map!
  [elem]
  (swap! maps (fn [s] (dissoc s elem))))
