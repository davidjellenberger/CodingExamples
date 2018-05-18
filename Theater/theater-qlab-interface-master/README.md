# CSCI 390: Senior Capstone - QLab Integration
David Ellenberger, Elijah Verdoorn, Deandre Bauswell

Fall 2017

# Technologies

To use these scripts you will need the following technologies on your local machine:
- QLab 3.0 +
- macOS 10.1+
- JSON Helper

This branch of the project is based in Applescript, Apple's proprietary scripting language. Execution of these scripts will only work on devices running
macOS 10.1+, and QLab 3.0+.

# Installation

To begin using these scripts, please:

1. Ensure you're on macOS 10.1+. I think you'd know if you weren't, but still...
2. Clone this repo
3. Install JSON Helper from https://itunes.apple.com/us/app/json-helper-for-applescript/id453114608?mt=12 
    - This is needed to automatically create new cues from HTTP responses, and is completely headless.
4. Spin up an instance of our Node Server from the main repo
4. In a QLab instance:
    - Create a new Script cue
    - In the "script" tab, copy and paste the code from init.scpt 
    - Click the "Compile Script" button
    - When ready, click the "GO" button.
    - Notice the new Cues created at the bottom of the queue. Green Cues are executable, Blue are informational
5. Execute applicable cues

