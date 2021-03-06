const http = require('http');
const fs = require('fs');   // FILE SYSTEM MODULE
const PORT = 8000;



const server = http.createServer((req, res) => {
        
    //GETTING REQUEST URL
    const url = req.url;

    //GETTING REQUEST METHOD
    const method = req.method;


    // ROOT ROUTE
    if(url === "/"){
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.write("Hello From The Other Side");
        res.end();
    }

    // LOGIN ROUTE
    else if(url === "/login" && method === "POST"){
        
        //STORING REQUEST DATA IN DATA1 WHICH IS RECEIVED IN CHUNKS
        let requestData = "";
        req.on("data", function( chunk ){
            requestData += chunk;
        })
        

        //READING FILE
        fs.readFile("./users.json", "utf8", (err, data)=> {
            if (err) {
                console.log(err);
                res.writeHead(400, {"Content-Type":"text/html"})
                res.end("Error While Reading Data From File!")
            } else {

                //PARSING FILE DATA TO JSON OBJ
                var obj = JSON.parse(data);   

                //PARSING REQUEST DATA TO JSON OBJ
                const jsondata = JSON.parse(requestData);
                //FLAG
                let found = false;  

                //FOR...LOOP CHECKING FOR PARTICULAR USER FOR LOGIN
                for(let i = 0; i < obj.users.length; i++){
                    //IF USER IS FOUND
                    if(jsondata.email === obj.users[i].email &&
                        jsondata.password === obj.users[i].password){

                            res.writeHead(200, {'Content-Type': 'text/html'});
                            res.write(JSON.stringify("success"));
                            res.end();    
                            found = true;
                            break;
                    }         
                }

                //IF USER IS NOT FOUND
                if(!found){
                    res.writeHead(401, {'Content-Type': 'text/html'});
                    res.write(JSON.stringify("Error Logging In."));
                    res.end();
            }   
        }
        })
    }


    // REGISTER ROUTE
    else if(url === "/register" && method === "POST"){

        //STORING REQUEST DATA IN DATA1 WHICH IS RECEIVED IN CHUNKS
        let requestData = "";
        req.on("data",function(chunk){
            requestData += chunk;
        })
          
        //READING FILE
        fs.readFile("./users.json", "utf8", (err, data) => {
            let found = false;
            if (err) {
                console.log(err);
            } else {
                //PARSING FILE DATA TO JSON OBJ
                let obj = JSON.parse(data);

                //CHECK IF USER ALREADY EXISTS
                for(let i = 0 ;i < obj.users.length;i++){
                    if(obj.users[i].email === JSON.parse(requestData).email){
                            console.log("User Already Exits");
                            res.writeHead(400,{"Content-Type":"application/json"})
                            res.end("User Already Exists ");
                            found=true;
                    }         
                }
                
                if(!found){
                    //PUSING PARSED REQUEST DATA INTO THE JSON OBJ VAR.
                    obj.users.push(JSON.parse(requestData));

                    //CONVERTING JS OBJ INTO STRING
                    let json = JSON.stringify(obj, null, 2);

                    //WRITING TO FILE
                    fs.writeFile("./users.json", json, "utf8", (err) => {
                        if (err) {
                            console.log(err);
                            res.writeHead(500,{"Content-Type":"application/json"})
                            res.end("Error while storing data!");
                        } else {
                            console.log("Registration Done");
                            res.writeHead(200,{"Content-Type":"application/json"})
                            res.end(JSON.stringify(obj));
                        }
                    });
                }
                 

                
             }
        });
        
    }


    // DELETE ROUTE
    else if(url==="/userdelete" && method === "DELETE"){

        //STORING REQUEST DATA IN DATA1 WHICH IS RECEIVED IN CHUNKS
        let requestData = "";
        req.on("data",function(chunk){
            requestData += chunk;
        })

        //READING FILE
        fs.readFile("./users.json", "utf8", (err, data) => {

            //FLAG
            let found =false;

            if (err) {
                console.log(err);
            } else {

                //PARSING FILE DATA INTO OBJ.
                let obj = JSON.parse(data);

                //PARSING REQ DATA INTO OBJ.
                const del = JSON.parse(requestData);

                //DELETING PARTICULAR USER MATCHING ID
                for(let i=0;i<obj.users.length;i++){
    
                    if(obj.users[i].id === del.id){
                        obj.users.splice(i,1); 
                        found = true;
                    }

                }

                if(!found){
                    res.writeHead(404,{"Content-Type":"application/json"})
                    res.end("No User Found To Delete");
                }else{
                    //CONVERTING OBJ DATA INTO STRING
                    let json = JSON.stringify(obj, null, 2);

                    //WRITING TO THE FILE
                    fs.writeFile("./users.json", json, "utf8", (err) => {
                        if (err) {
                            console.log(err);
                            res.end("Error while Deleting data!");
                        } else {
                            console.log("Done Deleting");
                            res.writeHead(200,{"Content-Type":"application/json"})
                            res.end(JSON.stringify(obj));
                        }
                    });
                }

                
             }
        });
 
    }



    // UPDATE ROUTE
    else if(url==="/userupdate" && method === "PUT"){

        //STORING REQUEST DATA IN DATA1 WHICH IS RECEIVED IN CHUNKS
        let requestData = "";
        req.on("data",function(chunk){
            requestData += chunk;
        })

        //READING FILE
        fs.readFile("./users.json", "utf8", (err, data) => {

            //FLAG
            let found=false;

            if (err) {
                console.log(err);
            } else {

                //PARSING FILE DATA INTO OBJ.
                let obj = JSON.parse(data);

                //PARSING REQ DATA INTO OBJ.
                const update = JSON.parse(requestData);

                //UPDATING PARTICULAR USER MATCHING ID
                for(let i=0;i<obj.users.length;i++){
    
                    if(obj.users[i].id === update.id){
                        obj.users[i] = update;
                        found=true;
                    }

                }
                //IF USER IS NOT FOUND
                if(!found){
                    res.writeHead(404,{"Content-Type":"application/json"})
                    res.end("No User Found");
                }else{
                    //CONVERTING OBJ DATA INTO STRING
                    let json = JSON.stringify(obj, null, 2);

                    //WRITING TO THE FILE
                    fs.writeFile("./users.json", json, "utf8", (err) => {
                        if (err) {
                            console.log(err);
                            res.end("Error while Updating data!");
                        } else {
                            console.log("Done Updating");
                            res.writeHead(200,{"Content-Type":"application/json"})
                            res.end(JSON.stringify(obj));
                        }
                    });
                }

                
             }
        });
 
    }



    //404 FOR WRONG ROUTE OR METHOD TYPE
    else{
        res.writeHead(404,{'Content-Type': 'text/html'});
        res.write("404 ERROR PAGE. PAGE DOESN't EXIT");
        res.end();
    }

}
);


//SERVER LISTENING AT GIVEN PORT
server.listen(PORT, "127.0.0.1", () => {
    console.log(`Listening To Port No.: ${PORT}`);
})
