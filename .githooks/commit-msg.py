#!/usr/bin/python3

""" * When the commit command is triggered, this program will be called
	* By default, the second parameter will be a link to the temporary file where the commit's message is stored
		* We can read through this file to judge whether the message is appropriate or not 
		
	* A good commit message should obey the following rules:
		* Seperate subject from body with a blank line
		* Limit the subject line to 50 characters
		* Capitalise the subject line
		* Do not end the subject line with a period (ie '.')
		* Wrap text at 72 characters (don't let each line have more then 72 character) 
	* We can write to check these rules are being followed or to throw an error """

import sysa

def main():
	message = ""
	charCount = 0
	lineCount = 0
	
	file = open(sys.argv[1], "r")
	message = file.read()
	messageLength = len(message)
	
	for i in range(0, messageLength): 
		if message[i] == '\n': #gives us raw character
			lineCount += 1
			charCount = 0
			continue
			
		if(message[i] == '.' and lineCount == 0): #4) Do not end the subject line with a period (ie '.')
			print("The subjects ends with a period!")
			return 1
		
		if lineCount == 1 and message[i] != '\n':
			print("The line between the subject and body (line 2) is not blank!")
			return 1
						
		if lineCount == 0 and charCount == 0 and message[i].isupper() == False: #3) Capitalise the subject line
			print("Subject line is not capitalised!")
			return 1
		
		charCount += 1 
		if charCount > 50 and lineCount == 0: #2) Limit the subject line to 50 characters
			print("Subject line is over 50 characters!")
			return 1
		
		if lineCount >= 2 and charCount > 72: #5) Wrap text at 72 characters (don't let each line have more then 72 character) 
			print("Body text is over 72 characters!")
			return 1
		
	if lineCount < 2: #5) Wrap text at 72 characters (don't let each line have more then 72 character) 
		print("There is no body of text!")
		return 1
	
	print("No message error detected")
	return 0
		
if __name__ == "__main__":
	sys.exit(main())