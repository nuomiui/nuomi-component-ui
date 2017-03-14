/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "2548f65ad59484dce9e9"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotMainModule = true; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			hotMainModule = false;
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 					finishChunkLoading();
/******/ 					throw err;
/******/ 				});
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotMainModule,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotMainModule = true;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "2548f65ad59484dce9e9"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotMainModule = true; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			hotMainModule = false;
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 					finishChunkLoading();
/******/ 					throw err;
/******/ 				});
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotMainModule,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotMainModule = true;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: [],
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(90)(__webpack_require__.s = 90);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(10)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(9)
  , IE8_DOM_DEFINE = __webpack_require__(33)
  , toPrimitive    = __webpack_require__(25)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(2) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(65)
  , defined = __webpack_require__(15);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(1)
  , core      = __webpack_require__(0)
  , ctx       = __webpack_require__(31)
  , hide      = __webpack_require__(7)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(4)
  , createDesc = __webpack_require__(13);
module.exports = __webpack_require__(2) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(23)('wks')
  , uid        = __webpack_require__(14)
  , Symbol     = __webpack_require__(1).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(11);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(39)
  , enumBugKeys = __webpack_require__(16);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(9)
  , dPs         = __webpack_require__(71)
  , enumBugKeys = __webpack_require__(16)
  , IE_PROTO    = __webpack_require__(22)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(32)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(64).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(4).f
  , has = __webpack_require__(3)
  , TAG = __webpack_require__(8)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(23)('keys')
  , uid    = __webpack_require__(14);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(1)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(11);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(1)
  , core           = __webpack_require__(0)
  , LIBRARY        = __webpack_require__(18)
  , wksExt         = __webpack_require__(27)
  , defineProperty = __webpack_require__(4).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(8);

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * react-lite.js v0.15.33
 * (c) 2017 Jade Gu
 * Released under the MIT License.
 */
