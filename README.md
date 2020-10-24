# DELEGO

A solution that allows shift workers to painlessly submit shift preferences, and managers to automate shift assignments.

![Overview](/preproject/app_screenshot.png)

The project is hosted [here](https://shift-scheduler-auto.herokuapp.com/).

## Approach

I wanted to push myself to work with new technologies. Instead of using an xERN stack as I'd done for previous projects, I chose to use django for the backend and react for the front end - i.e Model-Template-View (MTV) architecture, where I used React/Redux instead of Django's built-in template functionality. 

I also wanted to try building a Single-Page Application (SPA) - the [previous SEI24 project](https://baker-inn.herokuapp.com/) was an SPA but I didn't touch the frontend much as it was a group project. I wanted the experience of building it. With the use of redux-thunk, it was possible to call the Django REST API once per request and update the redux store and frontend seamlessly (as opposed to calling it on the mounting of each component).

Functionally, the stack structure looks something like this:

![Overview](/preproject/app_stack.png)


## Challenges

It took a while to get used to django-rest-framework serializers, but once I did, I really appreciated how clean the code that queried the database looked (no more paragraph-long queries or long chains of promises!). 

Before I learned about localStorage, keeping the redux store updated on refresh was also challenging, and the solution I thought of (sending a request to the server and checking if there was still a session) didn't work on incognito mode or heroku.

I also learned to look for packages that already do what I want, instead of just try to build everything from scratch. react-bootstrap-typeahead was a revelation and react-big-calendar really made the app come together. 

## Installation Instructions

In the project root directory, run the following commands:

1. Install npm dependencies
```
npm install
```

2. Create a postgres db named "shift_schedule" (or any name you like, just update the settings.py file).

3. Install from pipfile and activate pipenv shell.
```
pipenv install
pipenv shell
```

4. In the pipenv shell, make and run migrations for django project and app. 
```
python manage.py migrate
python manage.py makemigrations main_app
python manage.py migrate main_app
```


5. At this state you may want to create an admin account (still in pipenv shell):
```
python manage.py createsuperuser
```

6. Still in the pipenv shell, run the development server.
```
python manage.py runserver
```

7. In a separate command window (NOT in pipenv shell), go to the project root directory and run:
```
npm start
```

The app should be accessible at localhost:3000.

## Technologies Used

* Django
* Django REST framework
* Django rest_auth
* Django rest_auth with jwt
* Django all_auth
* React
* create-react-app
* react-router-dom
* react-bootstrap
* react-big-calendar
* react-bootstrap-typeahead
* Redux
* redux-thunk

## Furthers

* Form validation
* Implementing error boundary
* More specific error messaged (username taken, no permission etc)
* Allow users to leave groups - currently only group admins can remove a member from a group
* Allow users to access preferences from home page
* When submitting shift preferences, notify user when shifts from different groups clash
* Enable timezones - currently all datetime TZs are set to 'Asia/Singapore'
* Implement with OAuth
* Implement notifications and real-time updates with WebSockets