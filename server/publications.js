if (Meteor.isServer) {
  Meteor.publish("summoners", function () {
    return Summoners.find();
  });

  Meteor.publish("rankedStats", function () {
    return RankedStats.find();
  });
}
