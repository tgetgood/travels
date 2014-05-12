(defproject travels "v0.0.1"
  
  :description "Unknown"

  :url "N/A"

  :min-lein-version "2.0.0"

  :plugins [[lein-environ "0.4.0"]]

  :source-paths ["src/clojure"]

  :profiles {:dev {:env {:dev-mode "TRUE"}}}

  :dependencies [[org.clojure/clojure "1.5.1"]
                 [environ "0.4.0"]

                 [org.clojure/java.jdbc "0.3.3"]
                 [postgresql "9.3-1101.jdbc4"]
                 [korma "0.3.1"]

                 [com.cemerick/friend "0.2.0"]
                 [ring "1.2.2"]
                 [compojure "1.1.6"]
                 [http-kit "2.1.18"]
                 [ring/ring-json "0.3.1"]]

  :main travels.server
)
                 
