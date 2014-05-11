(ns travels.server
  (:require [travels.config :as config]

            [org.httpkit.server :refer [run-server]]
            [ring.middleware.json :refer [wrap-json-response wrap-json-body]]
            [ring.middleware.reload :as reload]
            [ring.util.response :as response]
            [compojure [core :refer :all]
                       [route :as route]
                       [handler :as ch]]
            [cemerick.friend :as friend]
            [cemerick.friend [workflows :as workflows]
                             [credentials :as creds]]))

(defroutes dev-router
  (GET "/" [] (slurp "src/html/index-dev.html"))
  (GET "/templates.js" [] (slurp "resources/templates.js"))
  (route/files "" {:root "src"} ))

(defroutes prod-router
  (GET "/" [] (slurp "src/html/index.html"))
  (route/resources ""))

(defn -main
  [& args]
  (let [opts {:port config/port}
        handler (if config/dev-server?
                  (reload/wrap-reload #'dev-router)
                  prod-router)]
    (run-server handler opts)
    (println (str "Server running on port " config/port))))
           
