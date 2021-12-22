const fetch = require('node-fetch');

const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS]
});

const fs = require('fs');
const alpha_collection = "Axveez";
const eden_collection = "Axveez";
const ch_alpha = ''; //ChannelID Discord for Alpha Alert
const ch_eden = ''; //ChannelID Discord for Eden Alert
const discord_token = '' //Discord BOT Token

const fetchalpha = () => {
    return new Promise((resolve) => {
        fetch(`https://apis.alpha.art/api/v1/collection`,
          {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              method: "POST",
              body: `{"collectionId":"${alpha_collection}","orderBy":"RECENTLY_LISTED","status":["BUY_NOW"],"traits":[]}`
          }
          ).then((res) => {
            res.json().then((data) => {
                resolve(data);
            }).catch(() => resolve([]));
        }).catch(() => resolve([]));
    });
};


const listingalpha = async(data) => {
  await fs.readFile('alpha.txt', 'utf8', async (err, datar) => {
      if (err) throw err;
      await new Promise(async(resolve, reject) => {
        var c = 0;
        var dataleng= 0 ;
        await data.tokens.map(async xx => {
          if(datar.includes(xx.mintId)!=true){
            dataleng += 1
          };                   
        });

        await data.tokens.map(async xx => {
          if(datar.includes(xx.mintId)!=true){
            await fs.appendFile('alpha.txt', `${xx.mintId}\n`, async function(err) {
              if (err) throw err;
              else{
                console.log(`${xx.mintId} => Insert APLHA ${c}`);

                const embed = new Discord.MessageEmbed()
                    .setTitle(`${xx.title} has been listed!`)
                    .setURL(`https://alpha.art/t/${xx.mintId}`)
                    .addField('Price', `**${xx.price/1000000000} SOL**`)
                    .setImage(xx.image)
                    .setColor('DARK_AQUA')
                    .setTimestamp()
                    .setFooter('AlphaArt');
                    // CHANNEL ID ALPHA
                client.channels.cache.get(ch_alpha).send({
                    embeds: [embed]
                });
                c+=1;
              }
            }); 
          }
          if(c == dataleng){
            await soldalpha(data)
          }                 
        });
      });
  });
}

const soldalpha = (data) => {
  var newline = '';
  data.tokens.map(async xx => {
    newline+= `${xx.mintId}\n`
  });
  fs.writeFile('alpha.txt', newline, function(err) {
      if (err) throw err;
  });
}


const fetcheden = () => {
    return new Promise((resolve) => {
        const query = `{"$match":{"collectionSymbol":"${eden_collection}"},"$sort":{"createdAt":-1},"$skip":0,"$limit":2000}`;
        fetch(`https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q=${query}`).then((res) => {
            res.json().then((data) => {
                resolve(data.results);
            }).catch(() => resolve([]));
        }).catch(() => resolve([]));
    });
};

const listingeden = async(data) => {
  await fs.readFile('eden.txt', 'utf8', async (err, datar) => {
      if (err) throw err;
      await new Promise(async(resolve, reject) => {
        var c = 0;
        var dataleng= 0 ;
        await data.map(async xx => {
          if(datar.includes(xx.id)!=true){
            dataleng += 1
          };                   
        });

        await data.map(async xx => {
          if(datar.includes(xx.id)!=true){
            await fs.appendFile('eden.txt', `${xx.id}\n`, async function(err) {
              if (err) throw err;
              else{
                console.log(`${xx.id} => Insert EDEN ${c}`);

                const embed = new Discord.MessageEmbed()
                    .setTitle(`${xx.title} has been listed!`)
                    .setURL(`https://magiceden.io/item-details/${xx.id}`)
                    .addField('Price', `**${xx.price} SOL**`)
                    .setImage(xx.img)
                    .setColor('DARK_AQUA')
                    .setTimestamp()
                    .setFooter('MagicEden');
                    // CHANNEL ID EDEN
                client.channels.cache.get(ch_eden).send({
                    embeds: [embed]
                });

                c+=1;
              }
            });
          }; 
          if(c == dataleng){
            await soldeden(data)
          }                  
        });
      });
  });
}

const soldeden = (data) => {
  var newline = '';
  data.map(async xx => {
    newline+= `${xx.id}\n`
  });
  fs.writeFile('eden.txt', newline, function(err) {
      if (err) throw err;
  });
}



client.on('ready', async() => {
    // console.log(`Logged in as ${client.user.tag}!`);

    // // do not wait the 10s and start syncing right now

    setInterval(async () => {
      const eden = await fetcheden();
      const addlisteden = await listingeden(eden);


      const alpha = await fetchalpha();
      const addlistalpha = await listingalpha(alpha);

      // console.log(alpha)
    }, 30000);

});

// BOT KEY
client.login(discord_token);