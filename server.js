const express = require('express');
const app = express();
const mysql = require('mysql');
const PORT = 9000;

app.use(express.json());
const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"tipsandtrips"
})

app.get('/', (req, res) => {
    con.query("SELECT * FROM users",(err,result)=>{
        if (err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;

    console.log("Request Body:", req.body); // Log the incoming request body

    con.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, pass], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: "Database query error" });
        } else {
            if (result.length > 0) {
                res.send({ "result": result });
            } else {
                res.send({ "result": "not found" });
            }
        }
    });
    console.log(email + " = " + pass);
});

app.post("/signup",(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;

    console.log(name," ",email," ",pass);

    con.query("SELECT * FROM users WHERE email = ?",[email],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if (result.length > 0){
                res.send({'result':"already registed"})

            }else{
                con.query("INSERT INTO users (name,email,password) values (?,?,?)",[name,email,pass],(err,result)=>{
                    if (err){
                        console.log(err);

                    }else{
                        res.send({'result':"registered successfully"});
                    }
                })
            }
        }
    })


})


app.listen(PORT, () => {
    console.log('server is running on http://localhost:' + PORT);
});
