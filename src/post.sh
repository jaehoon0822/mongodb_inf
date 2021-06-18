#/bin/bash

#curl -H 'Content-Type: application/json' -d '{"username": "Tesla", "name": { "first": "Elon", "last": "Musk" }, "age": 40 }' -X POST http://localhost:3000/user
#curl -H 'Content-Type: application/json' -d '{"username": "Jaehoon", "age": 34 }' -X POST http://localhost:3000/user
curl -H 'Content-Type: application/json' -d '{"age": 20, "name": { "last": "jaehoon", "first": "gil" } }' -X PUT http://localhost:3000/user/60cb1238c6cf35156ba51e91
