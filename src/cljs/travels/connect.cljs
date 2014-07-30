(ns travels.connect
  (:require-macros [travels.config :as config])
  (:require [clojure.browser.repl :as repl]))

(when (config/dev-mode?)
  (repl/connect "http://localhost:9000/repl"))

