Meteor.methods({
    getSummonerByName: function(name, region){

      var sumonner = Summoners.findOne({name: name});

        if(sumonner == undefined){
            HTTP.call("GET", "https://na.api.pvp.net/api/lol/"+region+"/v1.4/summoner/by-name/"+name+"?api_key="+Meteor.settings.riotAPIkey,
                  function (error, result) {

                    if (!error) {

                        var noSpaceName = name.replace(/\s/g, '').toLowerCase();
                        var summonerObj = {
                            pID: result.data[noSpaceName].id,
                            name: result.data[noSpaceName].name.trim(),
                            profileIconId: result.data[noSpaceName].profileIconId,
                            summonerLevel: result.data[noSpaceName].summonerLevel
                        };

                        return Summoners.insert(summonerObj);
                    }

                }
            );
        }else{
          return sumonner;
        }
    },
    getMatchListBySummonerId: function(id, region){

      // var sumonner = Summoners.findOne({pID: id});

    },
    getRankedStatsBySummonerId: function(id, region, season){
      console.log("called getRankedStatsBySummonerId for id:", id, " in region ", region, " on season ", season);
      // var returnedData = null;
      HTTP.call("GET", "https://na.api.pvp.net/api/lol/"+region+"/v1.3/stats/by-summoner/"+id+"/ranked?season="+season+"&api_key="+Meteor.settings.riotAPIkey, function (error, result) {
        if (!error) {
          var ranked = RankedStats.findOne({pID: id});

          if(ranked) {
            if(ranked.modifyDate != result.data.modifyDate){

              var rankedStatsObj = {
                  pID: result.data.summonerId,
                  modifyDate: result.data.modifyDate,
                  champions: result.data.champions
              };

              return RankedStats.insert(rankedStatsObj);
            }else{
              return ranked;
            }
          }
        }
      });

    }
});
