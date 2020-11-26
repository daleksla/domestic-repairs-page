#!/usr/bin/python3

import subprocess
from subprocess import check_output
import sys

"""* It has been advised to manage merges of branches on the Github sever (as opposed to doing so locally)
	 * Therefore, this program will essentially suggest the user to only push branch content, therefore merges can be avoided"""

def main():
	branch = check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD']) #here we call the terminal and store the output
	if branch == b'master\n': #if the output shows it's the master branch
		print("You seldomly should push the master branch to the Server")
		print("Would you like to proceed? [Y/N]")
		sys.stdin = open("/dev/tty", "r")
		user_input = subprocess.check_output("read -p \"< \" userinput && echo \"$userinput\"", shell=True, stdin=sys.stdin).rstrip()
		user_input = str(user_input)
		user_input = user_input.lower()
		if user_input != 'y':
			return 1
	return 0
		
if __name__ == "__main__":
	sys.exit(main())