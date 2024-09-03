import axios from "axios";
import express from "express";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

const app = express();

interface IProducts {
  name?: string | undefined | any;
  image?: string;
  linkPage?: string;
  price?: string;
}

app.get("/test/:search", async (req, res) => {
  try {
    const { search } = req.params;
    const url = `https://www.google.com/search?q=${search}&tbm=shop&sourceid=chrome&ie=UTF-8`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "GyAeWbMozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    const listItem = $("body #main .sh-dgr__content");

    const countries: IProducts[] = [];
    listItem.map((idx, el) => {
      const coutry: IProducts = {};
      // // Object holding data for each country/jurisdiction
      // // Select the text content of a and span elements
      // // Store the textcontent in the above object
      coutry.name = $(el).find("span a div h3").text();
      coutry.image = $(el).find("div div a img").attr("src");
      coutry.linkPage = $(el).find("div a").attr("href");
      coutry.price = $(el).find("div span div .OFFNJ").text();

      if (coutry.image && coutry.image.startsWith("data:image")) {
        console.log(`Imagem base64 encontrada: ${coutry.image}`);
      } else {
        console.log(`Imagem URL encontrada: ${coutry.image}`);
      }
      // coutry.image = $(el).find('img').attr('src')
      // // Populate countries array with country data
      // countries.push(el);
      // const name = $('.tAxDx').text();
      // const image = $(el).find('img').attr('src');

      countries.push(coutry);

      // console.log(image)
      // el.children.map((ele: any, key)=>{
      //     countries.push({name})
      // })
    });
    //   countries.push(coutry)

    res.json(countries);
  } catch (error) {}
});

app.get("/ch", async (req, res) => {
  try {
    // Inicia o navegador
    const browser = await puppeteer.launch({ headless: true }); // Headless: true para não abrir o navegador
    const page = await browser.newPage();

    // Navega para a página desejada
    await page.goto("https://google.com/search?q=camisa+nike&tbm=shop");

    // Extraia o conteúdo desejado
    // const arr: { name: string; image: string }[] = [];

    const data = await page.evaluate(() => {
      // Seleciona todos os elementos de artigo (modifique o seletor conforme necessário)
      const articles = document.querySelectorAll(".sh-dgr__gr-auto"); // Supondo que cada artigo esteja dentro de uma tag <article>

      // Mapeia cada artigo para um objeto contendo título e descrição
      return Array.from(articles).map((article) => {
        const title = article.querySelector("h3")?.innerText || ""; // Captura o texto do <h2> ou uma string vazia se não existir
        const image = article.querySelector("img")?.src || ""; // Captura o texto do <p> ou uma string vazia se não existir
        const price = article.querySelector(".QIrs8 span")?.innerHTML || ""; // Captura o texto do <p> ou uma string vazia se não existir
        return { title, image, price }; // Retorna um objeto com título e descrição
      });
    });

    console.log(data);

    // Fecha o navegador
    await browser.close();
  } catch (error) {}
});

export default app;
