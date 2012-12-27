var io = "undefined" == typeof module ? {} : module.exports;

(function() {
    (function(exports, global) {
        var io = exports;
        io.version = "0.9.6";
        io.protocol = 1;
        io.transports = [];
        io.j = [];
        io.sockets = {};
        io.connect = function(host, details) {
            var uri = io.util.parseUri(host), uuri, socket;
            if (global && global.location) {
                uri.protocol = uri.protocol || global.location.protocol.slice(0, -1);
                uri.host = uri.host || (global.document ? global.document.domain : global.location.hostname);
                uri.port = uri.port || global.location.port;
            }
            uuri = io.util.uniqueUri(uri);
            var options = {
                host: uri.host,
                secure: "https" == uri.protocol,
                port: uri.port || ("https" == uri.protocol ? 443 : 80),
                query: uri.query || ""
            };
            io.util.merge(options, details);
            if (options["force new connection"] || !io.sockets[uuri]) socket = new io.Socket(options);
            !options["force new connection"] && socket && (io.sockets[uuri] = socket);
            socket = socket || io.sockets[uuri];
            return socket.of(uri.path.length > 1 ? uri.path : "");
        };
    })("object" == typeof module ? module.exports : this.io = {}, this);
    (function(exports, global) {
        var util = exports.util = {}, re = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, parts = [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ];
        util.parseUri = function(str) {
            var m = re.exec(str || ""), uri = {}, i = 14;
            while (i--) uri[parts[i]] = m[i] || "";
            return uri;
        };
        util.uniqueUri = function(uri) {
            var protocol = uri.protocol, host = uri.host, port = uri.port;
            if ("document" in global) {
                host = host || document.domain;
                port = port || (protocol == "https" && document.location.protocol !== "https:" ? 443 : document.location.port);
            } else {
                host = host || "localhost";
                !port && protocol == "https" && (port = 443);
            }
            return (protocol || "http") + "://" + host + ":" + (port || 80);
        };
        util.query = function(base, addition) {
            var query = util.chunkQuery(base || ""), components = [];
            util.merge(query, util.chunkQuery(addition || ""));
            for (var part in query) query.hasOwnProperty(part) && components.push(part + "=" + query[part]);
            return components.length ? "?" + components.join("&") : "";
        };
        util.chunkQuery = function(qs) {
            var query = {}, params = qs.split("&"), i = 0, l = params.length, kv;
            for (; i < l; ++i) {
                kv = params[i].split("=");
                kv[0] && (query[kv[0]] = kv[1]);
            }
            return query;
        };
        var pageLoaded = !1;
        util.load = function(fn) {
            if ("document" in global && document.readyState === "complete" || pageLoaded) return fn();
            util.on(global, "load", fn, !1);
        };
        util.on = function(element, event, fn, capture) {
            element.attachEvent ? element.attachEvent("on" + event, fn) : element.addEventListener && element.addEventListener(event, fn, capture);
        };
        util.request = function(xdomain) {
            if (xdomain && "undefined" != typeof XDomainRequest) return new XDomainRequest;
            if ("undefined" != typeof XMLHttpRequest && (!xdomain || util.ua.hasCORS)) return new XMLHttpRequest;
            if (!xdomain) try {
                return new (window[[ "Active" ].concat("Object").join("X")])("Microsoft.XMLHTTP");
            } catch (e) {}
            return null;
        };
        "undefined" != typeof window && util.load(function() {
            pageLoaded = !0;
        });
        util.defer = function(fn) {
            if (!util.ua.webkit || "undefined" != typeof importScripts) return fn();
            util.load(function() {
                setTimeout(fn, 100);
            });
        };
        util.merge = function merge(target, additional, deep, lastseen) {
            var seen = lastseen || [], depth = typeof deep == "undefined" ? 2 : deep, prop;
            for (prop in additional) if (additional.hasOwnProperty(prop) && util.indexOf(seen, prop) < 0) if (typeof target[prop] != "object" || !depth) {
                target[prop] = additional[prop];
                seen.push(additional[prop]);
            } else util.merge(target[prop], additional[prop], depth - 1, seen);
            return target;
        };
        util.mixin = function(ctor, ctor2) {
            util.merge(ctor.prototype, ctor2.prototype);
        };
        util.inherit = function(ctor, ctor2) {
            function f() {}
            f.prototype = ctor2.prototype;
            ctor.prototype = new f;
        };
        util.isArray = Array.isArray || function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        };
        util.intersect = function(arr, arr2) {
            var ret = [], longest = arr.length > arr2.length ? arr : arr2, shortest = arr.length > arr2.length ? arr2 : arr;
            for (var i = 0, l = shortest.length; i < l; i++) ~util.indexOf(longest, shortest[i]) && ret.push(shortest[i]);
            return ret;
        };
        util.indexOf = function(arr, o, i) {
            for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0; i < j && arr[i] !== o; i++) ;
            return j <= i ? -1 : i;
        };
        util.toArray = function(enu) {
            var arr = [];
            for (var i = 0, l = enu.length; i < l; i++) arr.push(enu[i]);
            return arr;
        };
        util.ua = {};
        util.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function() {
            try {
                var a = new XMLHttpRequest;
            } catch (e) {
                return !1;
            }
            return a.withCredentials != undefined;
        }();
        util.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent);
        util.ua.iDevice = "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent);
    })("undefined" != typeof io ? io : module.exports, this);
    (function(exports, io) {
        function EventEmitter() {}
        exports.EventEmitter = EventEmitter;
        EventEmitter.prototype.on = function(name, fn) {
            this.$events || (this.$events = {});
            this.$events[name] ? io.util.isArray(this.$events[name]) ? this.$events[name].push(fn) : this.$events[name] = [ this.$events[name], fn ] : this.$events[name] = fn;
            return this;
        };
        EventEmitter.prototype.addListener = EventEmitter.prototype.on;
        EventEmitter.prototype.once = function(name, fn) {
            function on() {
                self.removeListener(name, on);
                fn.apply(this, arguments);
            }
            var self = this;
            on.listener = fn;
            this.on(name, on);
            return this;
        };
        EventEmitter.prototype.removeListener = function(name, fn) {
            if (this.$events && this.$events[name]) {
                var list = this.$events[name];
                if (io.util.isArray(list)) {
                    var pos = -1;
                    for (var i = 0, l = list.length; i < l; i++) if (list[i] === fn || list[i].listener && list[i].listener === fn) {
                        pos = i;
                        break;
                    }
                    if (pos < 0) return this;
                    list.splice(pos, 1);
                    list.length || delete this.$events[name];
                } else (list === fn || list.listener && list.listener === fn) && delete this.$events[name];
            }
            return this;
        };
        EventEmitter.prototype.removeAllListeners = function(name) {
            this.$events && this.$events[name] && (this.$events[name] = null);
            return this;
        };
        EventEmitter.prototype.listeners = function(name) {
            this.$events || (this.$events = {});
            this.$events[name] || (this.$events[name] = []);
            io.util.isArray(this.$events[name]) || (this.$events[name] = [ this.$events[name] ]);
            return this.$events[name];
        };
        EventEmitter.prototype.emit = function(name) {
            if (!this.$events) return !1;
            var handler = this.$events[name];
            if (!handler) return !1;
            var args = Array.prototype.slice.call(arguments, 1);
            if ("function" == typeof handler) handler.apply(this, args); else {
                if (!io.util.isArray(handler)) return !1;
                var listeners = handler.slice();
                for (var i = 0, l = listeners.length; i < l; i++) listeners[i].apply(this, args);
            }
            return !0;
        };
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(exports, nativeJSON) {
        "use strict";
        return exports.JSON = {
            parse: nativeJSON.parse,
            stringify: nativeJSON.stringify
        };
    })("undefined" != typeof io ? io : module.exports, typeof JSON != "undefined" ? JSON : undefined);
    (function(exports, io) {
        var parser = exports.parser = {}, packets = parser.packets = [ "disconnect", "connect", "heartbeat", "message", "json", "event", "ack", "error", "noop" ], reasons = parser.reasons = [ "transport not supported", "client not handshaken", "unauthorized" ], advice = parser.advice = [ "reconnect" ], JSON = io.JSON, indexOf = io.util.indexOf;
        parser.encodePacket = function(packet) {
            var type = indexOf(packets, packet.type), id = packet.id || "", endpoint = packet.endpoint || "", ack = packet.ack, data = null;
            switch (packet.type) {
              case "error":
                var reason = packet.reason ? indexOf(reasons, packet.reason) : "", adv = packet.advice ? indexOf(advice, packet.advice) : "";
                if (reason !== "" || adv !== "") data = reason + (adv !== "" ? "+" + adv : "");
                break;
              case "message":
                packet.data !== "" && (data = packet.data);
                break;
              case "event":
                var ev = {
                    name: packet.name
                };
                packet.args && packet.args.length && (ev.args = packet.args);
                data = JSON.stringify(ev);
                break;
              case "json":
                data = JSON.stringify(packet.data);
                break;
              case "connect":
                packet.qs && (data = packet.qs);
                break;
              case "ack":
                data = packet.ackId + (packet.args && packet.args.length ? "+" + JSON.stringify(packet.args) : "");
            }
            var encoded = [ type, id + (ack == "data" ? "+" : ""), endpoint ];
            data !== null && data !== undefined && encoded.push(data);
            return encoded.join(":");
        };
        parser.encodePayload = function(packets) {
            var decoded = "";
            if (packets.length == 1) return packets[0];
            for (var i = 0, l = packets.length; i < l; i++) {
                var packet = packets[i];
                decoded += "�" + packet.length + "�" + packets[i];
            }
            return decoded;
        };
        var regexp = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
        parser.decodePacket = function(data) {
            var pieces = data.match(regexp);
            if (!pieces) return {};
            var id = pieces[2] || "", data = pieces[5] || "", packet = {
                type: packets[pieces[1]],
                endpoint: pieces[4] || ""
            };
            if (id) {
                packet.id = id;
                pieces[3] ? packet.ack = "data" : packet.ack = !0;
            }
            switch (packet.type) {
              case "error":
                var pieces = data.split("+");
                packet.reason = reasons[pieces[0]] || "";
                packet.advice = advice[pieces[1]] || "";
                break;
              case "message":
                packet.data = data || "";
                break;
              case "event":
                try {
                    var opts = JSON.parse(data);
                    packet.name = opts.name;
                    packet.args = opts.args;
                } catch (e) {}
                packet.args = packet.args || [];
                break;
              case "json":
                try {
                    packet.data = JSON.parse(data);
                } catch (e) {}
                break;
              case "connect":
                packet.qs = data || "";
                break;
              case "ack":
                var pieces = data.match(/^([0-9]+)(\+)?(.*)/);
                if (pieces) {
                    packet.ackId = pieces[1];
                    packet.args = [];
                    if (pieces[3]) try {
                        packet.args = pieces[3] ? JSON.parse(pieces[3]) : [];
                    } catch (e) {}
                }
                break;
              case "disconnect":
              case "heartbeat":
            }
            return packet;
        };
        parser.decodePayload = function(data) {
            if (data.charAt(0) == "�") {
                var ret = [];
                for (var i = 1, length = ""; i < data.length; i++) if (data.charAt(i) == "�") {
                    ret.push(parser.decodePacket(data.substr(i + 1).substr(0, length)));
                    i += Number(length) + 1;
                    length = "";
                } else length += data.charAt(i);
                return ret;
            }
            return [ parser.decodePacket(data) ];
        };
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(exports, io) {
        function Transport(socket, sessid) {
            this.socket = socket;
            this.sessid = sessid;
        }
        exports.Transport = Transport;
        io.util.mixin(Transport, io.EventEmitter);
        Transport.prototype.onData = function(data) {
            this.clearCloseTimeout();
            (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout();
            if (data !== "") {
                var msgs = io.parser.decodePayload(data);
                if (msgs && msgs.length) for (var i = 0, l = msgs.length; i < l; i++) this.onPacket(msgs[i]);
            }
            return this;
        };
        Transport.prototype.onPacket = function(packet) {
            this.socket.setHeartbeatTimeout();
            if (packet.type == "heartbeat") return this.onHeartbeat();
            packet.type == "connect" && packet.endpoint == "" && this.onConnect();
            packet.type == "error" && packet.advice == "reconnect" && (this.open = !1);
            this.socket.onPacket(packet);
            return this;
        };
        Transport.prototype.setCloseTimeout = function() {
            if (!this.closeTimeout) {
                var self = this;
                this.closeTimeout = setTimeout(function() {
                    self.onDisconnect();
                }, this.socket.closeTimeout);
            }
        };
        Transport.prototype.onDisconnect = function() {
            this.close && this.open && this.close();
            this.clearTimeouts();
            this.socket.onDisconnect();
            return this;
        };
        Transport.prototype.onConnect = function() {
            this.socket.onConnect();
            return this;
        };
        Transport.prototype.clearCloseTimeout = function() {
            if (this.closeTimeout && typeof this.closeTimeout == "number") {
                clearTimeout(this.closeTimeout);
                this.closeTimeout = null;
            }
        };
        Transport.prototype.clearTimeouts = function() {
            this.clearCloseTimeout();
            this.reopenTimeout && typeof this.reopenTimeout == "number" && clearTimeout(this.reopenTimeout);
        };
        Transport.prototype.packet = function(packet) {
            this.send(io.parser.encodePacket(packet));
        };
        Transport.prototype.onHeartbeat = function(heartbeat) {
            this.packet({
                type: "heartbeat"
            });
        };
        Transport.prototype.onOpen = function() {
            this.open = !0;
            this.clearCloseTimeout();
            this.socket.onOpen();
        };
        Transport.prototype.onClose = function() {
            var self = this;
            this.open = !1;
            this.socket.onClose();
            this.onDisconnect();
        };
        Transport.prototype.prepareUrl = function() {
            var options = this.socket.options;
            return this.scheme() + "://" + options.host + ":" + options.port + "/" + options.resource + "/" + io.protocol + "/" + this.name + "/" + this.sessid;
        };
        Transport.prototype.ready = function(socket, fn) {
            fn.call(this);
        };
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(exports, io, global) {
        function Socket(options) {
            this.options = {
                port: 80,
                secure: !1,
                document: "document" in global ? document : !1,
                resource: "socket.io",
                transports: io.transports,
                "connect timeout": 10000,
                "try multiple transports": !0,
                reconnect: !0,
                "reconnection delay": 500,
                "reconnection limit": Infinity,
                "reopen delay": 3000,
                "max reconnection attempts": 10,
                "sync disconnect on unload": !0,
                "auto connect": !0,
                "flash policy port": 10843
            };
            io.util.merge(this.options, options);
            this.firstHandshake = !0;
            this.connected = !1;
            this.open = !1;
            this.connecting = !1;
            this.reconnecting = !1;
            this.namespaces = {};
            this.buffer = [];
            this.doBuffer = !1;
            if (this.options["sync disconnect on unload"] && (!this.isXDomain() || io.util.ua.hasCORS)) {
                var self = this;
                io.util.on(global, "unload", function() {
                    self.disconnectSync();
                }, !1);
            }
            this.options["auto connect"] && this.connect();
        }
        function empty() {}
        exports.Socket = Socket;
        io.util.mixin(Socket, io.EventEmitter);
        Socket.prototype.of = function(name) {
            if (!this.namespaces[name]) {
                this.namespaces[name] = new io.SocketNamespace(this, name);
                name !== "" && this.namespaces[name].packet({
                    type: "connect"
                });
            }
            return this.namespaces[name];
        };
        Socket.prototype.publish = function() {
            this.emit.apply(this, arguments);
            var nsp;
            for (var i in this.namespaces) if (this.namespaces.hasOwnProperty(i)) {
                nsp = this.of(i);
                nsp.$emit.apply(nsp, arguments);
            }
        };
        Socket.prototype.handshake = function(fn) {
            function complete(data) {
                if (data instanceof Error) {
                    self.connecting = !1;
                    self.onError(data.message);
                } else fn.apply(null, data.split(":"));
            }
            var self = this, options = this.options, url = [ "http" + (options.secure ? "s" : "") + ":/", options.host + ":" + options.port, options.resource, io.protocol, io.util.query(this.options.query, "t=" + +(new Date)) ].join("/"), xhr = Ti.Network.createHTTPClient({
                withCredentials: !0,
                onload: function() {
                    self.firstHandshake = !1;
                    complete(xhr.responseText);
                },
                onerror: function(ev) {
                    if (self.firstHandshake) {
                        setTimeout(function() {
                            self.handshake(fn);
                        }, 6120);
                        return;
                    }
                    self.connecting = !1;
                    var err = {
                        reason: ev.error
                    };
                    ev.error.indexOf("refused") && (err.advice = "reconnect");
                    !self.reconnecting && self.onError(err);
                }
            });
            xhr.open("GET", url, !0);
            xhr.send(null);
        };
        Socket.prototype.getTransport = function(override) {
            var transports = override || this.transports, match;
            for (var i = 0, transport; transport = transports[i]; i++) if (io.Transport[transport] && io.Transport[transport].check(this) && (!this.isXDomain() || io.Transport[transport].xdomainCheck())) return new io.Transport[transport](this, this.sessionid);
            return null;
        };
        Socket.prototype.connect = function(fn) {
            if (this.connecting) return this;
            var self = this;
            self.connecting = !0;
            this.handshake(function(sid, heartbeat, close, transports) {
                function connect(transports) {
                    self.transport && self.transport.clearTimeouts();
                    self.transport = self.getTransport(transports);
                    if (!self.transport) return self.publish("connect_failed");
                    self.transport.ready(self, function() {
                        if (typeof self.transport.open != "function") return self.publish("connect_failed");
                        self.connecting = !0;
                        self.publish("connecting", self.transport.name);
                        self.transport.open();
                        self.options["connect timeout"] && (self.connectTimeoutTimer = setTimeout(function() {
                            if (!self.connected) {
                                self.connecting = !1;
                                if (self.options["try multiple transports"]) {
                                    self.remainingTransports || (self.remainingTransports = self.transports.slice(0));
                                    var remaining = self.remainingTransports;
                                    while (remaining.length > 0 && remaining.splice(0, 1)[0] != self.transport.name) ;
                                    remaining.length ? connect(remaining) : self.publish("connect_failed");
                                }
                            }
                        }, self.options["connect timeout"]));
                    });
                }
                self.sessionid = sid;
                self.closeTimeout = close * 1000;
                self.heartbeatTimeout = heartbeat * 1000;
                self.transports = transports ? io.util.intersect(transports.split(","), self.options.transports) : self.options.transports;
                self.setHeartbeatTimeout();
                connect(self.transports);
                self.once("connect", function() {
                    typeof self.connectTimeoutTimer == "number" && clearTimeout(self.connectTimeoutTimer);
                    fn && typeof fn == "function" && fn();
                });
            });
            return this;
        };
        Socket.prototype.setHeartbeatTimeout = function() {
            typeof this.heartbeatTimeoutTimer == "number" && clearTimeout(this.heartbeatTimeoutTimer);
            var self = this;
            this.heartbeatTimeoutTimer = setTimeout(function() {
                self.transport.onClose();
            }, this.heartbeatTimeout);
        };
        Socket.prototype.packet = function(data) {
            this.connected && !this.doBuffer ? this.transport.packet(data) : this.buffer.push(data);
            return this;
        };
        Socket.prototype.setBuffer = function(v) {
            this.doBuffer = v;
            if (!v && this.connected && this.buffer.length) {
                this.transport.payload(this.buffer);
                this.buffer = [];
            }
        };
        Socket.prototype.disconnect = function() {
            if (this.connected || this.connecting) {
                this.open && this.of("").packet({
                    type: "disconnect"
                });
                this.onDisconnect("booted");
            }
            return this;
        };
        Socket.prototype.disconnectSync = function() {
            var xhr = Ti.Network.createHTTPClient(), uri = this.resource + "/" + io.protocol + "/" + this.sessionid;
            xhr.open("GET", uri, !0);
            this.onDisconnect("booted");
        };
        Socket.prototype.isXDomain = function() {
            return !1;
        };
        Socket.prototype.onConnect = function() {
            if (!this.connected) {
                this.connected = !0;
                this.connecting = !1;
                this.doBuffer || this.setBuffer(!1);
                this.emit("connect");
            }
        };
        Socket.prototype.onOpen = function() {
            this.open = !0;
        };
        Socket.prototype.onClose = function() {
            this.open = !1;
            typeof this.heartbeatTimeoutTimer == "number" && clearTimeout(this.heartbeatTimeoutTimer);
        };
        Socket.prototype.onPacket = function(packet) {
            this.of(packet.endpoint).onPacket(packet);
        };
        Socket.prototype.onError = function(err) {
            if (err && err.advice && err.advice === "reconnect" && (this.connected || this.connecting)) {
                this.disconnect();
                this.options.reconnect && this.reconnect();
            }
            this.publish("error", err && err.reason ? err.reason : err);
        };
        Socket.prototype.onDisconnect = function(reason) {
            var wasConnected = this.connected, wasConnecting = this.connecting;
            this.connected = !1;
            this.connecting = !1;
            this.open = !1;
            if (wasConnected || wasConnecting) {
                this.transport.close();
                this.transport.clearTimeouts();
                if (wasConnected) {
                    this.publish("disconnect", reason);
                    "booted" != reason && this.options.reconnect && !this.reconnecting && this.reconnect();
                }
            }
        };
        Socket.prototype.reconnect = function() {
            function reset() {
                if (self.connected) {
                    for (var i in self.namespaces) self.namespaces.hasOwnProperty(i) && "" !== i && self.namespaces[i].packet({
                        type: "connect"
                    });
                    self.publish("reconnect", self.transport.name, self.reconnectionAttempts);
                }
                typeof self.reconnectionTimer == "number" && clearTimeout(self.reconnectionTimer);
                self.removeListener("connect_failed", maybeReconnect);
                self.removeListener("connect", maybeReconnect);
                self.reconnecting = !1;
                delete self.reconnectionAttempts;
                delete self.reconnectionDelay;
                delete self.reconnectionTimer;
                delete self.redoTransports;
                self.options["try multiple transports"] = tryMultiple;
            }
            function maybeReconnect() {
                if (!self.reconnecting) return;
                if (self.connected) return reset();
                if (self.connecting && self.reconnecting) return self.reconnectionTimer = setTimeout(maybeReconnect, 1000);
                if (self.reconnectionAttempts++ >= maxAttempts) if (!self.redoTransports) {
                    self.on("connect_failed", maybeReconnect);
                    self.options["try multiple transports"] = !0;
                    self.transport = self.getTransport();
                    self.redoTransports = !0;
                    self.connect();
                } else {
                    self.publish("reconnect_failed");
                    reset();
                } else {
                    self.reconnectionDelay < limit && (self.reconnectionDelay *= 2);
                    self.connect();
                    self.publish("reconnecting", self.reconnectionDelay, self.reconnectionAttempts);
                    self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay);
                }
            }
            this.reconnecting = !0;
            this.reconnectionAttempts = 0;
            this.reconnectionDelay = this.options["reconnection delay"];
            var self = this, maxAttempts = this.options["max reconnection attempts"], tryMultiple = this.options["try multiple transports"], limit = this.options["reconnection limit"];
            this.options["try multiple transports"] = !1;
            this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay);
            this.on("connect", maybeReconnect);
        };
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
    (function(exports, io) {
        function SocketNamespace(socket, name) {
            this.socket = socket;
            this.name = name || "";
            this.flags = {};
            this.json = new Flag(this, "json");
            this.ackPackets = 0;
            this.acks = {};
        }
        function Flag(nsp, name) {
            this.namespace = nsp;
            this.name = name;
        }
        exports.SocketNamespace = SocketNamespace;
        io.util.mixin(SocketNamespace, io.EventEmitter);
        SocketNamespace.prototype.$emit = io.EventEmitter.prototype.emit;
        SocketNamespace.prototype.of = function() {
            return this.socket.of.apply(this.socket, arguments);
        };
        SocketNamespace.prototype.packet = function(packet) {
            packet.endpoint = this.name;
            this.socket.packet(packet);
            this.flags = {};
            return this;
        };
        SocketNamespace.prototype.send = function(data, fn) {
            var packet = {
                type: this.flags.json ? "json" : "message",
                data: data
            };
            if ("function" == typeof fn) {
                packet.id = ++this.ackPackets;
                packet.ack = !0;
                this.acks[packet.id] = fn;
            }
            return this.packet(packet);
        };
        SocketNamespace.prototype.emit = function(name) {
            var args = Array.prototype.slice.call(arguments, 1), lastArg = args[args.length - 1], packet = {
                type: "event",
                name: name
            };
            if ("function" == typeof lastArg) {
                packet.id = ++this.ackPackets;
                packet.ack = "data";
                this.acks[packet.id] = lastArg;
                args = args.slice(0, args.length - 1);
            }
            packet.args = args;
            return this.packet(packet);
        };
        SocketNamespace.prototype.disconnect = function() {
            if (this.name === "") this.socket.disconnect(); else {
                this.packet({
                    type: "disconnect"
                });
                this.$emit("disconnect");
            }
            return this;
        };
        SocketNamespace.prototype.onPacket = function(packet) {
            function ack() {
                self.packet({
                    type: "ack",
                    args: io.util.toArray(arguments),
                    ackId: packet.id
                });
            }
            var self = this;
            switch (packet.type) {
              case "connect":
                this.$emit("connect");
                break;
              case "disconnect":
                this.name === "" ? this.socket.onDisconnect(packet.reason || "booted") : this.$emit("disconnect", packet.reason);
                break;
              case "message":
              case "json":
                var params = [ "message", packet.data ];
                packet.ack == "data" ? params.push(ack) : packet.ack && this.packet({
                    type: "ack",
                    ackId: packet.id
                });
                this.$emit.apply(this, params);
                break;
              case "event":
                var params = [ packet.name ].concat(packet.args);
                packet.ack == "data" && params.push(ack);
                this.$emit.apply(this, params);
                break;
              case "ack":
                if (this.acks[packet.ackId]) {
                    this.acks[packet.ackId].apply(this, packet.args);
                    delete this.acks[packet.ackId];
                }
                break;
              case "error":
                packet.advice ? this.socket.onError(packet) : packet.reason == "unauthorized" ? this.$emit("connect_failed", packet.reason) : this.$emit("error", packet.reason);
            }
        };
        Flag.prototype.send = function() {
            this.namespace.flags[this.name] = !0;
            this.namespace.send.apply(this.namespace, arguments);
        };
        Flag.prototype.emit = function() {
            this.namespace.flags[this.name] = !0;
            this.namespace.emit.apply(this.namespace, arguments);
        };
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(exports, io, global) {
        function WS(socket) {
            io.Transport.apply(this, arguments);
        }
        exports.websocket = WS;
        io.util.inherit(WS, io.Transport);
        WS.prototype.name = "websocket";
        WS.prototype.open = function() {
            var query = io.util.query(this.socket.options.query), self = this, Socket;
            this.websocket = require("net.iamyellow.tiws").createWS();
            this.websocket.addEventListener("open", function() {
                self.onOpen();
                self.socket.setBuffer(!1);
            });
            this.websocket.addEventListener("message", function(ev) {
                self.onData(ev.data);
            });
            this.websocket.addEventListener("close", function(ev) {
                self.onClose();
                self.socket.setBuffer(!0);
            });
            this.websocket.addEventListener("error", function(ev) {
                self.onError(ev);
            });
            Ti.API.info(this.prepareUrl() + query);
            this.websocket.open(this.prepareUrl() + query);
            return this;
        };
        io.util.ua.iDevice ? WS.prototype.send = function(data) {
            var self = this;
            setTimeout(function() {
                self.websocket.send(data);
            }, 0);
            return this;
        } : WS.prototype.send = function(data) {
            this.websocket.send(data);
            return this;
        };
        WS.prototype.payload = function(arr) {
            for (var i = 0, l = arr.length; i < l; i++) this.packet(arr[i]);
            return this;
        };
        WS.prototype.close = function() {
            return this;
        };
        WS.prototype.onError = function(e) {
            this.socket.onError(e);
        };
        WS.prototype.scheme = function() {
            return this.socket.options.secure ? "wss" : "ws";
        };
        WS.check = function() {
            return !0;
        };
        WS.xdomainCheck = function() {
            return !0;
        };
        io.transports.push("websocket");
    })("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
})();