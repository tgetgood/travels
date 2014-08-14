(defproject travels "v0.1"
  
  :description "Intergalactic Travel Guide"

  :url "intergalactic.herokuapp.com"

  :min-lein-version "2.0.0"

  :plugins [[lein-environ "0.4.0"]
            [lein-cljsbuild "1.0.3"]]

  :repl-options {:nrepl-middleware [cemerick.piggieback/wrap-cljs-repl]}

  :source-paths ["src/clj" "src/cljs"]

  :profiles {:dev {:env {:dev-mode "TRUE"}}
             :production {:env {:prod-mode "TRUE"}}}

  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2268"]

                 [prismatic/dommy "0.1.2"]
                 [domina "1.0.2"]

                 [com.cognitect/transit-cljs "0.8.158"]
                 [com.cognitect/transit-clj "0.8.229"]

                 [environ "0.4.0"]
                 [clj-time "0.7.0"]
                 [digest "1.4.4"]
                 
                 [com.novemberain/monger "2.0.0-rc1"]
                 
                 [com.cemerick/friend "0.2.0"]
                 [ring "1.2.2"]
                 [compojure "1.1.6"]
                 [http-kit "2.1.18"]
                 [ring/ring-json "0.3.1"]
                 
                 ;; dev
                 [com.cemerick/piggieback "0.1.3"]]

  :main travels.server

  :cljsbuild {:builds
              {:dev {:source-paths ["src/cljs" "src/clj"]
                     :compiler {:id "dev"
                                :output-to "resources/public/js/main.js"
                                :output-dir "resources/public/js/out"
                                :optimizations :none
                                :pretty-print true
                                :source-map true}}
               :prod {:source-paths ["src/cljs"]
                      :compiler {
                                 :output-to "resources/public/js/main.js"
                                 :optimizations :advanced
;                                 :source-map false
                                 :pretty-print false}}

               }}
  ) 
                 
