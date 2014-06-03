(ns travels.server
  (:require [travels.config :as config]
            [travels.api :as api]
            [travels.util :refer [plural]]
            [travels.files :as files]
            [clojure.edn :as edn]
            [org.httpkit.server :refer [run-server]]
            [ring.middleware.json :refer [wrap-json-response wrap-json-body]]
            [ring.middleware.reload :as reload]
            [ring.middleware.multipart-params :as mp]
            [ring.util.response :as response]
            [compojure [core :refer :all]
             [route :as route]
             [handler :as ch]]
            [cemerick.friend :as friend]
            [cemerick.friend [workflows :as workflows]
                             [credentials :as creds]]))


(defroutes api-router
;  (generate-ember-routes :sight)
;  (generate-ember-routes :photo)
  (POST "/api/sights" {body :body} (api/create-sight body))
  (GET "/api/sights/:id" req (api/get-sight (-> req :route-params :id edn/read-string)))
 ) 

(defroutes dev-router
  (GET  "/" [] (slurp "src/html/index-dev.html"))
  (GET  "/templates.js" [] (slurp "resources/templates.js"))
  (POST "/fileupload" req (files/upload req))
  (GET  "/images/:name" [name] (when
                                   (not (or (.startsWith name ".")
                                            (.startsWith name "/")))
                                 (slurp (str files/image-dir "/" name))))
  (route/files "" {:root "src"}))

(defroutes prod-router
  (GET "/" [] (slurp "src/html/index.html"))
  (route/resources ""))

(defroutes main-router
  (->
   api-router
   wrap-json-response
   wrap-json-body
   ch/api)
  (if config/dev-server?
    (->
     dev-router
     wrap-json-response)
    prod-router))

(defn -main
  [& args]
  (let [opts {:port config/port}
        handler (if config/dev-server?
                  (reload/wrap-reload #'main-router)
                  main-router)]
    (run-server handler opts)
    (println (str "Server running on port " config/port))))
           
