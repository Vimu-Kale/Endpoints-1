const http = require('http');
const fs = require('fs');
const PORT = 8000;



const server = http.createServer((req, res) => {
        
    const url = req.url;
    const method = req.method;

    if(url === "/"){
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.write("Hello From The Other Side");
        res.end();
    }


    else if(url === "/login" && method === "POST"){
        
        let data1 = "";
        req.on("data", function( chunk ){
            data1 += chunk;
        })
        
        fs.readFile("./users.json", "utf8", (err, data)=> {
            if (err) {
                console.log(err);
                res.writeHead(400, {"Content-Type":"text/html"})
                res.end("Error While Reading Data From File!")
            } else {
                var obj = JSON.parse(data);   
                const jsondata = JSON.parse(data1);
                let found = false;  
                for(let i = 0; i < obj.users.length; i++){
                    if(jsondata.email === obj.users[i].email &&
                        jsondata.password === obj.users[i].password){
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            res.write(JSON.stringify("success"));
                            res.end();    
                            found = true;
                            break;
                    }         
                }
                if(!found){
                    res.writeHead(400, {'Content-Type': 'text/html'});
                    res.write(JSON.stringify("Error Logging In."));
                    res.end();
            }   
        }
        })
    }



    else if(url === "/register" && method === "POST"){

        let data1 = "";
        req.on("data",function(chunk){
            data1+=chunk;
        })
          
        fs.readFile("./users.json", "utf8", (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let obj = JSON.parse(data);
                obj.users.push(JSON.parse(data1)); 
                let json = JSON.stringify(obj, null, 2);
                fs.writeFile("./users.json", json, "utf8", (err) => {
                        if (err) {
                            console.log(err);
                            res.end("Error while storing data!");
                        } else {
                            console.log("Done");
                            res.writeHead(200,{"Content-Type":"application/json"})
                            res.end(JSON.stringify(obj));
                        }
                });
             }
        });
        
    }


    else{
        res.writeHead(404,{'Content-Type': 'text/html'});
        res.write("404 ERROR PAGE. PAGE DOESN't EXIT");
        res.end();
    }

}
);



server.listen(PORT, "127.0.0.1", () => {
    console.log(`Listening To Port No.: ${PORT}`);
})