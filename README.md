# Project Name
Our app is called AirList



## Team

  - __Product Owner__: Jeff Lam
  - __Scrum Master__: Mark Pruett
  - __Lead Engineer__: Sujin Lee
  - __Head Engineer__: Christopher Heo

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> AirList is a platform for users to come together and share items. A hybrid between Craigslist and AirBnb, AirList fills a need currently lacking in the sharing economy. Users can add items to rent out, and they can rent items others have posted. Currently, users must be logged in through Google to use the app. 

## Requirements

- Node 0.12.15 or higher
- MongoDB
- Body-Parser 1.4.3
- Express ^4.4.5
- Mongoose ^4.5.4
- q ^1.4.1
- Grunt ^0.4.5


## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```

### Roadmap

View the project roadmap [here](https://waffle.io/GreenfieldMewTwo/GreenfieldMewTwo)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## WishList

- homeController.js contains a lot of code that can be refactored into userAccountController.js
  - We recommend doing this step first before adding additional features so that the homeController doesn't get too big
- Utilize the user table in mongo because right now everything is in the item table
- Use grunt buildpack to concat/minify everything into production.min.js and style.min.css (we got lazy and didn't continue this as app became more complex)
- Calendar widget to select dates for rental period
- Use Stripe/Dwolla/Paypal api to allow users to pay each other and have the website take a % of each transaction
- Make sure receipt/record of each transaction is logged in the database
- Add zipcode input for item so google maps can display general area rather than having user allowing location sharing
- Remind users of upcoming return dates for items they have rented
- Add tests
- Known bug: when two people rent the same item at the same time, app errors (possible solution: if statement before http request)

