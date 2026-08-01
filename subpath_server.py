from http.server import SimpleHTTPRequestHandler, HTTPServer
import os, urllib.parse

class SubpathHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        parsed = urllib.parse.urlparse(path)
        path = parsed.path
        if path == "/bwabh-alabtkar" or path == "/bwabh-alabtkar/":
            path = "/docs/index.html"
        elif path.startswith("/bwabh-alabtkar/"):
            path = "/docs/" + path[len("/bwabh-alabtkar/"):].lstrip("/")
        else:
            path = "/404"
        return os.path.join(os.getcwd(), path.lstrip("/"))

server = HTTPServer(("127.0.0.1", 8001), SubpathHandler)
print("Serving subpath simulation on http://127.0.0.1:8001")
server.serve_forever()
