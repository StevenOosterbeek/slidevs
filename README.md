# Slidevs.js

Slidevs.js is a presentation framework which enables his user to create a HTML5 browser presentation which can be controlled from any mobile phone or tablet. Just write one main layout and each slide as a individual html file.

```
$ mkdir mySlidevs && cd mySlidevs && npm install - Not yet in the npm registery, but will be soon!
```

---

### Creating a Slidevs.js
All of the following inserted option names/paths are also default, and will be used when creating a new Slidevs without any options.

```js
var slidevs = require('slidevs');

var exampleSlidevs = slidevs({
        name: 'Slidevs Presentation',
        layout: 'main-layout.html', // The name of your main layout file
        styling: 'styling.css', // The name of your styling file
        slidesFolder: '/slides', // The name of the directory where your slides are located
        scriptsFolder: '/scripts', // The name of the directory where your scripts are located
        imagesFolder: '/images', // The name of the directory where your images are located
        controls: {
            on: true, // Do you want to enable controls?
            password: false // Do you want to secure your controls with a password?
        },
        progressBar: true, // Do you want Slidevs to show a progress bar at the top?
        port: 5000 // On which port should your Slidevs start?
    });

exampleSlidevs.start();
```

---

### Folder structure
A Slidevs project folder should contain as least a main-layout.html, styling.css, and a slides folder. Within this slides folder you can add each slide as a individual html file, where you should number them as following: *slide-1.html*, *slide-2.html* and so on. You can also add scripts and images to your Slidevs, by simply adding a scripts folder and images folder to your project.

#### The main layout
This is the .html file where your slides are being concatenated in. Your main layout should at least look like following.

```html
<!doctype html>
<html>
    <head>
        <title> <!-- Title will be filled with the name of your Slidevs --> </title>
        [## Assets ##]
    </head>
    <body>
        [## Slidevs ##] <!-- Your slides will be placed here -->
    </body>
</html>
```

#### Progress bar
Enabling the progress bar within the options will result in a progress bar of your presentation at the top of your Slidevs.
Within your own styling file you can easily overwrite the default colors of the progress bar as following.

```css
.progress-bar {
    /**/
}

.progress {
    /**/
}
```

---

### Starting your Slidevs
After creating the right folder structure and writing your Slidevs.js file you can start your Slidevs by running it with Node.

```js
$ node my-slidevs-file.js
```

Running your file will eventually log two created links: One for your Slidevs presentation and one for the controls *(If you enabled controls of course)*. You can now open up the first link *(Slidevs)* to show your presentation, and open up the other link *(Controls)* on any mobile device to control your Slidevs.

#### Watches
Slidevs.js also starts a watch on your main layout, styling, slides, scripts and images. After saving any of these files Slidevs.js will rebuild your Slidev.

---

### Controlling your Slidevs
Opening up the controls link on a mobile phone enables you to slide through your Slidevs. Opening it up on a tablet also enables you to slide through your Slidevs, but also enables you to add notes to every single slide.
**Note that when you are using Slidevs locally, both devices should be on the same WiFi network.**

#### Adding notes
In order to add notes to your Slidevs presentation you should open the controls link on a tablet. The interface will now show a bar which says *"Tap here to open up the note of this slide"*. Tapping on this bar opens up a note within the controls and within your Slidevs. You can now real-time draw a note for that slide, and even save it as .png to every machine that has your Slidevs open *(disk icon)*. Furthermore you can erase your note *(eraser icon)* or close the note *(x icon)*.

#### Securing your controls
Setting the `controls.password` with a password *(string)* secures your controls with that password. After confirming the password within the controls a cookie is set, so the user don't have to sign in for a whole day.

---

#### Future fixes
- Optimizing note drawing line
- Controls white bottom stroke on mobile phones in landscape..
- Download notes to mobile devices?