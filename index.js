const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// in-memory database (upgrade to PostgreSQL later)
let accounts = [];

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// HELP MENU
function helpEmbed() {
  return new EmbedBuilder()
    .setTitle("🌸 Fragz Tracker Bot")
    .setColor(0xff4fd8)
    .setDescription(`
Commands:

!add name
!update name steam:yes psn:no xbox:yes
!check name
!list
!export
    `);
}

// ADD ACCOUNT
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(" ");

  // HELP
  if (message.content === "!help") {
    return message.reply({ embeds: [helpEmbed()] });
  }

  // ADD
  if (args[0] === "!add") {
    const name = args[1];

    if (!name) return message.reply("Usage: !add name");

    accounts.push({
      name,
      steam: "unknown",
      psn: "unknown",
      xbox: "unknown"
    });

    return message.reply(`Added **${name}** ✅`);
  }

  // UPDATE
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

    return message.reply(`Updated **${name}** ✅`);
  }

  // CHECK (EMBED UI)
  if (args[0] === "!check") {
    const name = args[1];

    const acc = accounts.find(a => a.name === name);
    if (!acc) return message.reply("Account not found ❌");

    const embed = new EmbedBuilder()
      .setTitle(`🌸 Account: ${acc.name}`)
      .setColor(0xff4fd8)
      .addFields(
        { name: "Steam", value: acc.steam, inline: true },
        { name: "PSN", value: acc.psn, inline: true },
        { name: "Xbox", value: acc.xbox, inline: true }
      );

    return message.reply({ embeds: [embed] });
  }

  // LIST
  if (message.content === "!list") {
    if (!accounts.length) return message.reply("No accounts stored.");

    let desc = "";

    accounts.forEach(a => {
      desc += `**${a.name}** | Steam:${a.steam} | PSN:${a.psn} | Xbox:${a.xbox}\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("📋 All Accounts")
      .setColor(0xff4fd8)
      .setDescription(desc);

    return message.reply({ embeds: [embed] });
  }

  // EXPORT
  if (message.content === "!export") {
    let output = accounts
      .map(a => `${a.name} | Steam:${a.steam} | PSN:${a.psn} | Xbox:${a.xbox}`)
      .join("\n");

    return message.reply("```" + output + "```");
  }
});

client.login(process.env.TOKEN);
