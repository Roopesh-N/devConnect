#Dev Connect API'S

Auth Routers
- POST /signup
- POST /login
- POST /logout


ProfileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestReouter
- POST /request/send/interested/:userID
- POST /request/send/ignored/:userID
- POST /request/review/accepted/:reqID
- POST /request/review/rejected/:reqID

-userRouter
- GET /user/connections
- GET /user/feed/
- GET /user/requests

