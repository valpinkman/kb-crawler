import cheerio from "cheerio";
import axios from "axios";
import { CrawlResult } from "./types";

const url = "https://kbdfans.com/collections/group-buy";
const base = "https://kbdfans.com/";

async function main(): Promise<CrawlResult[]> {
  const res: CrawlResult[] = [];
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const products = $(".grid-product__link");

    products.each((i, p) => {
      const href = `${base}${$(p).attr("href")}`;
      const name = $(p)
        .find(".grid-product__title")
        .text()
        .replace("[GB] ", "")
        .replace("/", "-");
      const wrapper = $(p).find(".image-wrap").first();
      const bgset = $(wrapper).find("div").data("bgset");
      const url = (bgset as any).trim().split(",").pop().trim().split(" ")[0];
      const img = `https:${url}`;

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
