require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// In-memory database (upgrade later to Postgres if you want)
let accounts = [];

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ADD ACCOUNT
// !add name
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(" ");

  // ADD
  if (args[0] === "!add") {
    const name = args[1];

    accounts.push({
      name,
      steam: "unknown",
      psn: "unknown",
      xbox: "unknown"
    });

    return message.reply(`Account **${name}** added ✅`);
  }

  // UPDATE PLATFORM STATUS
  // !update name steam:yes psn:no xbox:yes
  if (args[0] === "!update") {
    const name = args[1];

    const acc = accounts.find(a => a.name === name);
    if (!acc) return message.reply("Account not found ❌");

    args.slice(2).forEach(pair => {
      const [key, value] = pair.split(":");
      if (acc[key] !== undefined) {
        acc[key] = value;
      }
    });

    return message.reply(`Account **${name}** updated ✅`);
  }

  // LIST
  if (message.content === "!list") {
    if (!accounts.length) return message.reply("No accounts saved.");

    let out = "🌸 FRAGZ TRACKER LIST\n\n";

    accounts.forEach(a => {
      out += `
${a.name}
Steam: ${a.steam}
PSN: ${a.psn}
Xbox: ${a.xbox}
-------------------
`;
    });

    return message.reply(out);
  }

  // CHECK (clean formatted view)
  if (args[0] === "!check") {
    const name = args[1];

    const acc = accounts.find(a => a.name === name);
    if (!acc) return message.reply("Account not found ❌");

    return message.reply(`
🌸 ACCOUNT STATUS

Name: ${acc.name}

Steam → ${acc.steam}
PSN → ${acc.psn}
Xbox → ${acc.xbox}
`);
  }

  // EXPORT READY ACCOUNTS
  if (message.content === "!export") {
    let out = "EXPORT LIST 🌸\n\n";

    accounts.forEach(a => {
      out += `${a.name} | Steam:${a.steam} | PSN:${a.psn} | Xbox:${a.xbox}\n`;
    });

    return message.reply(out || "No data.");
  }
});

client.login(process.env.TOKEN);