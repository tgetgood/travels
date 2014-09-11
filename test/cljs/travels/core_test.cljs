(ns travels.core-test
    (:require-macros [cemerick.cljs.test
                      :refer (is deftest with-test run-tests testing test-var)])
      (:require [cemerick.cljs.test :as t]))

(deftest fail
  (is (= 1 0)))

(t/test-ns 'travels.core-test)
