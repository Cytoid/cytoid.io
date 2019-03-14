rm secrets.tar
tar cvf secrets.tar config/production.js deploy-secret.json
travis encrypt-file secrets.tar
