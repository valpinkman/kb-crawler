import cheerio from "cheerio";
import axios from "axios";
import { CrawlResult } from "./types";


const url = "https://drop.com/featured/signature-series";

async function main(): Promise<CrawlResult[]> {
  const res: CrawlResult[] = [];
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const groupBuys = $(
      '[class*="SharedContentBlocks__section"] [class*="SharedContentBlocks__text-container"] a',
    );

    groupBuys.each((i, s) => {
      const href = $(s).attr("href");
      const name = $(s)
        .siblings('[class*="SharedContentBlocks__text-header--centered"]')
        .text();
      const parent = $(s)
        .closest('[class*="SharedContentBlocks__section__"]')
        .prev();
      const imgwrapper = $(parent).find("div").first();
      const css = imgwrapper.css("background-image") as string;
      const [, url] = css.split("'");
      const img = `https:${url}`;
      res.push({ href, name, img });
    });

    return res;
  } catch (error) {
    console.error("error", error.message);
    return res;
  }
}

if (require.main === module) {
  main().then((res) => console.log(res));
}

export default main;
