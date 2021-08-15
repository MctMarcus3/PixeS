const express = require('express');
const router = express.Router();
const db = require('../config/DBconfig');
const Notedb = require('../models/note');
const Sequelize = require('sequelize');

router.get("/:id", (req, res) => {
    let gid = req.params.id;
    
    //Notedb.create({id : 2,text :"hello",x: 10,y:15})

    const send_notes_list = [];
    const send_notes_list2 = {};
    
    Notedb.findAll().then(note => {
        
        for (let i = 0; i < note.length; i++) {
            
            if (note[i].g_id == gid){
                var temp_list = [note[i].id,note[i].text,note[i].x,note[i].y];
            
                send_notes_list.push(temp_list);
            }
        };
        var send_notes_list2 = JSON.stringify(send_notes_list);
        var send_this = send_notes_list;
        //console.log(send_this)
        res.render("notes/notes",{name:send_this,g_id:gid})
    })
})

router.post("/createnote", (req, res) => {
   
    Notedb.findAll({
        attributes: [Sequelize.fn('MAX', Sequelize.col('id'))],
        raw: true,
      }).then(noteid => {var highest_id = noteid; console.log(highest_id[0]['MAX(`id`)']);
      var x = 250;
      var y = 150;
      var id = highest_id[0]['MAX(`id`)'] + 1;
      var text = "New Note";
      var group_id = req.body.gid;
      
      Notedb.create({id : id,text:text,x:x,y:y,g_id:group_id})
      res.redirect("/notes/" + group_id)
    })
    
})
router.post("/deletenote", (req, res) => {
    var id = req.body.id;
    group_id = req.body.gid;
    Notedb.destroy({where:{
        id:id
    }});
    res.redirect("/notes/" + group_id);
    
})
router.post("/updatenote", (req, res) => {
    
    var id = req.body.id;
    var text = req.body.text;
    var x = req.body.x;
    var y = req.body.y;
    var group_id = req.body.gid;
    //console.log(x,y);
   
    
    Notedb.destroy({where:{
        id:id
    }});
    console.log(group_id);
    Notedb.create({id : id,text:text,x:x,y:y, g_id:group_id});

    res.redirect("/notes/" + group_id);




})


module.exports = router;   