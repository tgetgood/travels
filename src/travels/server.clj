(ns travels.server
  (:require [ring.middleware.json :refer [wrap-json-response wrap-json-body]]
            [ring.middleware.reload :as reload]
            [ring.util.response :as response]
            [org.httpkit.server :refer [run-server]]
            [compojure.core :refer :all]
            [compojure.route :as route]
            [compojure.handler :as ch]
            [cemerick.friend :as friend]
            [cemerick.friend [workflows :as workflows]
                             [credentials :as creds]]))

(defroutes site-routes
  ;; The App is all server statically. We might consider a CDN. 
  (GET "/" [] (response/redirect "/index.html"))
  (route/resources ""))

(defn -main
  [& args]
  (let [opts {:port 8000}]
    (run-server site-routes opts)
    (println (str "Server is running on port: " (:port opts)))))
           
