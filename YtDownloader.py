from flask import Flask, request, render_template, jsonify
import yt_dlp
import os


app = Flask(__name__)
app.static_url_path = '/static'
download_progress = ""


def progress_hook(d):
    global download_progress
    if d['status'] == 'downloading':
        download_progress = [str(round(float(
            d['downloaded_bytes'])/float(d['total_bytes'])*100, 1)), d['speed']]

    else:
        download_progress = "download is done"


@app.route('/', methods=['POST', 'GET'])
def index():
    # Get the user's home directory
    home_dir = os.path.expanduser("~")

    # Define the subfolder for downloads
    download_folder = os.path.join(home_dir, "Downloads")

    # Ensure the download folder exists, and create it if not
    os.makedirs(download_folder, exist_ok=True)
    if request.method == 'POST':
        resulation = request.form['resulation']
        data = request.form['link_field']
        video = request.form['data_type']

        if video == 'video':
            ydl_opts = {'format': f'best[width<={str(resulation)}]', "progress_hooks": [
                progress_hook],
                'quiet': True,
                'no_warnings': True,
                'outtmpl': os.path.join(download_folder, '%(title)s.%(ext)s')
            }
        else:
            ydl_opts = {'format': 'bestaudio/best',
                        "progress_hooks": [progress_hook],
                        'quiet': True,
                        'no_warnings': True,
                        'outtmpl': os.path.join(download_folder, '%(title)s.%(ext)s')
                        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                ydl.download([str(data)])
            except yt_dlp.utils.DownloadError as e:
                return f"<h1>{e}</h1>"

    return render_template('index.html')


@app.route('/progress')
def get_progress():
    return jsonify({"progress": download_progress})


if __name__ == '__main__':
    app.run(debug=True)
