(ns travels.data-transforms-test
    (:require [clojure.test.check :as sc]
              [clojure.test.check.generators :as gen]
              [clojure.test.check.properties :as prop :include-macros true]
              
              [travels.data-transforms :refer []])
    (:require-macros [clojure.test.check.clojure-test :refer [defspec]]))

(defspec a-test
  10
  (prop/for-all [v gen/int]
                (> 0 v)))


