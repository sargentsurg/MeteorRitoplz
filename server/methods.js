Meteor.methods({
  getSummonerByName: function(name, region) {

    var sumonner = Summoners.findOne({
      name: name
    });

    if (sumonner == undefined) {
      HTTP.call("GET", "https://na.api.pvp.net/api/lol/" + region + "/v1.4/summoner/by-name/" + name + "?api_key=" + Meteor.settings.riotAPIkey,
        function(error, result) {

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
    } else {
      return sumonner;
    }
  },
  getMatchListBySummonerId: function(id, region) {

    // var sumonner = Summoners.findOne({pID: id});

  },
  getRankedStatsBySummonerId: function(id, region, season) {
    // console.log("called getRankedStatsBySummonerId for id:", id, " in region ", region, " on season ", season);
    check(id, Number)
    var ranked = RankedStats.findOne({
        pID: id
      }),
      readyForUpdate = true;

    if (ranked != undefined && ranked.lastPull + 600 > Math.round(new Date().getTime() / 1000.0)) {
      readyForUpdate = false;
      console.log("failed because last time was ", ranked.lastPull + 1000 , " and current time is", Math.round(new Date().getTime() / 1000.0));
    }else{
      console.log("passed!", ranked.lastPull - Math.round(new Date().getTime() / 1000.0));
    }

    if (readyForUpdate) {
      HTTP.call("GET", "https://na.api.pvp.net/api/lol/" + region + "/v1.3/stats/by-summoner/" + id + "/ranked?season=" + season + "&api_key=" + Meteor.settings.riotAPIkey, function(error, result) {
        if (!error) {

          var rankedStatsObj = {
            pID: result.data.summonerId,
            modifyDate: result.data.modifyDate,
            champions: result.data.champions,
            lastPull: Math.round(new Date().getTime() / 1000.0)
          };

          if (ranked == undefined) {
            return RankedStats.insert(rankedStatsObj);
          } else {

            if (ranked.modifyDate != result.data.modifyDate) {
              return RankedStats.update(rankedStatsObj);
            }

            return ranked;
          }
        } else {
          console.log(error);
        }
      });
    }
  }
});
