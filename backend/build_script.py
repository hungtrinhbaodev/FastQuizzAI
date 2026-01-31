import os
import subprocess
import shutil
import sys

PATH_RELEASE = "../release/"

print("CHECK AND CREATE RELEASE FOLDER...")
if not os.path.exists(PATH_RELEASE):
    os.makedirs(PATH_RELEASE)

print("BUILD BACKEND...")
# 2. Construct the command
# We use sys.executable to ensure we use the Python from your venv_arm64
build_command = [
    "pyinstaller",
    "--noconfirm",
    "--onefile",
    "--collect-all", "pydantic_core",
    "--collect-all", "pydantic",
    "--clean", # Added to force a fresh analysis
    "--distpath", PATH_RELEASE,
    "--target-arch", "universal2",
    "main.py"
]

# 3. Run the build
result = subprocess.run(build_command)

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
