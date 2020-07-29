# Virtual Sound Sculptures
Mobile Application

_Virtual Sound Sculptures_ is a music art gallery in a virtual space. The artworks presented in this art gallery are musical sculptures, pieces of _Vertical Music_. A piece of _Vertical Music_ develops in time as a sculpture: that is no development. But like every sculpture, and in general every artwork in a gallery, its development is created by the observers. They decide a path of points to observe, composing their own time experience of a static object. In this work, space is a virtual space wrapping the artworks, defining the boundaries of the time experience. The virtual space is inscribed in the Earth coordinates system, therefore it would embrace the entire globe. It is defined only in the acoustical dimension, visual clues are not present.

This work is presented in a mobile application through which the user accesses the virtual space. Every artwork of the music gallery is limited in space and restricted to a specific region. Its position is defined by several coordinate points (three to a maximum of ten). The audience in the art gallery, e.g. the user of the mobile application, can listen to the artworks only within those specific boundaries. Similarly to the experience of a physical art gallery, the observers can move around, get away from, or close to each artwork. They can listen to different layers of the musical sculpture, moving between the coordinate points in which the sculpture is defined. A group of artworks occupies a larger space, defining a trajectory through a city, a park, and so on, like an art gallery defining a path of artworks inside the hosting structure. 

The application is based on two essential elements: the audience (mobile app users) and the sound sculpture, while the core of the mobile application is the system of interaction between them. The audience explores the virtual sound space through a pair of headphones. Thanks to a position tracking system every user is described by a couple of coordinates and a direction in the virtual space. Each artwork consists of several sounds, layers of a musical sculpture distributed in the virtual space (with as many as the coordinates point by which is described). Then, the application provides a 3D audio system with which the user can do a complete 360-degrees experience.

The application is realized with [Ionic](https://ionicframework.com/) and [Capacitor](https://capacitorjs.com/). The audio core is realized with _Web Audio API_.

## _Vertical Music_ - previous works
- _Musica Verticale_ - music album (2016) - [https://musicaverticale.bandcamp.com/releases](https://musicaverticale.bandcamp.com/releases)
- _Moment V_ - web installation (2017) - :no_entry_sign: *unavailable domain*

Bechelor Thesis regarding _Moment V_ realization: [Moment v & la musica verticale di Jonathan D.Kramer](https://github.com/alessandrofiordelmondo/virtual-sound-sculptures/blob/master/text/Moment%20v%20%26%20la%20musica%20verticale%20di%20Jonathan%20D.Kramer.pdf) (2017)

## _About the Internet Music_

[About the music in the Internet Art](https://github.com/alessandrofiordelmondo/virtual-sound-sculptures/blob/master/text/About%20the%20music%20in%20the%20Internet%20Art.pdf) - paper 2020

## Other Related Links
In the application a Duplex Algorithm has been used to create a 3D audio System. During the development other algorithms have been tested for the same purpose, such as the _Quesi-Specific HRTF Algorithm_ and the _General HRTF Algorithm_. The last one refers to the Web Audio API's `PannerNode` in `'HRTF'` modality. In the _Quasi-Secif HRTF Algorithm_ an algorithm for HRTF usage has been developed. An example of this algorithm can be seen ion the following GitHub Link [Binaural with HRTF](https://github.com/alessandrofiordelmondo/Binaural-WAA).<br>
<br>
The choice of using the _Duplex Algorithm_ has been done through a Listening test:<br>
[Listening Test Web Link](https://test-audio-database.firebaseapp.com/test)<br>
**Listenign test Results**<br>
![Listening Test Results](/img/test-result.png)<br>
<br>
And a CPU usage analysis:<br>
<br>
**Duplex Algorithm CPU usage**<br>
![Duplex Algorithm CPU usage](/img/cpuduplex.png)<br>
**Quasi-Specific HRTF Algorithm CPU usage**<br>
![Quasi-Specific HRTF Algorithm CPU usage](/img/cpuhrtf.png)<br>
**General HRTF Algorithm CPU usage**<br>
![General HRTF Algorithm CPU usage](/img/cpuwaa.png)<br>
<br>
The core of the Application's sound generator is a _Granular Synthesis_. The starting algorithm from which the sound generator is made can be found in the following GitHub Link [Granular](https://github.com/alessandrofiordelmondo/Granular-WAA)<br> 
<br>
The realization of the _Pedometer System_ is based on the Sébastien Ménigot's algorithm [link](http://sebastien.menigot.free.fr/pedometer_explanations.html)<br>
<br>
## **APPLICATION**
[Virtual Sound Sculpture](https://github.com/alessandrofiordelmondo/virtual-sound-sculptures/tree/master/app/release)<br>
The application is only for Android. It was tested in _Lenovo K10 note_ model:`L38111`<br>
<br>
**Technical Details**<br>
- `CPU`: Octa-core 2.20 GHz
- `RAM`: 6 GB
- `Android version`: 9<br>
<br>
A simulation of the application based on the web is provided at the following link:<br>
[Virtual Sound Sculptures SIMULATION](https://gallery-audio-database.firebaseapp.com/home)
 
