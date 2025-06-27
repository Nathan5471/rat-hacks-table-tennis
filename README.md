# Rat Hacks Table Tennis
### Description
A webapp for hosting in person table tennis tournaments and keeping track of the scores etc. Players can signup for tournaments and have their stats logged after each tournament (rating, match history, tournament history, etc.)
### Tech Stack
This is split into two cloudflare workers: a NextJs worker (hosted at `hvhs.us/`) and a Websockets worker (hosted at `hvhs.us/api`)
The NextJs worker handles all of the pages, ui, database stuff etc.
The database is hosted with cloudflare d1.
The database is interacted with via drizzle orm because I much prefer it to raw sql and prisma never seems to work.
The websockets worker handles all of the durable objects which host the live state of tournaments.
### Screenshots
![Screenshot 2025-06-27 191145](https://github.com/user-attachments/assets/99a72f61-9560-4f5c-81e5-98cf27679d5b)
![image](https://github.com/user-attachments/assets/f2482edb-2224-4c0f-a3a2-b996ea1ecca8)
![image](https://github.com/user-attachments/assets/fc8c0b0e-b9c3-489a-b1b3-0dcac9c74edd)
![image](https://github.com/user-attachments/assets/fb872caf-5ac9-404d-8bbd-ab94003740c6)
![image](https://github.com/user-attachments/assets/7a3aa702-4dc3-4f94-82a8-eea59c8e8ca2)