(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.React = factory();
}(this, function () { 'use strict';

  var HTML_KEY = 'dangerouslySetInnerHTML';
  var SVGNamespaceURI = 'http://www.w3.org/2000/svg';
  var COMPONENT_ID = 'liteid';
  var VELEMENT = 2;
  var VSTATELESS = 3;
  var VCOMPONENT = 4;
  var VCOMMENT = 5;
  var ELEMENT_NODE_TYPE = 1;
  var DOC_NODE_TYPE = 9;
  var DOCUMENT_FRAGMENT_NODE_TYPE = 11;

  /**
   * current stateful component's refs property
   * will attach to every vnode created by calling component.render method
   */
  var refs = null;

  function createVnode(vtype, type, props, key, ref) {
      var vnode = {
          vtype: vtype,
          type: type,
          props: props,
          refs: refs,
          key: key,
          ref: ref
      };
      if (vtype === VSTATELESS || vtype === VCOMPONENT) {
          vnode.uid = getUid();
      }
      return vnode;
  }

  function initVnode(vnode, parentContext, namespaceURI) {
      var vtype = vnode.vtype;

      var node = null;
      if (!vtype) {
          // init text
          node = document.createTextNode(vnode);
      } else if (vtype === VELEMENT) {
          // init element
          node = initVelem(vnode, parentContext, namespaceURI);
      } else if (vtype === VCOMPONENT) {
          // init stateful component
          node = initVcomponent(vnode, parentContext, namespaceURI);
      } else if (vtype === VSTATELESS) {
          // init stateless component
          node = initVstateless(vnode, parentContext, namespaceURI);
      } else if (vtype === VCOMMENT) {
          // init comment
          node = document.createComment('react-text: ' + (vnode.uid || getUid()));
      }
      return node;
  }

  function updateVnode(vnode, newVnode, node, parentContext) {
      var vtype = vnode.vtype;

      if (vtype === VCOMPONENT) {
          return updateVcomponent(vnode, newVnode, node, parentContext);
      }

      if (vtype === VSTATELESS) {
          return updateVstateless(vnode, newVnode, node, parentContext);
      }

      // ignore VCOMMENT and other vtypes
      if (vtype !== VELEMENT) {
          return node;
      }

      var oldHtml = vnode.props[HTML_KEY] && vnode.props[HTML_KEY].__html;
      if (oldHtml != null) {
          updateVelem(vnode, newVnode, node, parentContext);
          initVchildren(newVnode, node, parentContext);
      } else {
          updateVChildren(vnode, newVnode, node, parentContext);
          updateVelem(vnode, newVnode, node, parentContext);
      }
      return node;
  }

  function updateVChildren(vnode, newVnode, node, parentContext) {
      var patches = {
          removes: [],
          updates: [],
          creates: []
      };
      diffVchildren(patches, vnode, newVnode, node, parentContext);
      flatEach(patches.removes, applyDestroy);
      flatEach(patches.updates, applyUpdate);
      flatEach(patches.creates, applyCreate);
  }

  function applyUpdate(data) {
      if (!data) {
          return;
      }
      var vnode = data.vnode;
      var newNode = data.node;

      // update
      if (!data.shouldIgnore) {
          if (!vnode.vtype) {
              newNode.replaceData(0, newNode.length, data.newVnode);
          } else if (vnode.vtype === VELEMENT) {
              updateVelem(vnode, data.newVnode, newNode, data.parentContext);
          } else if (vnode.vtype === VSTATELESS) {
              newNode = updateVstateless(vnode, data.newVnode, newNode, data.parentContext);
          } else if (vnode.vtype === VCOMPONENT) {
              newNode = updateVcomponent(vnode, data.newVnode, newNode, data.parentContext);
          }
      }

      // re-order
      var currentNode = newNode.parentNode.childNodes[data.index];
      if (currentNode !== newNode) {
          newNode.parentNode.insertBefore(newNode, currentNode);
      }
      return newNode;
  }

  function applyDestroy(data) {
      destroyVnode(data.vnode, data.node);
      data.node.parentNode.removeChild(data.node);
  }

  function applyCreate(data) {
      var node = initVnode(data.vnode, data.parentContext, data.parentNode.namespaceURI);
      data.parentNode.insertBefore(node, data.parentNode.childNodes[data.index]);
  }

  /**
   * Only vnode which has props.children need to call destroy function
   * to check whether subTree has component that need to call lify-cycle method and release cache.
   */

  function destroyVnode(vnode, node) {
      var vtype = vnode.vtype;

      if (vtype === VELEMENT) {
          // destroy element
          destroyVelem(vnode, node);
      } else if (vtype === VCOMPONENT) {
          // destroy state component
          destroyVcomponent(vnode, node);
      } else if (vtype === VSTATELESS) {
          // destroy stateless component
          destroyVstateless(vnode, node);
      }
  }

  function initVelem(velem, parentContext, namespaceURI) {
      var type = velem.type;
      var props = velem.props;

      var node = null;

      if (type === 'svg' || namespaceURI === SVGNamespaceURI) {
          node = document.createElementNS(SVGNamespaceURI, type);
          namespaceURI = SVGNamespaceURI;
      } else {
          node = document.createElement(type);
      }

      initVchildren(velem, node, parentContext);

      var isCustomComponent = type.indexOf('-') >= 0 || props.is != null;
      setProps(node, props, isCustomComponent);

      if (velem.ref != null) {
          addItem(pendingRefs, velem);
          addItem(pendingRefs, node);
      }

      return node;
  }

  function initVchildren(velem, node, parentContext) {
      var vchildren = node.vchildren = getFlattenChildren(velem);
      var namespaceURI = node.namespaceURI;
      for (var i = 0, len = vchildren.length; i < len; i++) {
          node.appendChild(initVnode(vchildren[i], parentContext, namespaceURI));
      }
  }

  function getFlattenChildren(vnode) {
      var children = vnode.props.children;

      var vchildren = [];
      if (isArr(children)) {
          flatEach(children, collectChild, vchildren);
      } else {
          collectChild(children, vchildren);
      }
      return vchildren;
  }

  function collectChild(child, children) {
      if (child != null && typeof child !== 'boolean') {
          if (!child.vtype) {
              // convert immutablejs data
              if (child.toJS) {
                  child = child.toJS();
                  if (isArr(child)) {
                      flatEach(child, collectChild, children);
                  } else {
                      collectChild(child, children);
                  }
                  return;
              }
              child = '' + child;
          }
          children[children.length] = child;
      }
  }

  function diffVchildren(patches, vnode, newVnode, node, parentContext) {
      var childNodes = node.childNodes;
      var vchildren = node.vchildren;

      var newVchildren = node.vchildren = getFlattenChildren(newVnode);
      var vchildrenLen = vchildren.length;
      var newVchildrenLen = newVchildren.length;

      if (vchildrenLen === 0) {
          if (newVchildrenLen > 0) {
              for (var i = 0; i < newVchildrenLen; i++) {
                  addItem(patches.creates, {
                      vnode: newVchildren[i],
                      parentNode: node,
                      parentContext: parentContext,
                      index: i
                  });
              }
          }
          return;
      } else if (newVchildrenLen === 0) {
          for (var i = 0; i < vchildrenLen; i++) {
              addItem(patches.removes, {
                  vnode: vchildren[i],
                  node: childNodes[i]
              });
          }
          return;
      }

      var updates = Array(newVchildrenLen);
      var removes = null;
      var creates = null;

      // isEqual
      for (var i = 0; i < vchildrenLen; i++) {
          var _vnode = vchildren[i];
          for (var j = 0; j < newVchildrenLen; j++) {
              if (updates[j]) {
                  continue;
              }
              var _newVnode = newVchildren[j];
              if (_vnode === _newVnode) {
                  var shouldIgnore = true;
                  if (parentContext) {
                      if (_vnode.vtype === VCOMPONENT || _vnode.vtype === VSTATELESS) {
                          if (_vnode.type.contextTypes) {
                              shouldIgnore = false;
                          }
                      }
                  }
                  updates[j] = {
                      shouldIgnore: shouldIgnore,
                      vnode: _vnode,
                      newVnode: _newVnode,
                      node: childNodes[i],
                      parentContext: parentContext,
                      index: j
                  };
                  vchildren[i] = null;
                  break;
              }
          }
      }

      // isSimilar
      for (var i = 0; i < vchildrenLen; i++) {
          var _vnode2 = vchildren[i];
          if (_vnode2 === null) {
              continue;
          }
          var shouldRemove = true;
          for (var j = 0; j < newVchildrenLen; j++) {
              if (updates[j]) {
                  continue;
              }
              var _newVnode2 = newVchildren[j];
              if (_newVnode2.type === _vnode2.type && _newVnode2.key === _vnode2.key && _newVnode2.refs === _vnode2.refs) {
                  updates[j] = {
                      vnode: _vnode2,
                      newVnode: _newVnode2,
                      node: childNodes[i],
                      parentContext: parentContext,
                      index: j
                  };
                  shouldRemove = false;
                  break;
              }
          }
          if (shouldRemove) {
              if (!removes) {
                  removes = [];
              }
              addItem(removes, {
                  vnode: _vnode2,
                  node: childNodes[i]
              });
          }
      }

      for (var i = 0; i < newVchildrenLen; i++) {
          var item = updates[i];
          if (!item) {
              if (!creates) {
                  creates = [];
              }
              addItem(creates, {
                  vnode: newVchildren[i],
                  parentNode: node,
                  parentContext: parentContext,
                  index: i
              });
          } else if (item.vnode.vtype === VELEMENT) {
              diffVchildren(patches, item.vnode, item.newVnode, item.node, item.parentContext);
          }
      }

      if (removes) {
          addItem(patches.removes, removes);
      }
      if (creates) {
          addItem(patches.creates, creates);
      }
      addItem(patches.updates, updates);
  }

  function updateVelem(velem, newVelem, node) {
      var isCustomComponent = velem.type.indexOf('-') >= 0 || velem.props.is != null;
      patchProps(node, velem.props, newVelem.props, isCustomComponent);
      if (velem.ref !== newVelem.ref) {
          detachRef(velem.refs, velem.ref, node);
          attachRef(newVelem.refs, newVelem.ref, node);
      }
      return node;
  }

  function destroyVelem(velem, node) {
      var props = velem.props;
      var vchildren = node.vchildren;
      var childNodes = node.childNodes;

      if (vchildren) {
          for (var i = 0, len = vchildren.length; i < len; i++) {
              destroyVnode(vchildren[i], childNodes[i]);
          }
      }
      detachRef(velem.refs, velem.ref, node);
      node.eventStore = node.vchildren = null;
  }

  function initVstateless(vstateless, parentContext, namespaceURI) {
      var vnode = renderVstateless(vstateless, parentContext);
      var node = initVnode(vnode, parentContext, namespaceURI);
      node.cache = node.cache || {};
      node.cache[vstateless.uid] = vnode;
      return node;
  }

  function updateVstateless(vstateless, newVstateless, node, parentContext) {
      var uid = vstateless.uid;
      var vnode = node.cache[uid];
      delete node.cache[uid];
      var newVnode = renderVstateless(newVstateless, parentContext);
      var newNode = compareTwoVnodes(vnode, newVnode, node, parentContext);
      newNode.cache = newNode.cache || {};
      newNode.cache[newVstateless.uid] = newVnode;
      if (newNode !== node) {
          syncCache(newNode.cache, node.cache, newNode);
      }
      return newNode;
  }

  function destroyVstateless(vstateless, node) {
      var uid = vstateless.uid;
      var vnode = node.cache[uid];
      delete node.cache[uid];
      destroyVnode(vnode, node);
  }

  function renderVstateless(vstateless, parentContext) {
      var factory = vstateless.type;
      var props = vstateless.props;

      var componentContext = getContextByTypes(parentContext, factory.contextTypes);
      var vnode = factory(props, componentContext);
      if (vnode && vnode.render) {
          vnode = vnode.render();
      }
      if (vnode === null || vnode === false) {
          vnode = createVnode(VCOMMENT);
      } else if (!vnode || !vnode.vtype) {
          throw new Error('@' + factory.name + '#render:You may have returned undefined, an array or some other invalid object');
      }
      return vnode;
  }

  function initVcomponent(vcomponent, parentContext, namespaceURI) {
      var Component = vcomponent.type;
      var props = vcomponent.props;
      var uid = vcomponent.uid;

      var componentContext = getContextByTypes(parentContext, Component.contextTypes);
      var component = new Component(props, componentContext);
      var updater = component.$updater;
      var cache = component.$cache;

      cache.parentContext = parentContext;
      updater.isPending = true;
      component.props = component.props || props;
      component.context = component.context || componentContext;
      if (component.componentWillMount) {
          component.componentWillMount();
          component.state = updater.getState();
      }
      var vnode = renderComponent(component);
      var node = initVnode(vnode, getChildContext(component, parentContext), namespaceURI);
      node.cache = node.cache || {};
      node.cache[uid] = component;
      cache.vnode = vnode;
      cache.node = node;
      cache.isMounted = true;
      addItem(pendingComponents, component);

      if (vcomponent.ref != null) {
          addItem(pendingRefs, vcomponent);
          addItem(pendingRefs, component);
      }

      return node;
  }

  function updateVcomponent(vcomponent, newVcomponent, node, parentContext) {
      var uid = vcomponent.uid;
      var component = node.cache[uid];
      var updater = component.$updater;
      var cache = component.$cache;
      var Component = newVcomponent.type;
      var nextProps = newVcomponent.props;

      var componentContext = getContextByTypes(parentContext, Component.contextTypes);
      delete node.cache[uid];
      node.cache[newVcomponent.uid] = component;
      cache.parentContext = parentContext;
      if (component.componentWillReceiveProps) {
          var needToggleIsPending = !updater.isPending;
          if (needToggleIsPending) updater.isPending = true;
          component.componentWillReceiveProps(nextProps, componentContext);
          if (needToggleIsPending) updater.isPending = false;
      }

      if (vcomponent.ref !== newVcomponent.ref) {
          detachRef(vcomponent.refs, vcomponent.ref, component);
          attachRef(newVcomponent.refs, newVcomponent.ref, component);
      }

      updater.emitUpdate(nextProps, componentContext);

      return cache.node;
  }

  function destroyVcomponent(vcomponent, node) {
      var uid = vcomponent.uid;
      var component = node.cache[uid];
      var cache = component.$cache;
      delete node.cache[uid];
      detachRef(vcomponent.refs, vcomponent.ref, component);
      component.setState = component.forceUpdate = noop;
      if (component.componentWillUnmount) {
          component.componentWillUnmount();
      }
      destroyVnode(cache.vnode, node);
      delete component.setState;
      cache.isMounted = false;
      cache.node = cache.parentContext = cache.vnode = component.refs = component.context = null;
  }

  function getContextByTypes(curContext, contextTypes) {
      var context = {};
      if (!contextTypes || !curContext) {
          return context;
      }
      for (var key in contextTypes) {
          if (contextTypes.hasOwnProperty(key)) {
              context[key] = curContext[key];
          }
      }
      return context;
  }

  function renderComponent(component, parentContext) {
      refs = component.refs;
      var vnode = component.render();
      if (vnode === null || vnode === false) {
          vnode = createVnode(VCOMMENT);
      } else if (!vnode || !vnode.vtype) {
          throw new Error('@' + component.constructor.name + '#render:You may have returned undefined, an array or some other invalid object');
      }
      refs = null;
      return vnode;
  }

  function getChildContext(component, parentContext) {
      if (component.getChildContext) {
          var curContext = component.getChildContext();
          if (curContext) {
              parentContext = extend(extend({}, parentContext), curContext);
          }
      }
      return parentContext;
  }

  var pendingComponents = [];
  function clearPendingComponents() {
      var len = pendingComponents.length;
      if (!len) {
          return;
      }
      var components = pendingComponents;
      pendingComponents = [];
      var i = -1;
      while (len--) {
          var component = components[++i];
          var updater = component.$updater;
          if (component.componentDidMount) {
              component.componentDidMount();
          }
          updater.isPending = false;
          updater.emitUpdate();
      }
  }

  var pendingRefs = [];
  function clearPendingRefs() {
      var len = pendingRefs.length;
      if (!len) {
          return;
      }
      var list = pendingRefs;
      pendingRefs = [];
      for (var i = 0; i < len; i += 2) {
          var vnode = list[i];
          var refValue = list[i + 1];
          attachRef(vnode.refs, vnode.ref, refValue);
      }
  }

  function clearPending() {
      clearPendingRefs();
      clearPendingComponents();
  }

  function compareTwoVnodes(vnode, newVnode, node, parentContext) {
      var newNode = node;
      if (newVnode == null) {
          // remove
          destroyVnode(vnode, node);
          node.parentNode.removeChild(node);
      } else if (vnode.type !== newVnode.type || vnode.key !== newVnode.key) {
          // replace
          destroyVnode(vnode, node);
          newNode = initVnode(newVnode, parentContext, node.namespaceURI);
          node.parentNode.replaceChild(newNode, node);
      } else if (vnode !== newVnode || parentContext) {
          // same type and same key -> update
          newNode = updateVnode(vnode, newVnode, node, parentContext);
      }
      return newNode;
  }

  function getDOMNode() {
      return this;
  }

  function attachRef(refs, refKey, refValue) {
      if (refKey == null || !refValue) {
          return;
      }
      if (refValue.nodeName && !refValue.getDOMNode) {
          // support react v0.13 style: this.refs.myInput.getDOMNode()
          refValue.getDOMNode = getDOMNode;
      }
      if (isFn(refKey)) {
          refKey(refValue);
      } else if (refs) {
          refs[refKey] = refValue;
      }
  }

  function detachRef(refs, refKey, refValue) {
      if (refKey == null) {
          return;
      }
      if (isFn(refKey)) {
          refKey(null);
      } else if (refs && refs[refKey] === refValue) {
          delete refs[refKey];
      }
  }

  function syncCache(cache, oldCache, node) {
      for (var key in oldCache) {
          if (!oldCache.hasOwnProperty(key)) {
              continue;
          }
          var value = oldCache[key];
          cache[key] = value;

          // is component, update component.$cache.node
          if (value.forceUpdate) {
              value.$cache.node = node;
          }
      }
  }

  var updateQueue = {
  	updaters: [],
  	isPending: false,
  	add: function add(updater) {
  		addItem(this.updaters, updater);
  	},
  	batchUpdate: function batchUpdate() {
  		if (this.isPending) {
  			return;
  		}
  		this.isPending = true;
  		/*
     each updater.update may add new updater to updateQueue
     clear them with a loop
     event bubbles from bottom-level to top-level
     reverse the updater order can merge some props and state and reduce the refresh times
     see Updater.update method below to know why
    */
  		var updaters = this.updaters;

  		var updater = undefined;
  		while (updater = updaters.pop()) {
  			updater.updateComponent();
  		}
  		this.isPending = false;
  	}
  };

  function Updater(instance) {
  	this.instance = instance;
  	this.pendingStates = [];
  	this.pendingCallbacks = [];
  	this.isPending = false;
  	this.nextProps = this.nextContext = null;
  	this.clearCallbacks = this.clearCallbacks.bind(this);
  }

  Updater.prototype = {
  	emitUpdate: function emitUpdate(nextProps, nextContext) {
  		this.nextProps = nextProps;
  		this.nextContext = nextContext;
  		// receive nextProps!! should update immediately
  		nextProps || !updateQueue.isPending ? this.updateComponent() : updateQueue.add(this);
  	},
  	updateComponent: function updateComponent() {
  		var instance = this.instance;
  		var pendingStates = this.pendingStates;
  		var nextProps = this.nextProps;
  		var nextContext = this.nextContext;

  		if (nextProps || pendingStates.length > 0) {
  			nextProps = nextProps || instance.props;
  			nextContext = nextContext || instance.context;
  			this.nextProps = this.nextContext = null;
  			// merge the nextProps and nextState and update by one time
  			shouldUpdate(instance, nextProps, this.getState(), nextContext, this.clearCallbacks);
  		}
  	},
  	addState: function addState(nextState) {
  		if (nextState) {
  			addItem(this.pendingStates, nextState);
  			if (!this.isPending) {
  				this.emitUpdate();
  			}
  		}
  	},
  	replaceState: function replaceState(nextState) {
  		var pendingStates = this.pendingStates;

  		pendingStates.pop();
  		// push special params to point out should replace state
  		addItem(pendingStates, [nextState]);
  	},
  	getState: function getState() {
  		var instance = this.instance;
  		var pendingStates = this.pendingStates;
  		var state = instance.state;
  		var props = instance.props;

  		if (pendingStates.length) {
  			state = extend({}, state);
  			pendingStates.forEach(function (nextState) {
  				var isReplace = isArr(nextState);
  				if (isReplace) {
  					nextState = nextState[0];
  				}
  				if (isFn(nextState)) {
  					nextState = nextState.call(instance, state, props);
  				}
  				// replace state
  				if (isReplace) {
  					state = extend({}, nextState);
  				} else {
  					extend(state, nextState);
  				}
  			});
  			pendingStates.length = 0;
  		}
  		return state;
  	},
  	clearCallbacks: function clearCallbacks() {
  		var pendingCallbacks = this.pendingCallbacks;
  		var instance = this.instance;

  		if (pendingCallbacks.length > 0) {
  			this.pendingCallbacks = [];
  			pendingCallbacks.forEach(function (callback) {
  				return callback.call(instance);
  			});
  		}
  	},
  	addCallback: function addCallback(callback) {
  		if (isFn(callback)) {
  			addItem(this.pendingCallbacks, callback);
  		}
  	}
  };
  function Component(props, context) {
  	this.$updater = new Updater(this);
  	this.$cache = { isMounted: false };
  	this.props = props;
  	this.state = {};
  	this.refs = {};
  	this.context = context;
  }

  var ReactComponentSymbol = {};

  Component.prototype = {
  	constructor: Component,
  	isReactComponent: ReactComponentSymbol,
  	// getChildContext: _.noop,
  	// componentWillUpdate: _.noop,
  	// componentDidUpdate: _.noop,
  	// componentWillReceiveProps: _.noop,
  	// componentWillMount: _.noop,
  	// componentDidMount: _.noop,
  	// componentWillUnmount: _.noop,
  	// shouldComponentUpdate(nextProps, nextState) {
  	// 	return true
  	// },
  	forceUpdate: function forceUpdate(callback) {
  		var $updater = this.$updater;
  		var $cache = this.$cache;
  		var props = this.props;
  		var state = this.state;
  		var context = this.context;

  		if (!$cache.isMounted) {
  			return;
  		}
  		// if updater is pending, add state to trigger nexttick update
  		if ($updater.isPending) {
  			$updater.addState(state);
  			return;
  		}
  		var nextProps = $cache.props || props;
  		var nextState = $cache.state || state;
  		var nextContext = $cache.context || context;
  		var parentContext = $cache.parentContext;
  		var node = $cache.node;
  		var vnode = $cache.vnode;
  		$cache.props = $cache.state = $cache.context = null;
  		$updater.isPending = true;
  		if (this.componentWillUpdate) {
  			this.componentWillUpdate(nextProps, nextState, nextContext);
  		}
  		this.state = nextState;
  		this.props = nextProps;
  		this.context = nextContext;
  		var newVnode = renderComponent(this);
  		var newNode = compareTwoVnodes(vnode, newVnode, node, getChildContext(this, parentContext));
  		if (newNode !== node) {
  			newNode.cache = newNode.cache || {};
  			syncCache(newNode.cache, node.cache, newNode);
  		}
  		$cache.vnode = newVnode;
  		$cache.node = newNode;
  		clearPending();
  		if (this.componentDidUpdate) {
  			this.componentDidUpdate(props, state, context);
  		}
  		if (callback) {
  			callback.call(this);
  		}
  		$updater.isPending = false;
  		$updater.emitUpdate();
  	},
  	setState: function setState(nextState, callback) {
  		var $updater = this.$updater;

  		$updater.addCallback(callback);
  		$updater.addState(nextState);
  	},
  	replaceState: function replaceState(nextState, callback) {
  		var $updater = this.$updater;

  		$updater.addCallback(callback);
  		$updater.replaceState(nextState);
  	},
  	getDOMNode: function getDOMNode() {
  		var node = this.$cache.node;
  		return node && node.nodeName === '#comment' ? null : node;
  	},
  	isMounted: function isMounted() {
  		return this.$cache.isMounted;
  	}
  };

  function shouldUpdate(component, nextProps, nextState, nextContext, callback) {
  	var shouldComponentUpdate = true;
  	if (component.shouldComponentUpdate) {
  		shouldComponentUpdate = component.shouldComponentUpdate(nextProps, nextState, nextContext);
  	}
  	if (shouldComponentUpdate === false) {
  		component.props = nextProps;
  		component.state = nextState;
  		component.context = nextContext || {};
  		return;
  	}
  	var cache = component.$cache;
  	cache.props = nextProps;
  	cache.state = nextState;
  	cache.context = nextContext || {};
  	component.forceUpdate(callback);
  }

  // event config
  var unbubbleEvents = {
      /**
       * should not bind mousemove in document scope
       * even though mousemove event can bubble
       */
      onmousemove: 1,
      ontouchmove: 1,
      onmouseleave: 1,
      onmouseenter: 1,
      onload: 1,
      onunload: 1,
      onscroll: 1,
      onfocus: 1,
      onblur: 1,
      onrowexit: 1,
      onbeforeunload: 1,
      onstop: 1,
      ondragdrop: 1,
      ondragenter: 1,
      ondragexit: 1,
      ondraggesture: 1,
      ondragover: 1,
      oncontextmenu: 1,
      onerror: 1
  };

  function getEventName(key) {
      if (key === 'onDoubleClick') {
          key = 'ondblclick';
      } else if (key === 'onTouchTap') {
          key = 'onclick';
      }

      return key.toLowerCase();
  }

  // Mobile Safari does not fire properly bubble click events on
  // non-interactive elements, which means delegated click listeners do not
  // fire. The workaround for this bug involves attaching an empty click
  // listener on the target node.
  var inMobile = ('ontouchstart' in document);
  var emptyFunction = function emptyFunction() {};
  var ON_CLICK_KEY = 'onclick';

  var eventTypes = {};

  function addEvent(elem, eventType, listener) {
      eventType = getEventName(eventType);

      var eventStore = elem.eventStore || (elem.eventStore = {});
      eventStore[eventType] = listener;

      if (unbubbleEvents[eventType] === 1) {
          elem[eventType] = dispatchUnbubbleEvent;
          return;
      } else if (!eventTypes[eventType]) {
          // onclick -> click
          document.addEventListener(eventType.substr(2), dispatchEvent, false);
          eventTypes[eventType] = true;
      }

      if (inMobile && eventType === ON_CLICK_KEY) {
          elem.addEventListener('click', emptyFunction, false);
          return;
      }

      var nodeName = elem.nodeName;

      if (eventType === 'onchange') {
          addEvent(elem, 'oninput', listener);
      }
  }

  function removeEvent(elem, eventType) {
      eventType = getEventName(eventType);

      var eventStore = elem.eventStore || (elem.eventStore = {});
      delete eventStore[eventType];

      if (unbubbleEvents[eventType] === 1) {
          elem[eventType] = null;
          return;
      } else if (inMobile && eventType === ON_CLICK_KEY) {
          elem.removeEventListener('click', emptyFunction, false);
          return;
      }

      var nodeName = elem.nodeName;

      if (eventType === 'onchange') {
          delete eventStore['oninput'];
      }
  }

  function dispatchEvent(event) {
      var target = event.target;
      var type = event.type;

      var eventType = 'on' + type;
      var syntheticEvent = undefined;

      updateQueue.isPending = true;
      while (target) {
          var _target = target;
          var eventStore = _target.eventStore;

          var listener = eventStore && eventStore[eventType];
          if (!listener) {
              target = target.parentNode;
              continue;
          }
          if (!syntheticEvent) {
              syntheticEvent = createSyntheticEvent(event);
          }
          syntheticEvent.currentTarget = target;
          listener.call(target, syntheticEvent);
          if (syntheticEvent.$cancelBubble) {
              break;
          }
          target = target.parentNode;
      }
      updateQueue.isPending = false;
      updateQueue.batchUpdate();
  }

  function dispatchUnbubbleEvent(event) {
      var target = event.currentTarget || event.target;
      var eventType = 'on' + event.type;
      var syntheticEvent = createSyntheticEvent(event);

      syntheticEvent.currentTarget = target;
      updateQueue.isPending = true;

      var eventStore = target.eventStore;

      var listener = eventStore && eventStore[eventType];
      if (listener) {
          listener.call(target, syntheticEvent);
      }

      updateQueue.isPending = false;
      updateQueue.batchUpdate();
  }

  function createSyntheticEvent(nativeEvent) {
      var syntheticEvent = {};
      var cancelBubble = function cancelBubble() {
          return syntheticEvent.$cancelBubble = true;
      };
      syntheticEvent.nativeEvent = nativeEvent;
      syntheticEvent.persist = noop;
      for (var key in nativeEvent) {
          if (typeof nativeEvent[key] !== 'function') {
              syntheticEvent[key] = nativeEvent[key];
          } else if (key === 'stopPropagation' || key === 'stopImmediatePropagation') {
              syntheticEvent[key] = cancelBubble;
          } else {
              syntheticEvent[key] = nativeEvent[key].bind(nativeEvent);
          }
      }
      return syntheticEvent;
  }

  function setStyle(elemStyle, styles) {
      for (var styleName in styles) {
          if (styles.hasOwnProperty(styleName)) {
              setStyleValue(elemStyle, styleName, styles[styleName]);
          }
      }
  }

  function removeStyle(elemStyle, styles) {
      for (var styleName in styles) {
          if (styles.hasOwnProperty(styleName)) {
              elemStyle[styleName] = '';
          }
      }
  }

  function patchStyle(elemStyle, style, newStyle) {
      if (style === newStyle) {
          return;
      }
      if (!newStyle && style) {
          removeStyle(elemStyle, style);
          return;
      } else if (newStyle && !style) {
          setStyle(elemStyle, newStyle);
          return;
      }

      for (var key in style) {
          if (newStyle.hasOwnProperty(key)) {
              if (newStyle[key] !== style[key]) {
                  setStyleValue(elemStyle, key, newStyle[key]);
              }
          } else {
              elemStyle[key] = '';
          }
      }
      for (var key in newStyle) {
          if (!style.hasOwnProperty(key)) {
              setStyleValue(elemStyle, key, newStyle[key]);
          }
      }
  }

  /**
   * CSS properties which accept numbers but are not in units of "px".
   */
  var isUnitlessNumber = {
      animationIterationCount: 1,
      borderImageOutset: 1,
      borderImageSlice: 1,
      borderImageWidth: 1,
      boxFlex: 1,
      boxFlexGroup: 1,
      boxOrdinalGroup: 1,
      columnCount: 1,
      flex: 1,
      flexGrow: 1,
      flexPositive: 1,
      flexShrink: 1,
      flexNegative: 1,
      flexOrder: 1,
      gridRow: 1,
      gridColumn: 1,
      fontWeight: 1,
      lineClamp: 1,
      lineHeight: 1,
      opacity: 1,
      order: 1,
      orphans: 1,
      tabSize: 1,
      widows: 1,
      zIndex: 1,
      zoom: 1,

      // SVG-related properties
      fillOpacity: 1,
      floodOpacity: 1,
      stopOpacity: 1,
      strokeDasharray: 1,
      strokeDashoffset: 1,
      strokeMiterlimit: 1,
      strokeOpacity: 1,
      strokeWidth: 1
  };

  function prefixKey(prefix, key) {
      return prefix + key.charAt(0).toUpperCase() + key.substring(1);
  }

  var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

  Object.keys(isUnitlessNumber).forEach(function (prop) {
      prefixes.forEach(function (prefix) {
          isUnitlessNumber[prefixKey(prefix, prop)] = 1;
      });
  });

  var RE_NUMBER = /^-?\d+(\.\d+)?$/;
  function setStyleValue(elemStyle, styleName, styleValue) {

      if (!isUnitlessNumber[styleName] && RE_NUMBER.test(styleValue)) {
          elemStyle[styleName] = styleValue + 'px';
          return;
      }

      if (styleName === 'float') {
          styleName = 'cssFloat';
      }

      if (styleValue == null || typeof styleValue === 'boolean') {
          styleValue = '';
      }

      elemStyle[styleName] = styleValue;
  }

  var ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
  var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\uB7\\u0300-\\u036F\\u203F-\\u2040';

  var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');

  var isCustomAttribute = RegExp.prototype.test.bind(new RegExp('^(data|aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$'));
  // will merge some data in properties below
  var properties = {};

  /**
   * Mapping from normalized, camelcased property names to a configuration that
   * specifies how the associated DOM property should be accessed or rendered.
   */
  var MUST_USE_PROPERTY = 0x1;
  var HAS_BOOLEAN_VALUE = 0x4;
  var HAS_NUMERIC_VALUE = 0x8;
  var HAS_POSITIVE_NUMERIC_VALUE = 0x10 | 0x8;
  var HAS_OVERLOADED_BOOLEAN_VALUE = 0x20;

  // html config
  var HTMLDOMPropertyConfig = {
      props: {
          /**
           * Standard Properties
           */
          accept: 0,
          acceptCharset: 0,
          accessKey: 0,
          action: 0,
          allowFullScreen: HAS_BOOLEAN_VALUE,
          allowTransparency: 0,
          alt: 0,
          async: HAS_BOOLEAN_VALUE,
          autoComplete: 0,
          autoFocus: HAS_BOOLEAN_VALUE,
          autoPlay: HAS_BOOLEAN_VALUE,
          capture: HAS_BOOLEAN_VALUE,
          cellPadding: 0,
          cellSpacing: 0,
          charSet: 0,
          challenge: 0,
          checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          cite: 0,
          classID: 0,
          className: 0,
          cols: HAS_POSITIVE_NUMERIC_VALUE,
          colSpan: 0,
          content: 0,
          contentEditable: 0,
          contextMenu: 0,
          controls: HAS_BOOLEAN_VALUE,
          coords: 0,
          crossOrigin: 0,
          data: 0, // For `<object />` acts as `src`.
          dateTime: 0,
          'default': HAS_BOOLEAN_VALUE,
          // not in regular react, they did it in other way
          defaultValue: MUST_USE_PROPERTY,
          // not in regular react, they did it in other way
          defaultChecked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          defer: HAS_BOOLEAN_VALUE,
          dir: 0,
          disabled: HAS_BOOLEAN_VALUE,
          download: HAS_OVERLOADED_BOOLEAN_VALUE,
          draggable: 0,
          encType: 0,
          form: 0,
          formAction: 0,
          formEncType: 0,
          formMethod: 0,
          formNoValidate: HAS_BOOLEAN_VALUE,
          formTarget: 0,
          frameBorder: 0,
          headers: 0,
          height: 0,
          hidden: HAS_BOOLEAN_VALUE,
          high: 0,
          href: 0,
          hrefLang: 0,
          htmlFor: 0,
          httpEquiv: 0,
          icon: 0,
          id: 0,
          inputMode: 0,
          integrity: 0,
          is: 0,
          keyParams: 0,
          keyType: 0,
          kind: 0,
          label: 0,
          lang: 0,
          list: 0,
          loop: HAS_BOOLEAN_VALUE,
          low: 0,
          manifest: 0,
          marginHeight: 0,
          marginWidth: 0,
          max: 0,
          maxLength: 0,
          media: 0,
          mediaGroup: 0,
          method: 0,
          min: 0,
          minLength: 0,
          // Caution; `option.selected` is not updated if `select.multiple` is
          // disabled with `removeAttribute`.
          multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          name: 0,
          nonce: 0,
          noValidate: HAS_BOOLEAN_VALUE,
          open: HAS_BOOLEAN_VALUE,
          optimum: 0,
          pattern: 0,
          placeholder: 0,
          poster: 0,
          preload: 0,
          profile: 0,
          radioGroup: 0,
          readOnly: HAS_BOOLEAN_VALUE,
          referrerPolicy: 0,
          rel: 0,
          required: HAS_BOOLEAN_VALUE,
          reversed: HAS_BOOLEAN_VALUE,
          role: 0,
          rows: HAS_POSITIVE_NUMERIC_VALUE,
          rowSpan: HAS_NUMERIC_VALUE,
          sandbox: 0,
          scope: 0,
          scoped: HAS_BOOLEAN_VALUE,
          scrolling: 0,
          seamless: HAS_BOOLEAN_VALUE,
          selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          shape: 0,
          size: HAS_POSITIVE_NUMERIC_VALUE,
          sizes: 0,
          span: HAS_POSITIVE_NUMERIC_VALUE,
          spellCheck: 0,
          src: 0,
          srcDoc: 0,
          srcLang: 0,
          srcSet: 0,
          start: HAS_NUMERIC_VALUE,
          step: 0,
          style: 0,
          summary: 0,
          tabIndex: 0,
          target: 0,
          title: 0,
          // Setting .type throws on non-<input> tags
          type: 0,
          useMap: 0,
          value: MUST_USE_PROPERTY,
          width: 0,
          wmode: 0,
          wrap: 0,

          /**
           * RDFa Properties
           */
          about: 0,
          datatype: 0,
          inlist: 0,
          prefix: 0,
          // property is also supported for OpenGraph in meta tags.
          property: 0,
          resource: 0,
          'typeof': 0,
          vocab: 0,

          /**
           * Non-standard Properties
           */
          // autoCapitalize and autoCorrect are supported in Mobile Safari for
          // keyboard hints.
          autoCapitalize: 0,
          autoCorrect: 0,
          // autoSave allows WebKit/Blink to persist values of input fields on page reloads
          autoSave: 0,
          // color is for Safari mask-icon link
          color: 0,
          // itemProp, itemScope, itemType are for
          // Microdata support. See http://schema.org/docs/gs.html
          itemProp: 0,
          itemScope: HAS_BOOLEAN_VALUE,
          itemType: 0,
          // itemID and itemRef are for Microdata support as well but
          // only specified in the WHATWG spec document. See
          // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
          itemID: 0,
          itemRef: 0,
          // results show looking glass icon and recent searches on input
          // search fields in WebKit/Blink
          results: 0,
          // IE-only attribute that specifies security restrictions on an iframe
          // as an alternative to the sandbox attribute on IE<10
          security: 0,
          // IE-only attribute that controls focus behavior
          unselectable: 0
      },
      attrNS: {},
      domAttrs: {
          acceptCharset: 'accept-charset',
          className: 'class',
          htmlFor: 'for',
          httpEquiv: 'http-equiv'
      },
      domProps: {}
  };

  // svg config
  var xlink = 'http://www.w3.org/1999/xlink';
  var xml = 'http://www.w3.org/XML/1998/namespace';

  // We use attributes for everything SVG so let's avoid some duplication and run
  // code instead.
  // The following are all specified in the HTML config already so we exclude here.
  // - class (as className)
  // - color
  // - height
  // - id
  // - lang
  // - max
  // - media
  // - method
  // - min
  // - name
  // - style
  // - target
  // - type
  // - width
  var ATTRS = {
      accentHeight: 'accent-height',
      accumulate: 0,
      additive: 0,
      alignmentBaseline: 'alignment-baseline',
      allowReorder: 'allowReorder',
      alphabetic: 0,
      amplitude: 0,
      arabicForm: 'arabic-form',
      ascent: 0,
      attributeName: 'attributeName',
      attributeType: 'attributeType',
      autoReverse: 'autoReverse',
      azimuth: 0,
      baseFrequency: 'baseFrequency',
      baseProfile: 'baseProfile',
      baselineShift: 'baseline-shift',
      bbox: 0,
      begin: 0,
      bias: 0,
      by: 0,
      calcMode: 'calcMode',
      capHeight: 'cap-height',
      clip: 0,
      clipPath: 'clip-path',
      clipRule: 'clip-rule',
      clipPathUnits: 'clipPathUnits',
      colorInterpolation: 'color-interpolation',
      colorInterpolationFilters: 'color-interpolation-filters',
      colorProfile: 'color-profile',
      colorRendering: 'color-rendering',
      contentScriptType: 'contentScriptType',
      contentStyleType: 'contentStyleType',
      cursor: 0,
      cx: 0,
      cy: 0,
      d: 0,
      decelerate: 0,
      descent: 0,
      diffuseConstant: 'diffuseConstant',
      direction: 0,
      display: 0,
      divisor: 0,
      dominantBaseline: 'dominant-baseline',
      dur: 0,
      dx: 0,
      dy: 0,
      edgeMode: 'edgeMode',
      elevation: 0,
      enableBackground: 'enable-background',
      end: 0,
      exponent: 0,
      externalResourcesRequired: 'externalResourcesRequired',
      fill: 0,
      fillOpacity: 'fill-opacity',
      fillRule: 'fill-rule',
      filter: 0,
      filterRes: 'filterRes',
      filterUnits: 'filterUnits',
      floodColor: 'flood-color',
      floodOpacity: 'flood-opacity',
      focusable: 0,
      fontFamily: 'font-family',
      fontSize: 'font-size',
      fontSizeAdjust: 'font-size-adjust',
      fontStretch: 'font-stretch',
      fontStyle: 'font-style',
      fontVariant: 'font-variant',
      fontWeight: 'font-weight',
      format: 0,
      from: 0,
      fx: 0,
      fy: 0,
      g1: 0,
      g2: 0,
      glyphName: 'glyph-name',
      glyphOrientationHorizontal: 'glyph-orientation-horizontal',
      glyphOrientationVertical: 'glyph-orientation-vertical',
      glyphRef: 'glyphRef',
      gradientTransform: 'gradientTransform',
      gradientUnits: 'gradientUnits',
      hanging: 0,
      horizAdvX: 'horiz-adv-x',
      horizOriginX: 'horiz-origin-x',
      ideographic: 0,
      imageRendering: 'image-rendering',
      'in': 0,
      in2: 0,
      intercept: 0,
      k: 0,
      k1: 0,
      k2: 0,
      k3: 0,
      k4: 0,
      kernelMatrix: 'kernelMatrix',
      kernelUnitLength: 'kernelUnitLength',
      kerning: 0,
      keyPoints: 'keyPoints',
      keySplines: 'keySplines',
      keyTimes: 'keyTimes',
      lengthAdjust: 'lengthAdjust',
      letterSpacing: 'letter-spacing',
      lightingColor: 'lighting-color',
      limitingConeAngle: 'limitingConeAngle',
      local: 0,
      markerEnd: 'marker-end',
      markerMid: 'marker-mid',
      markerStart: 'marker-start',
      markerHeight: 'markerHeight',
      markerUnits: 'markerUnits',
      markerWidth: 'markerWidth',
      mask: 0,
      maskContentUnits: 'maskContentUnits',
      maskUnits: 'maskUnits',
      mathematical: 0,
      mode: 0,
      numOctaves: 'numOctaves',
      offset: 0,
      opacity: 0,
      operator: 0,
      order: 0,
      orient: 0,
      orientation: 0,
      origin: 0,
      overflow: 0,
      overlinePosition: 'overline-position',
      overlineThickness: 'overline-thickness',
      paintOrder: 'paint-order',
      panose1: 'panose-1',
      pathLength: 'pathLength',
      patternContentUnits: 'patternContentUnits',
      patternTransform: 'patternTransform',
      patternUnits: 'patternUnits',
      pointerEvents: 'pointer-events',
      points: 0,
      pointsAtX: 'pointsAtX',
      pointsAtY: 'pointsAtY',
      pointsAtZ: 'pointsAtZ',
      preserveAlpha: 'preserveAlpha',
      preserveAspectRatio: 'preserveAspectRatio',
      primitiveUnits: 'primitiveUnits',
      r: 0,
      radius: 0,
      refX: 'refX',
      refY: 'refY',
      renderingIntent: 'rendering-intent',
      repeatCount: 'repeatCount',
      repeatDur: 'repeatDur',
      requiredExtensions: 'requiredExtensions',
      requiredFeatures: 'requiredFeatures',
      restart: 0,
      result: 0,
      rotate: 0,
      rx: 0,
      ry: 0,
      scale: 0,
      seed: 0,
      shapeRendering: 'shape-rendering',
      slope: 0,
      spacing: 0,
      specularConstant: 'specularConstant',
      specularExponent: 'specularExponent',
      speed: 0,
      spreadMethod: 'spreadMethod',
      startOffset: 'startOffset',
      stdDeviation: 'stdDeviation',
      stemh: 0,
      stemv: 0,
      stitchTiles: 'stitchTiles',
      stopColor: 'stop-color',
      stopOpacity: 'stop-opacity',
      strikethroughPosition: 'strikethrough-position',
      strikethroughThickness: 'strikethrough-thickness',
      string: 0,
      stroke: 0,
      strokeDasharray: 'stroke-dasharray',
      strokeDashoffset: 'stroke-dashoffset',
      strokeLinecap: 'stroke-linecap',
      strokeLinejoin: 'stroke-linejoin',
      strokeMiterlimit: 'stroke-miterlimit',
      strokeOpacity: 'stroke-opacity',
      strokeWidth: 'stroke-width',
      surfaceScale: 'surfaceScale',
      systemLanguage: 'systemLanguage',
      tableValues: 'tableValues',
      targetX: 'targetX',
      targetY: 'targetY',
      textAnchor: 'text-anchor',
      textDecoration: 'text-decoration',
      textRendering: 'text-rendering',
      textLength: 'textLength',
      to: 0,
      transform: 0,
      u1: 0,
      u2: 0,
      underlinePosition: 'underline-position',
      underlineThickness: 'underline-thickness',
      unicode: 0,
      unicodeBidi: 'unicode-bidi',
      unicodeRange: 'unicode-range',
      unitsPerEm: 'units-per-em',
      vAlphabetic: 'v-alphabetic',
      vHanging: 'v-hanging',
      vIdeographic: 'v-ideographic',
      vMathematical: 'v-mathematical',
      values: 0,
      vectorEffect: 'vector-effect',
      version: 0,
      vertAdvY: 'vert-adv-y',
      vertOriginX: 'vert-origin-x',
      vertOriginY: 'vert-origin-y',
      viewBox: 'viewBox',
      viewTarget: 'viewTarget',
      visibility: 0,
      widths: 0,
      wordSpacing: 'word-spacing',
      writingMode: 'writing-mode',
      x: 0,
      xHeight: 'x-height',
      x1: 0,
      x2: 0,
      xChannelSelector: 'xChannelSelector',
      xlinkActuate: 'xlink:actuate',
      xlinkArcrole: 'xlink:arcrole',
      xlinkHref: 'xlink:href',
      xlinkRole: 'xlink:role',
      xlinkShow: 'xlink:show',
      xlinkTitle: 'xlink:title',
      xlinkType: 'xlink:type',
      xmlBase: 'xml:base',
      xmlns: 0,
      xmlnsXlink: 'xmlns:xlink',
      xmlLang: 'xml:lang',
      xmlSpace: 'xml:space',
      y: 0,
      y1: 0,
      y2: 0,
      yChannelSelector: 'yChannelSelector',
      z: 0,
      zoomAndPan: 'zoomAndPan'
  };

  var SVGDOMPropertyConfig = {
      props: {},
      attrNS: {
          xlinkActuate: xlink,
          xlinkArcrole: xlink,
          xlinkHref: xlink,
          xlinkRole: xlink,
          xlinkShow: xlink,
          xlinkTitle: xlink,
          xlinkType: xlink,
          xmlBase: xml,
          xmlLang: xml,
          xmlSpace: xml
      },
      domAttrs: {},
      domProps: {}
  };

  Object.keys(ATTRS).map(function (key) {
      SVGDOMPropertyConfig.props[key] = 0;
      if (ATTRS[key]) {
          SVGDOMPropertyConfig.domAttrs[key] = ATTRS[key];
      }
  });

  // merge html and svg config into properties
  mergeConfigToProperties(HTMLDOMPropertyConfig);
  mergeConfigToProperties(SVGDOMPropertyConfig);

  function mergeConfigToProperties(config) {
      var
      // all react/react-lite supporting property names in here
      props = config.props;
      var
      // attributes namespace in here
      attrNS = config.attrNS;
      var
      // propName in props which should use to be dom-attribute in here
      domAttrs = config.domAttrs;
      var
      // propName in props which should use to be dom-property in here
      domProps = config.domProps;

      for (var propName in props) {
          if (!props.hasOwnProperty(propName)) {
              continue;
          }
          var propConfig = props[propName];
          properties[propName] = {
              attributeName: domAttrs.hasOwnProperty(propName) ? domAttrs[propName] : propName.toLowerCase(),
              propertyName: domProps.hasOwnProperty(propName) ? domProps[propName] : propName,
              attributeNamespace: attrNS.hasOwnProperty(propName) ? attrNS[propName] : null,
              mustUseProperty: checkMask(propConfig, MUST_USE_PROPERTY),
              hasBooleanValue: checkMask(propConfig, HAS_BOOLEAN_VALUE),
              hasNumericValue: checkMask(propConfig, HAS_NUMERIC_VALUE),
              hasPositiveNumericValue: checkMask(propConfig, HAS_POSITIVE_NUMERIC_VALUE),
              hasOverloadedBooleanValue: checkMask(propConfig, HAS_OVERLOADED_BOOLEAN_VALUE)
          };
      }
  }

  function checkMask(value, bitmask) {
      return (value & bitmask) === bitmask;
  }

  /**
   * Sets the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   * @param {*} value
   */

  function setPropValue(node, name, value) {
      var propInfo = properties.hasOwnProperty(name) && properties[name];
      if (propInfo) {
          // should delete value from dom
          if (value == null || propInfo.hasBooleanValue && !value || propInfo.hasNumericValue && isNaN(value) || propInfo.hasPositiveNumericValue && value < 1 || propInfo.hasOverloadedBooleanValue && value === false) {
              removePropValue(node, name);
          } else if (propInfo.mustUseProperty) {
              var propName = propInfo.propertyName;
              // dom.value has side effect
              if (propName !== 'value' || '' + node[propName] !== '' + value) {
                  node[propName] = value;
              }
          } else {
              var attributeName = propInfo.attributeName;
              var namespace = propInfo.attributeNamespace;

              // `setAttribute` with objects becomes only `[object]` in IE8/9,
              // ('' + value) makes it output the correct toString()-value.
              if (namespace) {
                  node.setAttributeNS(namespace, attributeName, '' + value);
              } else if (propInfo.hasBooleanValue || propInfo.hasOverloadedBooleanValue && value === true) {
                  node.setAttribute(attributeName, '');
              } else {
                  node.setAttribute(attributeName, '' + value);
              }
          }
      } else if (isCustomAttribute(name) && VALID_ATTRIBUTE_NAME_REGEX.test(name)) {
          if (value == null) {
              node.removeAttribute(name);
          } else {
              node.setAttribute(name, '' + value);
          }
      }
  }

  /**
   * Deletes the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   */

  function removePropValue(node, name) {
      var propInfo = properties.hasOwnProperty(name) && properties[name];
      if (propInfo) {
          if (propInfo.mustUseProperty) {
              var propName = propInfo.propertyName;
              if (propInfo.hasBooleanValue) {
                  node[propName] = false;
              } else {
                  // dom.value accept string value has side effect
                  if (propName !== 'value' || '' + node[propName] !== '') {
                      node[propName] = '';
                  }
              }
          } else {
              node.removeAttribute(propInfo.attributeName);
          }
      } else if (isCustomAttribute(name)) {
          node.removeAttribute(name);
      }
  }

  function isFn(obj) {
      return typeof obj === 'function';
  }

  var isArr = Array.isArray;

  function noop() {}

  function identity(obj) {
      return obj;
  }

  function pipe(fn1, fn2) {
      return function () {
          fn1.apply(this, arguments);
          return fn2.apply(this, arguments);
      };
  }

  function addItem(list, item) {
      list[list.length] = item;
  }

  function flatEach(list, iteratee, a) {
      var len = list.length;
      var i = -1;

      while (len--) {
          var item = list[++i];
          if (isArr(item)) {
              flatEach(item, iteratee, a);
          } else {
              iteratee(item, a);
          }
      }
  }

  function extend(to, from) {
      if (!from) {
          return to;
      }
      var keys = Object.keys(from);
      var i = keys.length;
      while (i--) {
          to[keys[i]] = from[keys[i]];
      }
      return to;
  }

  var uid = 0;

  function getUid() {
      return ++uid;
  }

  var EVENT_KEYS = /^on/i;

  function setProp(elem, key, value, isCustomComponent) {
      if (EVENT_KEYS.test(key)) {
          addEvent(elem, key, value);
      } else if (key === 'style') {
          setStyle(elem.style, value);
      } else if (key === HTML_KEY) {
          if (value && value.__html != null) {
              elem.innerHTML = value.__html;
          }
      } else if (isCustomComponent) {
          if (value == null) {
              elem.removeAttribute(key);
          } else {
              elem.setAttribute(key, '' + value);
          }
      } else {
          setPropValue(elem, key, value);
      }
  }

  function removeProp(elem, key, oldValue, isCustomComponent) {
      if (EVENT_KEYS.test(key)) {
          removeEvent(elem, key);
      } else if (key === 'style') {
          removeStyle(elem.style, oldValue);
      } else if (key === HTML_KEY) {
          elem.innerHTML = '';
      } else if (isCustomComponent) {
          elem.removeAttribute(key);
      } else {
          removePropValue(elem, key);
      }
  }

  function patchProp(elem, key, value, oldValue, isCustomComponent) {
      if (key === 'value' || key === 'checked') {
          oldValue = elem[key];
      }
      if (value === oldValue) {
          return;
      }
      if (value === undefined) {
          removeProp(elem, key, oldValue, isCustomComponent);
          return;
      }
      if (key === 'style') {
          patchStyle(elem.style, oldValue, value);
      } else {
          setProp(elem, key, value, isCustomComponent);
      }
  }

  function setProps(elem, props, isCustomComponent) {
      for (var key in props) {
          if (key !== 'children') {
              setProp(elem, key, props[key], isCustomComponent);
          }
      }
  }

  function patchProps(elem, props, newProps, isCustomComponent) {
      for (var key in props) {
          if (key !== 'children') {
              if (newProps.hasOwnProperty(key)) {
                  patchProp(elem, key, newProps[key], props[key], isCustomComponent);
              } else {
                  removeProp(elem, key, props[key], isCustomComponent);
              }
          }
      }
      for (var key in newProps) {
          if (key !== 'children' && !props.hasOwnProperty(key)) {
              setProp(elem, key, newProps[key], isCustomComponent);
          }
      }
  }

  if (!Object.freeze) {
      Object.freeze = identity;
  }

  function isValidContainer(node) {
  	return !!(node && (node.nodeType === ELEMENT_NODE_TYPE || node.nodeType === DOC_NODE_TYPE || node.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE));
  }

  var pendingRendering = {};
  var vnodeStore = {};
  function renderTreeIntoContainer(vnode, container, callback, parentContext) {
  	if (!vnode.vtype) {
  		throw new Error('cannot render ' + vnode + ' to container');
  	}
  	if (!isValidContainer(container)) {
  		throw new Error('container ' + container + ' is not a DOM element');
  	}
  	var id = container[COMPONENT_ID] || (container[COMPONENT_ID] = getUid());
  	var argsCache = pendingRendering[id];

  	// component lify cycle method maybe call root rendering
  	// should bundle them and render by only one time
  	if (argsCache) {
  		if (argsCache === true) {
  			pendingRendering[id] = argsCache = { vnode: vnode, callback: callback, parentContext: parentContext };
  		} else {
  			argsCache.vnode = vnode;
  			argsCache.parentContext = parentContext;
  			argsCache.callback = argsCache.callback ? pipe(argsCache.callback, callback) : callback;
  		}
  		return;
  	}

  	pendingRendering[id] = true;
  	var oldVnode = null;
  	var rootNode = null;
  	if (oldVnode = vnodeStore[id]) {
  		rootNode = compareTwoVnodes(oldVnode, vnode, container.firstChild, parentContext);
  	} else {
  		rootNode = initVnode(vnode, parentContext, container.namespaceURI);
  		var childNode = null;
  		while (childNode = container.lastChild) {
  			container.removeChild(childNode);
  		}
  		container.appendChild(rootNode);
  	}
  	vnodeStore[id] = vnode;
  	var isPending = updateQueue.isPending;
  	updateQueue.isPending = true;
  	clearPending();
  	argsCache = pendingRendering[id];
  	delete pendingRendering[id];

  	var result = null;
  	if (typeof argsCache === 'object') {
  		result = renderTreeIntoContainer(argsCache.vnode, container, argsCache.callback, argsCache.parentContext);
  	} else if (vnode.vtype === VELEMENT) {
  		result = rootNode;
  	} else if (vnode.vtype === VCOMPONENT) {
  		result = rootNode.cache[vnode.uid];
  	}

  	if (!isPending) {
  		updateQueue.isPending = false;
  		updateQueue.batchUpdate();
  	}

  	if (callback) {
  		callback.call(result);
  	}

  	return result;
  }

  function render(vnode, container, callback) {
  	return renderTreeIntoContainer(vnode, container, callback);
  }

  function unstable_renderSubtreeIntoContainer(parentComponent, subVnode, container, callback) {
  	var context = parentComponent.$cache.parentContext;
  	return renderTreeIntoContainer(subVnode, container, callback, context);
  }

  function unmountComponentAtNode(container) {
  	if (!container.nodeName) {
  		throw new Error('expect node');
  	}
  	var id = container[COMPONENT_ID];
  	var vnode = null;
  	if (vnode = vnodeStore[id]) {
  		destroyVnode(vnode, container.firstChild);
  		container.removeChild(container.firstChild);
  		delete vnodeStore[id];
  		return true;
  	}
  	return false;
  }

  function findDOMNode(node) {
  	if (node == null) {
  		return null;
  	}
  	if (node.nodeName) {
  		return node;
  	}
  	var component = node;
  	// if component.node equal to false, component must be unmounted
  	if (component.getDOMNode && component.$cache.isMounted) {
  		return component.getDOMNode();
  	}
  	throw new Error('findDOMNode can not find Node');
  }

  var ReactDOM = Object.freeze({
  	render: render,
  	unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
  	unmountComponentAtNode: unmountComponentAtNode,
  	findDOMNode: findDOMNode
  });

  function createElement(type, props, children) {
  	var vtype = null;
  	if (typeof type === 'string') {
  		vtype = VELEMENT;
  	} else if (typeof type === 'function') {
  		if (type.prototype && type.prototype.isReactComponent) {
  			vtype = VCOMPONENT;
  		} else {
  			vtype = VSTATELESS;
  		}
  	} else {
  		throw new Error('React.createElement: unexpect type [ ' + type + ' ]');
  	}

  	var key = null;
  	var ref = null;
  	var finalProps = {};
  	if (props != null) {
  		for (var propKey in props) {
  			if (!props.hasOwnProperty(propKey)) {
  				continue;
  			}
  			if (propKey === 'key') {
  				if (props.key !== undefined) {
  					key = '' + props.key;
  				}
  			} else if (propKey === 'ref') {
  				if (props.ref !== undefined) {
  					ref = props.ref;
  				}
  			} else {
  				finalProps[propKey] = props[propKey];
  			}
  		}
  	}

  	var defaultProps = type.defaultProps;

  	if (defaultProps) {
  		for (var propKey in defaultProps) {
  			if (finalProps[propKey] === undefined) {
  				finalProps[propKey] = defaultProps[propKey];
  			}
  		}
  	}

  	var argsLen = arguments.length;
  	var finalChildren = children;

  	if (argsLen > 3) {
  		finalChildren = Array(argsLen - 2);
  		for (var i = 2; i < argsLen; i++) {
  			finalChildren[i - 2] = arguments[i];
  		}
  	}

  	if (finalChildren !== undefined) {
  		finalProps.children = finalChildren;
  	}

  	return createVnode(vtype, type, finalProps, key, ref);
  }

  function isValidElement(obj) {
  	return obj != null && !!obj.vtype;
  }

  function cloneElement(originElem, props) {
  	var type = originElem.type;
  	var key = originElem.key;
  	var ref = originElem.ref;

  	var newProps = extend(extend({ key: key, ref: ref }, originElem.props), props);

  	for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
  		children[_key - 2] = arguments[_key];
  	}

  	var vnode = createElement.apply(undefined, [type, newProps].concat(children));
  	if (vnode.ref === originElem.ref) {
  		vnode.refs = originElem.refs;
  	}
  	return vnode;
  }

  function createFactory(type) {
  	var factory = function factory() {
  		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
  			args[_key2] = arguments[_key2];
  		}

  		return createElement.apply(undefined, [type].concat(args));
  	};
  	factory.type = type;
  	return factory;
  }

  var tagNames = 'a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr|circle|clipPath|defs|ellipse|g|image|line|linearGradient|mask|path|pattern|polygon|polyline|radialGradient|rect|stop|svg|text|tspan';
  var DOM = {};
  tagNames.split('|').forEach(function (tagName) {
  	DOM[tagName] = createFactory(tagName);
  });

  var check = function check() {
      return check;
  };
  check.isRequired = check;
  var PropTypes = {
      "array": check,
      "bool": check,
      "func": check,
      "number": check,
      "object": check,
      "string": check,
      "any": check,
      "arrayOf": check,
      "element": check,
      "instanceOf": check,
      "node": check,
      "objectOf": check,
      "oneOf": check,
      "oneOfType": check,
      "shape": check
  };

  function only(children) {
  	if (isValidElement(children)) {
  		return children;
  	}
  	throw new Error('expect only one child');
  }

  function forEach(children, iteratee, context) {
  	if (children == null) {
  		return children;
  	}
  	var index = 0;
  	if (isArr(children)) {
  		flatEach(children, function (child) {
  			iteratee.call(context, child, index++);
  		});
  	} else {
  		iteratee.call(context, children, index);
  	}
  }

  function map(children, iteratee, context) {
  	if (children == null) {
  		return children;
  	}
  	var store = [];
  	var keyMap = {};
  	forEach(children, function (child, index) {
  		var data = {};
  		data.child = iteratee.call(context, child, index) || child;
  		data.isEqual = data.child === child;
  		var key = data.key = getKey(child, index);
  		if (keyMap.hasOwnProperty(key)) {
  			keyMap[key] += 1;
  		} else {
  			keyMap[key] = 0;
  		}
  		data.index = keyMap[key];
  		addItem(store, data);
  	});
  	var result = [];
  	store.forEach(function (_ref) {
  		var child = _ref.child;
  		var key = _ref.key;
  		var index = _ref.index;
  		var isEqual = _ref.isEqual;

  		if (child == null || typeof child === 'boolean') {
  			return;
  		}
  		if (!isValidElement(child) || key == null) {
  			addItem(result, child);
  			return;
  		}
  		if (keyMap[key] !== 0) {
  			key += ':' + index;
  		}
  		if (!isEqual) {
  			key = escapeUserProvidedKey(child.key || '') + '/' + key;
  		}
  		child = cloneElement(child, { key: key });
  		addItem(result, child);
  	});
  	return result;
  }

  function count(children) {
  	var count = 0;
  	forEach(children, function () {
  		count++;
  	});
  	return count;
  }

  function toArray(children) {
  	return map(children, identity) || [];
  }

  function getKey(child, index) {
  	var key = undefined;
  	if (isValidElement(child) && typeof child.key === 'string') {
  		key = '.$' + child.key;
  	} else {
  		key = '.' + index.toString(36);
  	}
  	return key;
  }

  var userProvidedKeyEscapeRegex = /\/(?!\/)/g;
  function escapeUserProvidedKey(text) {
  	return ('' + text).replace(userProvidedKeyEscapeRegex, '//');
  }

  var Children = Object.freeze({
  	only: only,
  	forEach: forEach,
  	map: map,
  	count: count,
  	toArray: toArray
  });

  function eachMixin(mixins, iteratee) {
  	mixins.forEach(function (mixin) {
  		if (mixin) {
  			if (isArr(mixin.mixins)) {
  				eachMixin(mixin.mixins, iteratee);
  			}
  			iteratee(mixin);
  		}
  	});
  }

  function combineMixinToProto(proto, mixin) {
  	for (var key in mixin) {
  		if (!mixin.hasOwnProperty(key)) {
  			continue;
  		}
  		var value = mixin[key];
  		if (key === 'getInitialState') {
  			addItem(proto.$getInitialStates, value);
  			continue;
  		}
  		var curValue = proto[key];
  		if (isFn(curValue) && isFn(value)) {
  			proto[key] = pipe(curValue, value);
  		} else {
  			proto[key] = value;
  		}
  	}
  }

  function combineMixinToClass(Component, mixin) {
  	if (mixin.propTypes) {
  		Component.propTypes = Component.propTypes || {};
  		extend(Component.propTypes, mixin.propTypes);
  	}
  	if (mixin.contextTypes) {
  		Component.contextTypes = Component.contextTypes || {};
  		extend(Component.contextTypes, mixin.contextTypes);
  	}
  	extend(Component, mixin.statics);
  	if (isFn(mixin.getDefaultProps)) {
  		Component.defaultProps = Component.defaultProps || {};
  		extend(Component.defaultProps, mixin.getDefaultProps());
  	}
  }

  function bindContext(obj, source) {
  	for (var key in source) {
  		if (source.hasOwnProperty(key)) {
  			if (isFn(source[key])) {
  				obj[key] = source[key].bind(obj);
  			}
  		}
  	}
  }

  var Facade = function Facade() {};
  Facade.prototype = Component.prototype;

  function getInitialState() {
  	var _this = this;

  	var state = {};
  	var setState = this.setState;
  	this.setState = Facade;
  	this.$getInitialStates.forEach(function (getInitialState) {
  		if (isFn(getInitialState)) {
  			extend(state, getInitialState.call(_this));
  		}
  	});
  	this.setState = setState;
  	return state;
  }
  function createClass(spec) {
  	if (!isFn(spec.render)) {
  		throw new Error('createClass: spec.render is not function');
  	}
  	var specMixins = spec.mixins || [];
  	var mixins = specMixins.concat(spec);
  	spec.mixins = null;
  	function Klass(props, context) {
  		Component.call(this, props, context);
  		this.constructor = Klass;
  		spec.autobind !== false && bindContext(this, Klass.prototype);
  		this.state = this.getInitialState() || this.state;
  	}
  	Klass.displayName = spec.displayName;
  	var proto = Klass.prototype = new Facade();
  	proto.$getInitialStates = [];
  	eachMixin(mixins, function (mixin) {
  		combineMixinToProto(proto, mixin);
  		combineMixinToClass(Klass, mixin);
  	});
  	proto.getInitialState = getInitialState;
  	spec.mixins = specMixins;
  	return Klass;
  }

  function shallowEqual(objA, objB) {
      if (objA === objB) {
          return true;
      }

      if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
          return false;
      }

      var keysA = Object.keys(objA);
      var keysB = Object.keys(objB);

      if (keysA.length !== keysB.length) {
          return false;
      }

      // Test for A's keys different from B.
      for (var i = 0; i < keysA.length; i++) {
          if (!objB.hasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
              return false;
          }
      }

      return true;
  }

  function PureComponent(props, context) {
  	Component.call(this, props, context);
  }

  PureComponent.prototype = Object.create(Component.prototype);
  PureComponent.prototype.constructor = PureComponent;
  PureComponent.prototype.isPureReactComponent = true;
  PureComponent.prototype.shouldComponentUpdate = shallowCompare;

  function shallowCompare(nextProps, nextState) {
  	return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
  }

  var React = extend({
      version: '0.15.1',
      cloneElement: cloneElement,
      isValidElement: isValidElement,
      createElement: createElement,
      createFactory: createFactory,
      Component: Component,
      PureComponent: PureComponent,
      createClass: createClass,
      Children: Children,
      PropTypes: PropTypes,
      DOM: DOM
  }, ReactDOM);

  React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactDOM;

  return React;

}));

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(49);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(48);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(60);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(11)
  , document = __webpack_require__(1).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(2) && !__webpack_require__(10)(function(){
  return Object.defineProperty(__webpack_require__(32)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(18)
  , $export        = __webpack_require__(6)
  , redefine       = __webpack_require__(40)
  , hide           = __webpack_require__(7)
  , has            = __webpack_require__(3)
  , Iterators      = __webpack_require__(17)
  , $iterCreate    = __webpack_require__(67)
  , setToStringTag = __webpack_require__(21)
  , getPrototypeOf = __webpack_require__(38)
  , ITERATOR       = __webpack_require__(8)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(20)
  , createDesc     = __webpack_require__(13)
  , toIObject      = __webpack_require__(5)
  , toPrimitive    = __webpack_require__(25)
  , has            = __webpack_require__(3)
  , IE8_DOM_DEFINE = __webpack_require__(33)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(2) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(39)
  , hiddenKeys = __webpack_require__(16).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(3)
  , toObject    = __webpack_require__(41)
  , IE_PROTO    = __webpack_require__(22)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(3)
  , toIObject    = __webpack_require__(5)
  , arrayIndexOf = __webpack_require__(62)(false)
  , IE_PROTO     = __webpack_require__(22)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(15);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopBanner = undefined;

var _topBanner = __webpack_require__(43);

var _topBanner2 = _interopRequireDefault(_topBanner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.TopBanner = _topBanner2.default;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TopBanner = undefined;

var _getPrototypeOf = __webpack_require__(46);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(50);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(51);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(53);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(52);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(28);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(89);

var TopBanner = exports.TopBanner = function (_Component) {
    (0, _inherits3.default)(TopBanner, _Component);

    function TopBanner(props) {
        (0, _classCallCheck3.default)(this, TopBanner);
        return (0, _possibleConstructorReturn3.default)(this, (TopBanner.__proto__ || (0, _getPrototypeOf2.default)(TopBanner)).call(this, props));
    }

    (0, _createClass3.default)(TopBanner, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'top-banner' },
                'TopBanner'
            );
        }
    }]);
    return TopBanner;
}(_react.Component);

