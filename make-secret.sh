#!/usr/bin/env bash
tar cvf secrets.tar deploy-secret.json config/production.json
travis encrypt-file secrets.tar --com
rm secrets.tar
