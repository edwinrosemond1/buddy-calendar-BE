curl -X POST -H "Content-Type: application/json" -d '{"title":"Sample Event", "start":"2023-09-02T15:00:00Z", "end":"2023-09-02T16:00:00Z"}' YOUR_FUNCTION_URL_HERE

curl -X POST -H "Content-Type: application/json" -d '{"username":"testing1", "password":"password"}' https://us-central1-calendar-buddy-bfdf1.cloudfunctions.net/signup-signup

curl -X POST -H "Content-Type: application/json" -d '{"name":"Buddies", "author":"edwinrosemond1@gmail.com"}' http://127.0.0.1:5001/calendar-buddy-bfdf1/us-central1/createCalenadrGroup

--- Production ----
curl -X POST -H "Content-Type: application/json" -d '{"email": "edwinrosemond1@gmail.com"}' https://us-central1-calendar-buddy-prod.cloudfunctions.net/setClaim

curl -X POST -H "Content-Type: application/json" -d '{"email": "ultimaterivals@gmail.com"}' https://us-central1-calendar-buddy-bfdf1.cloudfunctions.net/setClaim

Deploying Functions command:
firebase deploy --only functions -P default

Emulator
firebase emulators:start
