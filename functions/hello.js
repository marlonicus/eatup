exports.handler = function(event, context, callback) {
  if(event.httpMethod !== 'POST' || !event.body) {

    callback(null, {
    statusCode: 200,
    body: "Hello, World"
    });
  }
}