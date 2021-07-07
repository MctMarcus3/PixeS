const express = require('express');
const router = express.Router();
const db = require('../config/DBconfig');
const Notedb = require('../models/note');

router.get("/", (req, res) => {
    
    
    //Notedb.create({id : 2,text :"hello",x: 10,y:15})
    const send_notes_list = [];
    const send_notes_list2 = {};
    Notedb.findAll().then(note => {
        
        for (let i = 0; i < note.length; i++) {
            var temp_list = [note[i].id,note[i].text,note[i].x,note[i].y];
            send_notes_list.push(temp_list);
            
        };
        var send_notes_list2 = JSON.stringify(send_notes_list);
        console.log(send_notes_list2)
    }).then(res.render("notes/notes",{name:send_notes_list2}))


    /*Notedb.findAll().then(note => {
        notes = note
        for (let i = 0; i < note.length; i++) {
            console.log(note[i].x)
            var temp_note = [note[i].id,note[i].text,note[i].x,note[i].y];
            //console.log(temp_note);
            send_notes_list.push(temp_note);
        };

      });
      console.log(notes)
    //console.log(send_notes_list)

    res.render("notes/notes",{sent_notes_list:send_notes_list});*/
})
router.post("/updatenote", (req, res) => {
    var x = req.body.x;
    var y = req.body.y; 
    var id = req.body.id;
    var text = req.body.text;
    //console.log(x,y);
    res.redirect("/notes")
})


module.exports = router;   