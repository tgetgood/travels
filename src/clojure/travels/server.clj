(ns travels.server
  (:require [travels.config :as config]
            [travels.api :as api]
            [travels.util :refer [plural]]
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


(defmacro generate-ember-routes
  "Routing magic."
  [ent]
  `(do
     (defroutes route# 
       (POST    ~(str "/api/" (name (plural ent)))
                {body# :body}
                (~(symbol "api" (str "create-" (name ent))) body#))
       
       (GET     ~(str "/api/" (name (plural ent)) "/:id")
                [id#]
                (~(symbol "api" (str "get-" (name ent))) id#))

       (GET     ~(str "/api/" (name (plural ent)))
                []
                (~(symbol "api" (str "get-" (name (plural ent))))))

       (PUT     ~(str "/api/" (name (plural ent)) "/:id")
                [req#]
                (~(symbol "api" (str "update-" (name ent))) req#))

       (DELETE  ~(str "/api/" (name (plural ent)) "/:id")
                [id#]
                (~(symbol "api" (str "delete-" (name ent))) id#)))
     route#))
  

(defroutes api-router
  (generate-ember-routes :sight)
  (generate-ember-routes :photo)
 ) 

(defroutes dev-router
  (GET "/" [] (slurp "src/html/index-dev.html"))
  (GET "/templates.js" [] (slurp "resources/templates.js"))
  (route/files "" {:root "src"} ))

(defroutes prod-router
  (GET "/" [] (slurp "src/html/index.html"))
  (route/resources ""))

(defroutes main-router
  (->
   api-router
   wrap-json-response
   wrap-json-body
   api/json-type-convert-handler
   ch/api)
  (if config/dev-server?
    dev-router
    prod-router))

(defn -main
  [& args]
  (let [opts {:port config/port}
        handler (if config/dev-server?
                  (reload/wrap-reload #'main-router)
                  main-router)]
    (run-server handler opts)
    (println (str "Server running on port " config/port))))
           
