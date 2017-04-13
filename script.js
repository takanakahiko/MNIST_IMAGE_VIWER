'use strict';

class MnistImageBuffer{
    constructor(){
        this.data = new Array(28);
        for(let i = 0; i < 28; i++){
            this.data[i] = new Array(28);
            for(let j = 0; j < 28; j++){
                this.data[i][j] = 0;
            }
        }
        this.buffer = new Uint8Array();
        this._imageNum = -1;
    }
    
    parseFile(file){
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        let thiz = this;
        reader.onload = function(ev){
            thiz.buffer = new Uint8Array(reader.result, 16);
            thiz.imageNum = 0;
            log("parse done");
        }
    }
    
    set imageNum(num){
        if(this._imageNum === num) return;
        this._imageNum = num;
        for(let i = 0; i < this.data.length; i++){
            for(let j = 0; j < this.data[0].length; j++){
                this.data[i][j] = this.buffer[ (i*28+j) + (28*28*num)];
            }
        }
        log("read done");
    }
    
    get imageNum(){
        return this._imageNum;
    }
    
    draw(table){
        if(this._imageNum === -1) return;
        for(let i = 0; i < 28; i++){
            for(let j = 0; j < 28; j++){
                let hexadecimal = ('00'+this.data[i][j].toString(16)).slice(-2);
                let color = '#' + (Array(3+1).join(hexadecimal));
                table.rows[i].cells[j].style.backgroundColor = color;
            }
        }
        log("draw done");
    }
}

function log(msg){
	var myconsole = document.getElementById("myconsole");
	myconsole.innerHTML = myconsole.innerHTML + "<br>" + msg;
	console.log(msg);
};

let imageBuffer = new MnistImageBuffer();

let fileui = document.getElementById("selfile");
fileui.addEventListener("change",function(evt){
    let file = evt.target.files;
    imageBuffer.parseFile(file[0]);
},false);
/*
let buttonui = document.getElementById("button");
buttonui.addEventListener("click",function(evt){
    let num = document.getElementById("imageNum").value;
    imageBuffer.imageNum = parseInt(num);
    imageBuffer.draw(document.getElementsByTagName('table')[0]);
},false);
*/
let numUI = document.getElementById("imageNum");
numUI.addEventListener("change",function(evt){
    let num = parseInt(evt.target.value);
    if(isNaN(num)) return;
    imageBuffer.imageNum = num;
    imageBuffer.draw(document.getElementsByTagName('table')[0]);
},false);    

window.onerror = function (msg, url, line, col, error) {
    var errmsg = "file:" + url + "<br>line:" + line + " " + msg;
    log(errmsg);
};