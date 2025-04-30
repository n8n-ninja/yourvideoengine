#!/bin/bash

# Commit avec date + push
git add .
git commit -m "Auto commit $(date '+%Y-%m-%d %H:%M:%S')"
git push
