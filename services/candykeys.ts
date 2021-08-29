import cheerio from "cheerio";
import axios from "axios";
import { CrawlResult } from "./types";

const url = "https://candykeys.com/group-buys";

async function main(): Promise<CrawlResult[]> {
  const res: CrawlResult[] = [];
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const columns = $(".group-buys .columns");
    const groupBuys = $(columns[0]).children(".column");
    groupBuys.each((i, gb) => {
      const href = $(gb).children("a.group-buy").attr("href");
      const name = $(gb).find("h4").text();
      const img = $(gb).find("img").attr("data-blink-src");

      res.push({ href, name, img });
    });

    return res;
  } catch (error: any) {
    console.error("error", error.message);
    return res;
  }
}

if (require.main === module) {
  main().then((res) => console.log(res));
}

export default main;
