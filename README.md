# USCIS_CivicTest
Platform to Learn and Test Knowledge for USCIS Naturalization Exam

The goal of this application is to use the contents that are already available at USCIS website to create an interactive web application to learn and test knowledge of civics.
This web application uses:

	1. SQLite for account management and track individuals’ scores
	2. Node.js and Express.js for back-end.
	3. Jade as a template engine
	4. JQuery and Bootstrap for interactive behavior
	
Setup:

	Follow the instructions to install SQLite on your machine
	Install following packages through npm:
	
		|--- Express.js
		|--- body-parser
		|--- cookie-parser
		|--- Jade
		|--- SQLite3
Or just let npm install packages all at one:

		npm install

Create a sqlite database under ./database/sqlite.db

	CREATE TABLE `Users` (
		`Name`	TEXT,
		`Email`	TEXT,
		`Username`	TEXT,
		`Password`	TEXT,
		`Hashcode`	TEXT,
		`Score`	REAL
	);
	
Then:

	node server.js

--- I don't own the questions, audio files and pictures. They are being copied from USCIS website.
