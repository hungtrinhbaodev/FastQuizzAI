import os
import subprocess
import sys

PATH_RELEASE = "../release/"

print("CHECK AND CREATE RELEASE FOLDER...")
if not os.path.exists(PATH_RELEASE):
    os.makedirs(PATH_RELEASE)

use_shell = True if sys.platform == "win32" else False

print("BUILD FRONTEND...")
subprocess.run([
    'npx',
    'vite',
    'build',
    '--outDir',
    PATH_RELEASE
], shell=use_shell)

print("DONE!")
