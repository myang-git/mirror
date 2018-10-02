from flask import Flask
from flask import send_from_directory

app = Flask(__name__)

@app.route('/')
def main():
	return send_from_directory('.', 'main.html')


@app.route('/main.js')
def mainjs():
	return send_from_directory('.', 'main.js')

@app.route('/pub.js')
def pubjs():
	return send_from_directory('.', 'pub.js')


@app.route('/pub')
def pub():
	return send_from_directory('.', 'pub.html')

@app.route('/qrcode.js')
def qrcodejs():
	return send_from_directory('.', 'qrcode.js')	