(defproject travels "v0.0.1"
  
  :description "Unknown"

  :url "N/A"

  :min-lein-version "2.0.0"

  :source-path "src/clojure"

  :dependencies [[org.clojure/clojure "1.5.1"]
                 [com.cemerick/friend "0.2.0"]
                 [ring "1.2.2"]
                 [compojure "1.1.6"]
                 [http-kit "2.1.18"]
                 [ring/ring-json "0.3.1"]]

  :main clojure.travels.server
)
                 
