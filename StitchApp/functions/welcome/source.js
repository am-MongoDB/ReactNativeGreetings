exports = function(){
  var collection = context.services.get("mongodb-atlas").db("greetings").collection("names");
  return collection.findOne({owner_id: context.user.id}).then(doc => {
    return("Hi, " + doc.name + " welcome to this awseome app!");
  });
};