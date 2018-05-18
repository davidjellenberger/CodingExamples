# CS 273: Operating Systems
David Elleberger

Spring 2018

# Technologies
C, pthreads

# Notes
This project was created to speck with https://www.stolaf.edu/people/rab/OS/S18/pub/pp-threads.pdf . These are the necessary files for compiling and running a simple webserver which handles HTTP calls with a multithreaded server. When a call comes in from client, the server will open a new thread to process it, then do whatever the call says, and close the thread when finished.

Compilation is to spec with RABs assignment- 
Running is as follows: 
1. ./Server (portno)
2. ./Client (ServerName) (portno) 
	