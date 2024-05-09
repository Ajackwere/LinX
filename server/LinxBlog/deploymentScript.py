import subprocess

# Function to execute shell commands
def run_command(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    return stdout.decode(), stderr.decode()

# Step 1: Install dependencies
install_command = 'python -m pip install -r requirements.txt'
run_command(install_command)

# Step 2: Collect static files
collectstatic_command = 'python manage.py collectstatic --noinput'
run_command(collectstatic_command)

# Step 3: Migrate database (if applicable)
migrate_command = 'python manage.py migrate'
run_command(migrate_command)

print("Setup complete!")
