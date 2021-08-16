


var notes_list = [];
var count = 0
var note_count = 0
//var title = document.getElementById("lol")
//title.setAttribute("style", "position: absolute;border: 1px solid blue;width: 300px;height: 100px;top: 70px;left: 15px; ")
class Note {
constructor(x, y, height, width,text) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.text = text
    this.id = note_count
    this.obj = null
    note_count += 1

};


CreateNote() {
    var div = document.createElement("div");
    div.className = "note"
    div.id = "note" + this.id
    div.onmousedown = "move_div(div)"
    div.style.position = "absolute";
    div.style.border = "1px solid #000";
    div.style.width = this.width.toString() + "px";
    div.style.height = this.height.toString() + "px";
    div.style.left = (this.x + count).toString() + "px";
    div.style.top = this.y.toString() + "px";
    div.style.backgroundColor = "rgb(255,255,0)";
    div.style.color = "blue";
    //div.style.height = "50vh";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";

    var text = document.createElement("div");
    text.className = "text"
    text.contentEditable = "true"
    text.innerHTML = this.text
    div.appendChild(text)
    document.getElementById("notes").appendChild(div);
    this.obj = div;
    
};


};
function createNewNote() {
console.log("hi")
const new1 = new Note(250, 150, 300, 300,"New Note");


count += 50;
new1.CreateNote();
notes_list.push(new1);

move_div(new1.obj);
console.log(here)
$.post("notes/createnote")
console.log(Notedb)

//Notedb.create({id : new1.id,text :new1.text,x: new1.x,y:new1.y})
/*for (i in notes_list) {
    console.log(notes_list[i].obj)
    move_div(notes_list[i].obj);
};*/
//move_div(new1.obj);
};
var clicked = get_clicked();
console.log(clicked);
function get_clicked() {
var re = document.addEventListener('click', function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
    text = target.textContent || target.innerText;
    
    return target
}, false);
//console.log(re);

}
function move_div(ele) {
//var el = document.querySelector(".note");
var el = ele
//console.log(el)
//el = ele;
//var el = document.getElementsByClassName(".note");

//el.addEventListener('mousedown', mousedown);

el.onmousedown = mousedown;

/*document.addEventListener('click', function (event) {
    if (el !== event.target && !el.contains(event.target)) {
    console.log(el.id);
    }
});*/


function mousedown(e) {

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    let prevX = e.clientX;
    let prevY = e.clientY;


    function mousemove(e) {
    let newX = prevX - e.clientX;
    let newY = prevY - e.clientY;

    const rect = el.getBoundingClientRect();
    el.style.left = rect.left - newX + "px";
    el.style.top = rect.top - newY + "px";


    ele.x = el.style.left;
    ele.y = el.style.top;

    prevX = e.clientX;
    prevY = e.clientY;
    }
    function mouseup() {
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mouseup', mouseup);
    }
}

}

//const new1 = new Note(250, 150, 300, 300);
//new1.DisplayNote();
