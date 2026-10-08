"""Tiny dev server with caching disabled, so edits show up on a normal refresh.
Run:  python serve.py        (serves on http://localhost:8888)
"""
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8888


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


http.server.ThreadingHTTPServer.allow_reuse_address = True
with http.server.ThreadingHTTPServer(("", PORT), NoCache) as httpd:
    print(f"Serving on http://localhost:{PORT}")
    httpd.serve_forever()
