import os
import subprocess

PATH_RELEASE = "../release/"

print("CHECK AND CREATE RELEASE FOLDER...")
if not os.path.exists(PATH_RELEASE):
    os.makedirs(PATH_RELEASE)

print("BUILD FRONTEND...")
subprocess.run([
    'npx',
    'vite',
    'build',
    '--outDir',
    PATH_RELEASE
], shell=True)

print("DONE!")
