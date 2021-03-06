(defproject travels "v0.1"

  :description "Intergalactic Travel Guide"

  :url "https://github.com/tgetgood/travels"

  :min-lein-version "2.0.0"

  :plugins [[lein-environ "0.4.0"]
            [lein-cljsbuild "1.0.3"]
            [com.cemerick/clojurescript.test "0.3.1"]]

  :repl-options {:nrepl-middleware [cemerick.piggieback/wrap-cljs-repl]}

  :source-paths ["src/clj" "src/cljs"]

  :test-paths ["test/clj" "test/cljs"]

  :profiles {:dev {:env {:dev-mode "TRUE"}}
             :production {:env {:prod-mode "TRUE"}}}

  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2322"]

                 [org.clojure/core.async "0.1.338.0-5c5012-alpha"]

                 [cljs-ajax "0.2.6"]
                 [om "0.7.1"]
                 [prismatic/om-tools "0.3.2"]

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

                 ;; testing
                 [org.clojure/test.check "0.5.9"]
                 [com.cemerick/double-check "0.5.7"]
                 ;; dev
                 [com.cemerick/piggieback "0.1.3"]]

  :main travels.server

  :cljsbuild {:builds
              {:dev
               {:source-paths ["src/cljs" "src/clj"]
                :compiler {:id "dev"
                           :libs [""]
                           :output-to "resources/public/js/main.js"
                           :output-dir "resources/public/js/out"
                           :main travels.core
                           :optimizations :none
                           :pretty-print true
                           :source-map true}}

               :production
                 {:source-paths ["src/cljs" "src/clj"]
                  :compiler {:id "prod"
                             :libs [""]
                             :jar true
                             :main travels.core
                             :externs
                             ["src/externs/google-maps-js-api-v3-externs.js"
                              "src/externs/react-externs.js"]
                             :output-to "resources/public/js/main.js"
                             :optimizations :simple
                             :pretty-print false}}}})
