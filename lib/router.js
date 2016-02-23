Router.configure({
  waitOn: function() { return Meteor.subscribe('summoners') && Meteor.subscribe('rankedStats'); }
});

Router.route('/', function () {
  this.layout('homeLayout');
  this.render('summoner_list');
});

Router.route('/summoner/:_id', {
  layoutTemplate: 'homeLayout',
  name: 'summoner_item',
  data: function() { return Summoners.findOne(this.params._id); }
});
