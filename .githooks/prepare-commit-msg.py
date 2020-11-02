#!/usr/bin/python3

""" * When the commit command is triggered, this program will be called
	* By default, the second parameter will be a link to the temporary file where the commit's message is stored
		* We can leave a message for whoever's attempting to commit
		
	* A good commit message should obey the certain rules which we can ask the user to follow:
		* Separate subject from body with a blank line
		* Limit the subject line to 50 characters
		* Capitalize the subject line
		* Do not end the subject line with a period
		* Use the imperative mood in the subject line
		* Wrap the body at 72 characters
		* Use the body to explain what and why vs. how 
	* We can prompt the user in the intial template to follow these steps"""

import sys

def main():
	message = """# A good commit message should obey the certain rules which we can ask the user to follow:
	\t# Separate subject from body with a blank line
	\t# Limit the subject line to 50 characters
	\t# Capitalize the subject line
	\t# Do not end the subject line with a period
	\t# Use the imperative mood in the subject line
	\t# Wrap the body at 72 characters
	\t# Use the body to explain what and why vs. how
	# Note: delete this prompt when you write your message\n"""
	file = open(sys.argv[1], "w")
	file.write(message)
		
if __name__ == "__main__":
	sys.exit(main())