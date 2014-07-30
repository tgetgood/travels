(ns travels.cljs.connect
  (:require [travels.clj.config :as config]
            [clojure.browser.repl :as repl]))

(when config/dev-mode?
  (repl/connect "http://localhost:9000/repl"))

