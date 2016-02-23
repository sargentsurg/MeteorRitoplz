Template.summonerList.helpers({
  summoner: function() {
    return Summoners.find({}, {
      sort: {
        submitted: -1
      }
    });
  }
});

Template.summonerList.events({
  'keypress input': function (evt, template) {
    if (evt.which === 13) {
      Meteor.call('getSummonerByName', template.find("input").value.trim(), 'na', function(error, result){});
      Session.set('currentSummoner', template.find("input").value.trim());
      return false;
    }
  }
});