;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(54), __esModule: true };

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(55), __esModule: true };

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(56), __esModule: true };

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(57), __esModule: true };

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(58), __esModule: true };

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(59), __esModule: true };

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(45);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(47);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(44);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(29);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(29);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(79);
var $Object = __webpack_require__(0).Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(80);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(81);
module.exports = __webpack_require__(0).Object.getPrototypeOf;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(82);
module.exports = __webpack_require__(0).Object.setPrototypeOf;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(83);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(0).Symbol;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(84);
__webpack_require__(88);
module.exports = __webpack_require__(27).f('iterator');

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(5)
  , toLength  = __webpack_require__(77)
  , toIndex   = __webpack_require__(76);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(12)
  , gOPS    = __webpack_require__(37)
  , pIE     = __webpack_require__(20);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1).document && document.documentElement;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(30);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(30);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(19)
  , descriptor     = __webpack_require__(13)
  , setToStringTag = __webpack_require__(21)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(7)(IteratorPrototype, __webpack_require__(8)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(12)
  , toIObject = __webpack_require__(5);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(14)('meta')
  , isObject = __webpack_require__(11)
  , has      = __webpack_require__(3)
  , setDesc  = __webpack_require__(4).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(10)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(4)
  , anObject = __webpack_require__(9)
  , getKeys  = __webpack_require__(12);

module.exports = __webpack_require__(2) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(5)
  , gOPN      = __webpack_require__(36).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(6)
  , core    = __webpack_require__(0)
  , fails   = __webpack_require__(10);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(11)
  , anObject = __webpack_require__(9);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(31)(Function.call, __webpack_require__(35).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(24)
  , defined   = __webpack_require__(15);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(24)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(24)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(61)
  , step             = __webpack_require__(68)
  , Iterators        = __webpack_require__(17)
  , toIObject        = __webpack_require__(5);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(34)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(6)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(19)});

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(6);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(2), 'Object', {defineProperty: __webpack_require__(4).f});

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(41)
  , $getPrototypeOf = __webpack_require__(38);

