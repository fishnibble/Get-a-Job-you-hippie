---------------------------------------------------------------
# Working Notes and tasks
---------------------------------------------------------------
* [X] get JSON response of jobs from CL

* [X] get JSON response of jobs from reddit
  - you can get a json file by doing:
  https://www.reddit.com/r/subreddit/search.json?q=somthinghere%20js&restrict_sr=1
  - [X] *NOTE*: Having issue pushing cl and reddit json all into one response. (fixed)
  - [x] *NOTE* look into Promise.all().

* [X] parse data from reddit JSON too much info.
  - *NOTE*: FIXED with maping (results[1].data.children.map...)

* [X] searchable keywords 
  - Need to find a way to filter reddit posts. 
  - might not be useful if they are too old.

* [] search multiple cities 
  - *NOTE*: The front end can make multiple JSON queries and then append it to the search. (will add to front end)

* [X] see cost of living in that city
  - [] clean the data

* [] Start building out front end

---------------------------------------------------------------
## Current working state. backend only.
---------------------------------------------------------------

---------------------------------------------------------------
# Scrape list
---------------------------------------------------------------
* [] https://weworkremotely.com/categories/remote-programming-jobs

* [] https://jobspresso.co/

* [] https://remoteok.io/ (IN PROGRESS)

* [] https://nofluffjobs.com/

* [] https://whoishiring.io/

* [X] https://stackoverflow.com/jobs 

* [] https://news.ycombinator.com/jobs

* [X] reddit

* [x] CL
