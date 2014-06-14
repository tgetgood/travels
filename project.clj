(defproject travels "v0.0.1"
  
  :description "Intergalactic Travel Guide"

  :url "wheredoyouwanttogo.herokuapp.com"

  :min-lein-version "2.0.0"

  :plugins [[lein-environ "0.4.0"]]

  :source-paths ["src/clojure"]

  :profiles {:dev {:env {:dev-mode "TRUE"}}}

  :dependencies [[org.clojure/clojure "1.5.1"]
                 [environ "0.4.0"]
                 [clj-time "0.7.0"]
                 [digest "1.4.4"]
                 
                 [com.novemberain/monger "2.0.0-rc1"]
                 
                 [com.cemerick/friend "0.2.0"]
                 [ring "1.2.2"]
                 [compojure "1.1.6"]
                 [http-kit "2.1.18"]
                 [ring/ring-json "0.3.1"]]

  :main travels.server
) 
                 
