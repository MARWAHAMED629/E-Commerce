# E-Commerce

# Best Choice

Best Choice is a web application built with Angular and Django REST Framework. The application offers 
## Features

1. The first feature is that it uses REST web services to allow different types of applications to connect to the same database.


2. The second feature is API security to ensure secure communication and data protection.


3. The third feature is that the design is responsive, meaning it adapts to different screen sizes.

## Technologies Used

- Frontend: Angular 17
- Backend: Django 3.2+ Django REST Framework
- Database: [SQLite]

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js
- Angular CLI
- Python 3.x
- Django

### Backend Setup (Django)


1. Create a virtual environment and activate it:

python -m venv env
source env/bin/activate  # ON macOS OR Linux
env\Scripts\activate  #  ON Windows


2. Install the dependencies:

pip install -r requirements.txt


3. Run migrations:

python manage.py migrate


4. Start the Django server:

python manage.py runserver



Frontend Setup (Angular)

1. Navigate to the frontend directory:

cd ../frontend


2. Install the dependencies:

npm install


3. Start the Angular development server:

ng serve



API Documentation

The Django REST Framework provides a browsable API at /api/. You can access the API documentation by running the server and navigating to:

http://localhost:8000/api/

Admin panel:
http://localhost:8000/admin/

Usage

Once both servers are running, you can access the application at:

http://localhost:4200
