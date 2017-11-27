function json(value, successHandler, errorHandler) {
  var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

  xhr.open('get', value, true);
  xhr.onreadystatechange = function() {
    var status;
    var data;
    // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
    if (xhr.readyState == 4) {
      // `DONE`
      status = xhr.status;
      if (status == 200) {
        data = JSON.parse(xhr.responseText);
        successHandler && successHandler(data);
      } else {
        errorHandler && errorHandler(status);
      }
    }
  };
  xhr.send();
}

function transform(callback) {
  json('./from.json', function(data) {
    data = JSON.parse(data);
    var schema = {};
    schema.data = {};

    for (var propName in data) {
      schema.data[propName] = data[propName];

      if (propName === 'properties') {
        schema.data[propName] = [];

        for (var subPropName in data[propName]) {
          var subSchema = {};

          subSchema.name = subPropName;

          for (var subSubPropName in data[propName][subPropName]) {
            subSchema[subSubPropName] = data[propName][subPropName][subSubPropName];

            if (subSubPropName === 'properties') {
              subSchema[subSubPropName] = [];

              for (var subSubSubPropName in data[propName][subPropName][subSubPropName]) {
                var obj = {};

                subSchema.name = subSubSubPropName;

                for (var subSubSubSubPropName in data[propName][subPropName][subSubPropName][subSubSubPropName]) {
                  obj[subSubSubSubPropName] = data[propName][subPropName][subSubPropName][subSubSubPropName][subSubSubSubPropName];
                }

                subSchema[subSubPropName].push(obj);
              }
            }
          }

          schema.data[propName].push(subSchema);
        }
      }
    }

    callback(data);
  });
}