__webpack_require__(73)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(6);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(74).set});

/***/ }),
/* 83 */
/***/ (function(module, exports) {



/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(75)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(34)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(1)
  , has            = __webpack_require__(3)
  , DESCRIPTORS    = __webpack_require__(2)
  , $export        = __webpack_require__(6)
  , redefine       = __webpack_require__(40)
  , META           = __webpack_require__(70).KEY
  , $fails         = __webpack_require__(10)
  , shared         = __webpack_require__(23)
  , setToStringTag = __webpack_require__(21)
  , uid            = __webpack_require__(14)
  , wks            = __webpack_require__(8)
  , wksExt         = __webpack_require__(27)
  , wksDefine      = __webpack_require__(26)
  , keyOf          = __webpack_require__(69)
  , enumKeys       = __webpack_require__(63)
  , isArray        = __webpack_require__(66)
  , anObject       = __webpack_require__(9)
  , toIObject      = __webpack_require__(5)
  , toPrimitive    = __webpack_require__(25)
  , createDesc     = __webpack_require__(13)
  , _create        = __webpack_require__(19)
  , gOPNExt        = __webpack_require__(72)
  , $GOPD          = __webpack_require__(35)
  , $DP            = __webpack_require__(4)
  , $keys          = __webpack_require__(12)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(36).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(20).f  = $propertyIsEnumerable;
  __webpack_require__(37).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(18)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(7)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26)('asyncIterator');

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26)('observable');

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(78);
var global        = __webpack_require__(1)
  , hide          = __webpack_require__(7)
  , Iterators     = __webpack_require__(17)
  , TO_STRING_TAG = __webpack_require__(8)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 89 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(28);

var _react2 = _interopRequireDefault(_react);

var _index = __webpack_require__(42);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_index2.default);

/***/ })
/******/ ]);