Template.summonerItem.helpers({
  getSummoner: function () {
    return Summoners.findOne({name: Session.get('currentSummoner')});
  },
  getRankedStats: function(id, region, season){
    console.log(Meteor.call("getRankedStatsBySummonerId", id, region, season));
  }
});
