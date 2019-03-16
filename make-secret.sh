#!/usr/bin/env bash
tar cvf secrets.tar deploy-secret.json
travis encrypt-file secrets.tar
rm secrets.tar
