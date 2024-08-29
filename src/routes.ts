import axios from "axios";
import express from "express"
import * as cheerio from 'cheerio';


const app = express();

interface IProducts {
    name?: string | undefined | any;
    image?: string;
}


app.get('/test/:search', async (req,res)=>{
    try {
        const {search} = req.params;
        const url = `https://www.google.com/search?q=${search}&tbm=shop`;
        
        const {data} = await axios.get(url, {
            headers: {
                "User-Agent": "GyAeWbMozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
            }
        })
    
        const $ = cheerio.load(data)

        const listItem = $('body #main .sh-dgr__content')

        const countries: IProducts [] = [];
        listItem.map((idx, el) => {
            const coutry: IProducts = {}
            // // Object holding data for each country/jurisdiction
            // // Select the text content of a and span elements
            // // Store the textcontent in the above object
            coutry.name = $(el).find('.tAxDx').text()
            coutry.image = $(el).find('img').attr('src');
            // coutry.image = $(el).find('img').attr('src')
            // // Populate countries array with country data
            // countries.push(el);
            // const name = $('.tAxDx').text();
            // const image = $(el).find('img').attr('src');

            countries.push(coutry)
            
            // console.log(image)
            // el.children.map((ele: any, key)=>{
            //     countries.push({name})
            // })
          });
        //   countries.push(coutry)

          res.json(countries)
    
    } catch (error) {
        
    }
})


export default app;