(defproject travels "v0.1"
  
  :description "Intergalactic Travel Guide"

  :url "intergalactic.herokuapp.com"

  :min-lein-version "2.0.0"

  :plugins [[lein-environ "0.4.0"]
            [lein-cljsbuild "1.0.3"]]

  :source-paths ["src/clojure" "src/cljs"]

  :profiles {:dev {:env {:dev-mode "TRUE"}}
             :production {:env {:prod-mode "TRUE"}}}

  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2268"]

                 [com.newrelic.agent.java/newrelic-agent "3.2.0"]

                 [prismatic/dommy "0.1.2"]
                 [domina "1.0.2"]

                 [environ "0.4.0"]
                 [clj-time "0.7.0"]
                 [digest "1.4.4"]
                 
                 [com.novemberain/monger "2.0.0-rc1"]
                 
                 [com.cemerick/friend "0.2.0"]
                 [ring "1.2.2"]
                 [compojure "1.1.6"]
                 [http-kit "2.1.18"]
                 [ring/ring-json "0.3.1"]]

  :java-agents [[com.newrelic.agent.java/newrelic-agent "3.2.0"]]

  :main travels.server

  :cljsbuild {:builds
              [{
                :source-paths ["src/cljs"]
                :compiler {;; CLS generated JS script filename
                           :output-to "resources/public/js/cljs.js"

                           ;; minimal JS optimization directive
                           :optimizations :whitespace

                           ;; generated JS code prettyfication
                           :pretty-print true}}]}
) 
                 
