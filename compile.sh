#!/bin/bash

# see https://github.com/tontof/.emacs.d
find . -name "*.org" -exec emacs -Q -batch {} -l ~/.emacs.d/init.el -f org-export-as-html \;