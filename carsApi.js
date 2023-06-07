let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header(
"Access-Control-Allow-Methods",
"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
);
res.header(
"Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept"
);
next();
});
const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Listening on port ${port}!`));

let {carsData}=require("./carsData.js");

let {cars,carMaster}=carsData;

app.get("/cars",function(req,res){
    let minPrice=req.query.minprice;
    let maxPrice=req.query.maxprice;
    let fuel=req.query.fuel;
    let type=req.query.type;
    let sort=req.query.sort;
    let arr1=cars;
    if(minPrice){
        arr1=arr1.filter(f=>f.price> +minPrice);
    }
    if(maxPrice){
        arr1=arr1.filter(f=>f.price< +maxPrice);
    }
    if(fuel){
        console.log(fuel);
        arr1=arr1.filter((car) => {
            let info = carMaster.find((c) => c.model === car.model);
            return info && info.fuel === fuel;});
       }
       if(type){
        arr1=arr1.filter((car) => {
            let info = carMaster.find((c) => c.model === car.model);
            return info && info.type === type;});
       }
       if(sort){
        switch(sort){
            case "id" : arr1.sort((c1,c2)=>c1.id.localeCompare(c2.id)); break;
            case "price" : arr1.sort((c1,c2)=>c1.price-c2.price); break;
            case "year" : arr1.sort((c1,c2)=>c1.year-c2.year); break;
            case "kms" : arr1.sort((c1,c2)=>c1.kms-c2.kms); break;
            case "model" : arr1.sort((c1,c2)=>c1.model.localeCompare(c2.model)); break;
            case "color" : arr1.sort((c1,c2)=>c1.color.localeCompare(c2.color)); break;
        }
       }
    res.send(arr1);
});

app.post("/cars",function(req,res){
    let body=req.body;
    console.log(body);
    cars.push(body);
    res.send(body);
});

app.put("/cars/:id",function(req,res){
    let id=req.params.id;
    let body=req.body;
    let index=cars.findIndex(f=>f.id===id);
    if(index>=0){
        cars[index]=body;
        res.send(body);
    }
    else{
        res.status(404).send("Id not Found");
    }
});

app.get("/cars/:id",function(req,res){
    let id=req.params.id;
    let car=cars.find(f=>f.id===id);
        res.send(car);
});

app.delete("/cars/:id",function(req,res){
    let id=req.params.id;
    let index=cars.findIndex(f=>f.id===id);
    if(index>=0){
        let car=cars[index];
        cars.splice(index,1);
        res.send(car);
    }
    else{
        res.status(404).send("not found");
    }
});



