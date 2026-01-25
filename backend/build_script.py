import os
import subprocess
import shutil

PATH_RELEASE = "../release/"

print("CHECK AND CREATE RELEASE FOLDER...")
if not os.path.exists(PATH_RELEASE):
    os.makedirs(PATH_RELEASE)

print("BUILD BACKEND...")
subprocess.run([
    "pyinstaller",
    "--onefile",
    "--distpath",
    PATH_RELEASE,
    "main.py"
])

COPIES_FILES = [
    "./assets/config.json"
]

print("COPYING RESOURCES...")
for file_path in COPIES_FILES:
    folders = file_path.split("/")
    for folder in folders[:-1]:
        if not os.path.exists(os.path.join(PATH_RELEASE, folder)):
            os.makedirs(os.path.join(PATH_RELEASE, folder))
    shutil.copy(file_path, os.path.join(PATH_RELEASE, file_path))

print("DONE!")
