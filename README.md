# Referred.

[![Build Status](https://travis-ci.org/jennifer/referred-server.svg?branch=master)](https://travis-ci.org/jennifer/referred-server)

A fullstack JavaScript+React application that helps job-seekers track their professional network. Users add target companies, identify contact people, and track networking milestones, including:
* Initiating one-on-one contact
* Tracking responses
* Following up

And ultimately, getting referred!

## Demo

- [Live Demo](https://referred-app.herokuapp.com/)

## Client

Client and API were deployed separately and stored in separate GitHub repos.* 
- [Referred Client Repo](https://github.com/jennifer/referred-client)

## Using the API

### Authentication / Login
##### POST: /api/auth/login

* Bearer Authentication with JSON Web Token
* Must provide valid Username and Password in request header
* If authentication succeeds, a valid 7d expiry JWT will be provided in response body

### Register and Login New User
##### POST: /api/users 

* Must provide Username and Password in request body
* If successful, a valid 7d expiry JWT will be provided in response body

### Get Companies
##### GET: /api/referred/companies/{username}

* Retrieves companies from the Referred database, Companies collection
* Must provide valid JWT via Bearer Authentication
* If authentication succeeds, all companies added by the logged in user will be returned

### Get People
##### GET: /api/referred/companies/person/{username}

* Retrieves people from the Referred database, People collection
* Must provide valid JWT via Bearer Authentication
* If authentication succeeds, all people added by the logged in user will be returned

### Add Company
##### POST: /api/referred/company

* This endpoint adds a company to the Referred database/Companies collection
* Must provide company object in request body
* Must provide valid JWT via Bearer Authentication

### Update Company
##### PUT: /api/referred/companies/{company ID}

* This endpoint updates a single company in the Referred database/Companies collection
* Must provide company ID as route parameter
* Must provide company object in request body
* Must provide valid JWT via Bearer Authentication

### Delete Company
##### DELETE: /api/referred/companies/{company ID}

* This endpoint deletes a company from the Referred database/Companies collection
* Must provide company ID as route parameter
* Must provide valid JWT via Bearer Authentication

### Add Person
##### POST: /api/referred/companies

* This endpoint adds a person to the Referred database/People collection
* Must provide person object in request body
* Must provide valid JWT via Bearer Authentication

### Update Person
##### PUT: /api/referred/companies/person/{person ID}

* This endpoint updates a person in the Referred database/People collection
* Must provide person ID as route parameter
* Must provide person object in request body
* Must provide valid JWT via Bearer Authentication

### Delete Person
##### DELETE: /api/referred/companies/person/{person ID}

* This endpoint deletes a person from the Referred database/People collection
* Must provide person ID as route parameter
* Must provide valid JWT via Bearer Authentication