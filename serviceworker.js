self.addEventListener("install", function (event) {
    event.waitUntil(preLoad());
  });
 
  self.addEventListener("fetch", function (event) {
    event.respondWith(
      checkResponse(event.request).catch(function () {
        console.log("Fetch from cache successful!");
        return returnFromCache(event.request);
      })
    );
    console.log("Fetch successful!");
    event.waitUntil(addToCache(event.request));
  });
  self.addEventListener("sync", (event) => {
    if (event.tag === "syncMessage") {
      console.log("Sync successful!");
    }
  });
 
  self.addEventListener("push", function (event) {
    if (event && event.data) {
      var data = event.data.json();
      if (data.method == "pushMessage") {
        console.log("Push notification sent");
        event.waitUntil(
          self.registration.showNotification("Candles and Gifts | Buy Handmade Candles and Unique Gifts Online ", {
            body: data.message,
            icon: "./icons/icon96.png",
          })
        );
      }
    }
  });




  var filesToCache = ["/index.html"];
 
  var preLoad = async function () {
    const cache = await caches.open("offline");
    return await cache.addAll(filesToCache);
  };
 
  var checkResponse = function (request) {
    return new Promise(function (fulfill, reject) {
      fetch(request).then(function (response) {
        if (response.status !== 404) {
          fulfill(response);
        } else {
          reject();
        }
      }, reject);
    });
  };
 
  var addToCache = async function (request) {
    const cache = await caches.open("offline");
    const response = await fetch(request);
    return await cache.put(request, response);
  };
 
  var returnFromCache = async function (request) {
    const cache = await caches.open("offline");
    const matching = await cache.match(request);
    if (!matching || matching.status == 404) {
      return cache.match("offline.html");
    } else {
      return matching;
    }
  };
