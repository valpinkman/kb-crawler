import { config } from "dotenv";
config();
import { Client, MessageEmbed } from "discord.js";
import candykeysCrawl from "../services/candykeys";
import dropCrawl from "../services/drop";
import thekeyCrawl from "../services/thekey";
import kbdfansCrawl from "../services/kbdfans";
import firestore from "../services/firebase";
import { CrawlResult, ProviderType } from "../services/types";
import wait from "../helpers/wait";
const discord = new Client();

const colorMap = {
  candykeys: "#0099ff",
  kbdfans: "#2e2e2e",
  drop: "#fecf41",
  thekeycompany: "#e4c646",
};

const nameMap = {
  candykeys: "CandyKeys",
  kbdfans: "KBDFans",
  drop: "Drop",
  thekeycompany: "TheKey.Company",
};

async function crawl(): Promise<{ [key in ProviderType]: CrawlResult[] }> {
  const [candykeys, drop, thekeycompany, kbdfans] = await Promise.all([
    candykeysCrawl(),
    dropCrawl(),
    thekeyCrawl(),
    kbdfansCrawl(),
  ]);

  return {
    candykeys,
    drop,
    thekeycompany,
    kbdfans,
  };
}

async function postNewMessage(
  gb: CrawlResult,
  provider: ProviderType,
  chan: any,
) {
  const author = nameMap[provider];
  const color = colorMap[provider];
  const message = new MessageEmbed()
    .setColor(color)
    .setTitle(gb.name)
    .setDescription(`New group buy on ${author}`)
    .setURL(gb.href || "")
    .setThumbnail(gb.img || "")
    .setAuthor(author);
  await chan.send(message);
  await wait();
}

export default async function main(): Promise<void> {
  await discord.login(process.env.BOT_TOKEN);
  const gbs = await crawl();
  const chan = await discord.channels.fetch(process.env.CHANNEL_ID || "");

  const keys = Object.keys(gbs) as ProviderType[];

  for await (const key of keys) {
    const provider = gbs[key];
    const collection = await firestore.collection(key);
    for await (const gb of provider) {
      const ref = collection.doc(gb.name);
      const doc = await ref.get();
      if (doc.exists) {
        console.log(`${gb.name} already added!`);
      } else {
        console.log(`Creating ${gb.name}`);
        await collection.doc(gb.name).set({ gb });
        console.log("Created");
        await postNewMessage(gb, key, chan);
      }
    }
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}
