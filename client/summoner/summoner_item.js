Template.summonerItem.helpers({
  getSummoner: function () {
    return Summoners.findOne({name: Session.get('currentSummoner')});
  },
  getRankedStats: function(id, region, season){

    // return Meteor.call("getRankedStatsBySummonerId", id, region, season, function(error, result){
    //   if(!error){
    //      console.log(result);
    //   }
    // });

    var ranked = RankedStats.findOne({pID: id});

    HTTP.call("GET", "https://na.api.pvp.net/api/lol/"+region+"/v1.3/stats/by-summoner/"+id+"/ranked?season="+season+"&api_key=596d652c-5e7a-4b74-ba8a-ba4722447da1", function (error, result) {
      if (!error) {

        var rankedStatsObj = {
            pID: result.data.summonerId,
            modifyDate: result.data.modifyDate,
            champions: result.data.champions
        };

        if(ranked == undefined) {
            return RankedStats.insert(rankedStatsObj);
          }else{

            if(ranked.modifyDate != result.data.modifyDate){
               return RankedStats.update(rankedStatsObj);
            }

            return ranked;
          }
      }
    });

  }
});
