import fs from "fs";
import ejs from "ejs";

// Load the template
const template = fs.readFileSync("src/templates/ERC20.ejs", "utf-8");

export default function handler(req, res) {
  const data = req.body;
  const renderedContract = ejs.render(template, JSON.parse(data));

  res.status(200).json(renderedContract);
}
