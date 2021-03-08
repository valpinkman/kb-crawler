import cheerio from "cheerio";
import axios from "axios";
import { CrawlResult } from "./types";

const url = "https://thekey.company/collections/group-buys";

async function main(): Promise<CrawlResult[]> {
  const res: CrawlResult[] = [];
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const products = $(".grid-product__grid-item");

    products.each((i, p) => {
      const anchor = $(p).find("a");
      const href = `https://thekey.company${anchor.attr("href")}`;
      const name = anchor.text();
      const pic = $(p).find(".grid-product__image");
      const img = `https:${pic.attr("src")}`;

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
