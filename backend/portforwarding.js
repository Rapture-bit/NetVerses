import Cloudflare from "cloudflare";
import dotenv from "dotenv";

dotenv.config();
const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
  apiKey: process.env.CLOUDFLARE_API_KEY,
  apiEmail: process.env.CLOUDFLARE_API_EMAIL,
});

const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const TOKEN_API = process.env.CLOUDFLARE_API_TOKEN;

const IDs = [
  {
    id: "62cc83436741fbb04418c4719235aa59",
    name: "api.netverses.com",
  },
  {
    id: "c698a14bd1428dc95c66986339f779f1",
    name: "assets.netverses.com",
  },
  {
    id: "ba03a30061361cb75e1d79b771d617ab",
    name: "cdn.netverses.com",
  },
  {
    id: "f574524a2d3a04dbf0f0bfbcadeb0214",
    name: "help.netverses.com",
  },
  {
    id: "608cf5a7d9b4f62c8fc411eceb361280",
    name: "netverses.com",
  },
  {
    id: "d28f94892192e04803be82ee014efbca",
    name: "www.netverses.com",
  },
];

const portforward = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json", {
      method: "GET",
    });

    const data = await response.json();
    const ip = data.ip;

    for (const ID in IDs) {
      await client.dns.records.edit(IDs[ID].id, {
        zone_id: ZONE_ID,
        content: ip,
        name: IDs[ID].name,
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

portforward();
export default portforward;
