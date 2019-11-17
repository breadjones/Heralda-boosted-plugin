var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./booster.db');

class Booster {
  init(config) {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS boosted (id TEXT PRIMARY KEY, username TEXT NOT NULL, boosted_meter INTEGER NOT NULL)");
    });
  }

  list(callback, guild) {
    db.serialize(() => {
      var messages = [];
      var memberMap = [];

      if (guild && guild.members) {
        memberMap = guild.members;
      }

      db.each("SELECT id, username, boosted_meter FROM boosted ORDER BY boosted_meter DESC", (err, row) => {
        var displayName = row.username;

        if (guild.memberCount >= 1) {
          guild.members.forEach(guildMember => {
            if (guildMember.id === row.id && guildMember.nickname) {
              displayName = guildMember.nickname;
            }
          });
        }

        console.log(this);

        messages.push(displayName + ": " + this._getBoostedRanking(row.boosted_meter));
      }, () => {
          let message = messages.join('\n');
          if (callback) {
            callback(message);
          }
      });
    });
  }

  boost(boostee, callback, boostBy = 1) {
    db.serialize(function() {
      db.get("SELECT id, username, boosted_meter FROM boosted WHERE id = ?", [boostee.id], (err, row) => {
        db.serialize(function() {
          var boostedScore = boostBy;
          if (!row) {
            db.run("INSERT INTO boosted VALUES (?, ?, ?)", [boostee.id, boostee.username, 1]);
          }
          else {
            boostedScore = row.boosted_meter + boostBy;
          }

          db.run("UPDATE boosted SET boosted_meter = ? WHERE id = ?", [boostedScore, boostee.id]);
          
          if (callback) {
            callback(boostedScore);
          }
        });
      });
    });
  }

  _getBoostedRanking(boostedValue) {
    var message = boostedValue % 100 + "%";

    if (boostedValue >= 100) {
      for (var x = boostedValue; x >= 100; x -= 100) {
        message += " :star:";
      }
    }

    return message;
  }
}

module.exports = Booster;
