import axios from "axios";
import express from "express"
import * as cheerio from 'cheerio';


const app = express();

interface IProducts {
    name?: string;
    image?: string;
}


app.get('/', async (req,res)=>{
    try {
        const url = 'https://www.google.com/search?q=camisa+nike&tbm=shop';
        
        const {data} = await axios.get(url, {
            headers: {
                "User-Agent": "GyAeWbMozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
            }
        })
    
        const $ = cheerio.load(data)

        const listItem = $('body #main .tAxDx')

        const countries: IProducts [] = [];
        listItem.each((idx, el) => {
            // // Object holding data for each country/jurisdiction
            // // Select the text content of a and span elements
            // // Store the textcontent in the above object
            // country.name = $(el).children("a").text();
            // country.iso3 = $(el).children("span").text();
            // // Populate countries array with country data
            // countries.push(el);
            el.children.map((ele: any, key)=>{
                countries.push({name: ele.data})
            })
          });

          res.json(countries)
    
    } catch (error) {
        
    }
})


export default app;