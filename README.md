# wdi-project-2
My second project for WDI London

# Restful Beer rater app

For my secondt project on GA London's WDI course I created a RESTful app for users to log in, upload, rate and discuss different beers. The app can be viewed here https://evening-refuge-83030.herokuapp.com/


![Homepage screenshot](http://i65.tinypic.com/wv4rix.png)

## Project brief

Build a full-stack RESTful Express application that includes authentication. Include a Mongo database using the Mongoose ORM.

The app must have at least 2 models – one representing a user and one that represents the main resource of the app, Beer in this instance.
The app should include relationships - embedded or referenced.
The app should include authentication - with encrypted passwords & an authorization flow.
Have complete RESTful routes for at least one of the resources with all CRUD actions.
Use SCSS to style the app.
Have semantically clean HTML.
Be deployed online and accessible to the public.

## How it was built

### Tools used
* HTML/CSS/SCSS
* Javascript/jQuery
* Express JS
* Node JS
* Mongo DB & Mongoose
* Bootstrap 
* BCrypt
* Bluebird
* Nodemon
* Gulp
* Babel
* Google Fonts
* jQuery bar-rating


### Planning

On top of a basic RESTful with all of the CRUD actions, I wanted to include comments, ratings and favouriting. I then used Balsamiq to wireframe the design of the app, with these actions in mind.

![Screenshot of baslsamiq wireframes](http://i65.tinypic.com/35btc40.png)


### The Models

#### The User

The user model was created to contain the username, email and password of the user, along with the user's favourited beers which references the beer model.

```
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, requied: true, unique: true },
  password: { type: String, required: true },
  favourites: [{ type: mongoose.Schema.ObjectId, ref: 'Beer', unique: true }]
});
```
The password that the user uses to register and log-in is hashed so it is not stored as plain text. This is an important security measure.

#### The Beer

The information that beer model stores was largely determined by what was included in the API I used to seed the data, which was the Brewdog API. This included the beer's name, tagline, description, abv and an image.

```
const beerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tagline: { type: String },
  description: { type: String },
  abv: { type: String },
  image: { type: String },
  dbId: { type: String },
  comments: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    body: { type: String, trim: true, required: true },
    rating: { type: Number, required: true }
  }, {
    timestamps: true
  }]
});
```

Included in the model was an embedded sub-document for the comments, I chose to make the comments an embedded sub-document within the beer model as each comment would be of a particular beer, and no comment would be of more than one beer or of no beer. Also, comments would not be threaded.  

### Functionality

One of the main issues in creating the functionality of the app was rating the beers. This was important as it was one of the main features of the app. The ratings for each beer were included as part of the comments, and thus were embedded in the beer model. 

I solved this problem in the beersShow function in the beers controller page.

```
const averageRating = beer.comments.map(comment => {
      return comment.rating;
    });

    let sum = 0;
    for( var i = 0; i < averageRating.length; i++ ){
      sum += parseInt( averageRating[i], 10 );
    }

    const avg = (sum/averageRating.length).toFixed(2);
```
Another key function was favouriting beers, so the users can track which ones they enjoy the most. 

```
function usersFavourite(req, res) {
  let beerf;
  Beer
  .findById(req.params.id)
  .exec()
  .then(beer => {
    // console.log('we got here', req.params.id)
    beerf = beer;
    if(!beer) {
      return res.render('error', { error: 'No beer was found.' });
    }
    // console.log(res.locals.user);
    User
    .findById(res.locals.user._id)
    .exec()
    .then(user => {
      if (user.favourites.indexOf(beerf._id) === -1) {
        user.favourites.push(beer);
        user.save(err => {
          console.log(err);
          req.flash('success', `${beer.name} was added to your favourites.`);
          res.redirect(`/beers/${beer.id}`);
        });
      } else {
        req.flash('danger', `${beer.name} is already in your favourites.`);
        res.redirect(`/beers/${beer.id}`);
      }
    });
  });
}
```

To accomplish this I had beers pushed in the favourites array within the user model. A hurdle to overcome here was not allowing a beer to be push into the array more than once. I did this by check the whether the index of the selected beer in the user.favourites array was -1, which is the index of any element that is not in the array.


## Future development

In the future I would like to link the app to a supermarket API, such as tesco's. The beers on the map would be cross referenced with the api on client-side, providing the user with information on the beer such as whether it is sold, where it is sold, and how much it costs.

## Credit

Thanks to the GA instructors Alex Chin and Rane Gowan, and the TA's Natalie Huitson and Ed Compton.    





