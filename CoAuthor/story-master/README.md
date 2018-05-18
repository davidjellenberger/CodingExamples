Coauthor
======

David Ellenberger, Elijah Verdoorn, Matthew Johnson

Overview
------

Coauthor is an app based around the idea of collaborative storytelling.
Users can create stories, take turn adding chapters to stories, and view the contributions others have submitted.

This project contains two main components: an Android app, primarily the work of Elijah Verdoorn and David Ellenberger, and a Java backend, primarily the work of Matthew Johnson.

Building and Running the App
------

In order to build the app, create an Android Studio project based on the `story/Storytelling` directory, and build the app as with any other app.

In order to bulid the backend, `cd` to the `story/java` directory and run `make`.
The most convenient way to run the backend is to run the command `make port=28431 runbackend` from the `story/java` directory.
(Running the backend requires certain jars and directories in the classpath, and the Makefile can set these automatically.)
Javadoc for the backend is available through `make javadoc`, and the resulting files are in the `story/java/doc` directory.

Although the backend does not need to be running for the app to run, it is necessary for the user to make edits.
(A user can look at stories previously loaded onto the phone, but trying to create or add to stories will be unsuccessful.)
For now, the app is hardcoded to use a backend running on rns202-8.cs.stolaf.edu at port 28431.

Features
------

  * users can create and collaborate on stories
  * stories have configurable word count limits, descriptions, genres, and cover images
  * stories have configurable limits to the size of chapter a user can submit at a time
  * scrollable list displaying key details of all stories
  * app and backend force users to take turn editing stories
    * app-side indications, such as highlighting editable stories or hiding editing tools, as well as backend checks
    * if a user does not take their turn within the allowed amount of time, automatically passed to someone else
  * searching for stories, including titles and content
    * backend allows advanced search options including searching by author, word count limits, and date of creation or modification
  * user profile page with user information, picture, and bio
