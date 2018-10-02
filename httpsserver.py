import BaseHTTPServer, SimpleHTTPServer
import ssl
import sys

port = int(sys.argv[1])
httpd = BaseHTTPServer.HTTPServer(('0.0.0.0', port), SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket (httpd.socket, server_side=True,
                                certfile='mirrorsitessl.pem')
print 'web server listening to port %s' % port
httpd.serve_forever()
