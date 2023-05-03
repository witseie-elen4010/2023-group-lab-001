The following conventions are used in the development of CONSULTA:

1) Front end languages used: Javascript, Bootstrap

2) Back end languages used: SQL in MySQL

3) Coding style: code will be written in a defensive manner, following best practices for the languages used.
		 All Javascript code will be formatted using the StandardJS conventions and its associated linter as a VSCode plugin.
		 
	3.1) Coding style guide:
		All code will be styled according to the StandardJS conventions (available at: https://standardjs.com/), namely:
		> Javascript's strict mode will be used
		> Names will be assigned using the CamelCase convention
		> Large functions will be broken up where appropriate into sub functions
		> Global variables will be named using capital letters
		> Code should be written in a manner that allows for easy understanding of how it works, and comments should only be used to explain why certain decisions have been made

4) Testing of code will be done using the Jest framework.

5) Version control will be handeled through GitHub, with hosting done through Microsoft Azure.

6) A CI/CD development methodology will be used, with specific emphasis on the Agile Development methodology.

7) Code Review Guide:
	Each developer has been assigned as a reviewer for another developer's work.
	Each deveolper will work on their assigned user stories over the course of the sprint, in their own local branch.
	Upon committing and pushing a branch to the trunk, the developer will make a pull request from this branch to the main branch.
	The reviewer of the developer who made the pull request will review it for bugs and functional correctness.
	In the event of bugs/issues being identified, the developer who made
	the request will be notified by their reviewer of the issues, and will endeavour to rectify the issues as soon as possible,
	before then re-committing in order to fix the state of the trunk. The new commit will again be reviewed in the same manner, and
	the process repeated until only good, working code is committed to the trunk.
	In the event that no issues are found, the committed code will be left as it is.

	NOTE: All developers will endeavour to test their own code before making pull requests, and will help ensure that as little broken
	code as possible is pushed to the trunk, thereby preserving its state.
	NO UNFINISHED CODE MAY BE PUSHED.
	
	Code reviewers will conduct their reviews in line with Google's code review guide (available at: https://google.github.io/eng-practices/review/), namely:
	> Is the code well-designed with respect to the system?
	> Does the code behave as intended?
	> Can the code be simplified?
	> Can other developers easily understand the code?
	> Does the code have good automated tests?
	> Are variable and method names well chosen?
	> Are comments present and useful where necessary?
	> Does code follow our style guide?
	



