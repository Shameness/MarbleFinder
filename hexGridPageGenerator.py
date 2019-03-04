# 90 + 1
#import thread

import math
toRadian = (math.pi/180)
hexSize = 173

def right(x,y):
    dx = math.cos(0 * toRadian)
    dy = math.sin(0 * toRadian)
    return ( x+dx, y+dy )

def rightDown(x,y):
    dx = math.cos(-60 * toRadian)
    dy = math.sin(-60 * toRadian)
    return (x+dx, y+dy)

def leftDown(x,y):
    dx = math.cos(-120 * toRadian)
    dy = math.sin(-120 * toRadian)
    return (x+dx, y+dy)

def left(x,y):
    dx = math.cos(180 * toRadian)
    dy = math.sin(180 * toRadian)
    return ( x+dx, y+dy )

def leftUp(x,y):
    dx = math.cos(120 * toRadian)
    dy = math.sin(120 * toRadian)
    return (x+dx, y+dy)

def rightUp(x,y):
    dx = math.cos(60 * toRadian)
    dy = math.sin(60 * toRadian)
    return (x+dx, y+dy)

result = ""

def addHex(x,y):
    global result

    result += """
    <g transform="translate({0},{1})" hex_x="{2}" hex_y="{3}">
        <g class="">
            <polygon points="0,100 -87,50 -87,-50 -0,-100 87,-50 87,50"></polygon>
        </g>
        <g class"" transform="translate(2000,0)">
            <use xlink:href="#elementSVG"> </use>
        </g>
    </g>
    """.format(x*hexSize,y*hexSize, round(x/0.5),round(y/0.87)*-1)
addHex(0,0)

getDirection = { 0:right, 1:rightDown, 2:leftDown, 3:left, 4:leftUp , 5:rightUp}
for n in range(1,6):
    for i in range(0,6):
        x,y = 0,0
        for l in range(0,n):
            x,y = getDirection[i](x,y)
        addHex(x, y)
        for j in range(0,n-1):
            x,y = getDirection[(i+2)%6](x,y)
            addHex(x, y)

def getElements():
    resultStr = ""
    elements = [ [0,1,2,3,4],[0,1,2,3,4,5,6],[0,1] ]
    colors = ["#E0E0E0","#73C2FB","#FC6600","#4F97A3","#4CBB17",
    "#E0E0E0","#4682B4","#A9BA9D","#702963","#CA3433","#696980","#F9A602",
    "#222021","#FDB9C8"]
    for mainType,mainTypes in enumerate(elements):
        resultStr += '<div class="mainTypePanel">'
        for subType in mainTypes:
            resultStr += ("""<span class="element zoom" """ +
            """ mainType="{0}" subType="{1}" style="background-color: {2}"></span>""".format(
            mainType, subType, colors.pop(0) ) )
        resultStr += """</div>"""
    return resultStr

#last taco
result ="""
<html>
<head>
  <link rel="stylesheet" href="styles.css">

</head>
<body>
<div id="elementSelector">
""" + getElements() + """
</div>
<svg id="hexMap" viewBox="-1000 -1000 2000 2000" >
    <defs>
        <circle id="elementSVG" cx="0" cy="0" r="70" />
    </defs>
    <g transform="rotate(0)" fill="#aac09b" stroke="black">
        <g class="grid">
""" + result + """
        </g>
    </g>

</svg>
</body>
<script src="scripts.js"></script>
</html>
"""

# print(result)
f = open("marbleFinder.html",'w')
f.write(result)
f.close()
#
#
#
# class MyHandler(http.server.SimpleHTTPRequestHandler):
#     def do_GET(self):
#         super(MyHandler, self).do_GET()
#
#     def do_POST(self):
#         if self.path.startswith('/kill_server'):
#             print ("Server is going down, run it again manually!")
#             def kill_me_please(server):
#                 server.shutdown()
#             thread.start_new_thread(kill_me_please, (httpd,))
#             self.send_error(500)
#
# class MyTCPServer(socketserver.TCPServer):
#     def server_bind(self):
#         import socket
#         self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
#         self.socket.bind(self.server_address)
#
# server_address = ('', 8000)
# httpd = MyTCPServer(server_address, MyHandler)
# try:
#     httpd.handle_request()
# except KeyboardInterrupt:
#     pass
