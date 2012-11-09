/*!
 * Ether(Aether) Era Game Web JavaScript Library v0.0.1
 * http://neonlb.github.com/
 *
 * Copyright 2012, neonlb (LiB)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://neonlb.github.com/license
 *
 * Date: Thu Feb 16 21:11:03 2012 -0500
 */
$(document).ready(function(){
    EtherEra.JS.ZombieTownEscape.Static.imgLoader();


    var eeWorld = new EtherEra.JS.ZombieTownEscape.World("eeWorld",1000,560);
    eeWorld.trace("EE：僵尸镇逃亡");
});

//namespace and sub namespace
var EtherEra = EtherEra ? EtherEra : {};
EtherEra.JS = EtherEra.JS? EtherEra.JS : {};
EtherEra.JS.ZombieTownEscape = EtherEra.JS.ZombieTownEscape? EtherEra.JS.ZombieTownEscape : {};

EtherEra.JS.ZombieTownEscape.World = function(wID, wWidth, wHeight) {
    this.PI_2 = Math.PI * 2;

    this.worldWidth  = wWidth;
    this.worldHeight = wHeight;
    this.momentNum = 0;
    this.buildings = [];
    this.movers = [];
    this.movers["zombie"]  = []; this.movers["survivor"]  = [];	this.movers["usr"] = [];
    this.tracers = new Array();

    this.wID = wID;
    this.divOutputID = wID+"OutputDIV";
    this.divID = wID+"DIV";
    this.setup();
    this.worldDiv = $("div#"+this.divID)[0];
    this.worldCanvas = $("canvas#"+wID)[0];
    this.worldContext = this.worldCanvas.getContext("2d");

    this.mouseX;
    this.mouseY;
    this.mouseVX;
    this.mouseVY;
    this.isMouseDown;

    this.runInvertval = null;
    this.momentInvertval = null;
    this.tracerLoad();
    this.start();
};

EtherEra.JS.ZombieTownEscape.World.prototype.setup = function() {
    $("<div>").attr("id",this.divOutputID).attr("width",this.worldWidth).attr("height",20).width(this.worldWidth).height(20).css("border","1px solid #000").css("margin","20px auto auto auto").css("display","block").css("position","relative").html("").appendTo(document.body);
    $("<div>").attr("id",this.divID).attr("width",this.worldWidth).attr("height",this.worldHeight).width(this.worldWidth).height(this.worldHeight).css("border","1px solid #000").css("margin","20px auto auto auto").css("display","block").css("position","relative").html("").appendTo(document.body);
    $("<canvas>").attr("id",this.wID).attr("width",this.worldWidth).attr("height",this.worldHeight).width(this.worldWidth).height(this.worldHeight).css("border","0px solid #000").css("margin","auto auto auto auto").css("display","block").html("Your browser does not support the canvas element.").appendTo($("div#"+this.divID));
};

EtherEra.JS.ZombieTownEscape.World.prototype.getRandomColor = function() {
    var colorStr = '#';
    for(var i=0; i<6; i++)
    {
        if (0 == i%2)
            colorStr += 'cdef'[Math.floor(Math.random()*4)];
        else
            colorStr += '0123456789abcdef'[Math.floor(Math.random()*16)]
    }
    return colorStr;
};

EtherEra.JS.ZombieTownEscape.World.prototype.addBuilding = function(type) {
    var width = 100;
    var height = 50;
    var x = (this.worldWidth - width)* Math.random();
    var y = (this.worldHeight - height)* Math.random();
    var life = 1500;
    var type  = arguments[0]?arguments[0]:"Lab Building";

    var b = new EtherEra.JS.ZombieTownEscape.Building(x, y, width, height, life, type);
    this.buildings.push(b);
};

EtherEra.JS.ZombieTownEscape.World.prototype.addMover = function(type) {
    var type  = arguments[0]?arguments[0]:"zombie";
    var sc = 4;
    var x  = this.worldWidth * Math.random();
    x = x > sc ? x : sc;
    x = x < this.worldWidth - sc ? x : this.worldWidth - sc;  
    var y  = this.worldHeight * Math.random();
    y = y > sc ? y : sc;
    y = y < this.worldHeight - sc ? y : this.worldHeight - sc;
    var v = 1.25;
    var angle = Math.random() * 360;
    var life = 100;
    var m = new EtherEra.JS.ZombieTownEscape.Mover(x, y, v, angle, sc, life, type);
    this.movers[type].push(m);
    //return m;
};

EtherEra.JS.ZombieTownEscape.World.prototype.delMover = function(type, i) {
    var type = arguments[0]?arguments[0]:"zombie";
    var i    = arguments[1]?arguments[1]:this.movers[type].length;
    this.movers[type].splice(i,1);
    //return m;
};

EtherEra.JS.ZombieTownEscape.World.prototype.delMoverObj = function(type, m) {
    var type = arguments[0]?arguments[0]:"zombie";
    var i    = arguments[1]?arguments[1]:this.movers[type].length;
    var _this = this;

    $.each(this.movers[type], function(index, element) {
        if(element == m)
        {
            _this.movers[type].splice(index,1);
            return false;
        }
    });
    //return m;
};

EtherEra.JS.ZombieTownEscape.World.prototype.onWorldMouseMove = function(e) {
    var ev = e ? e : window.event;
    this.mouseX = ev.pageX - this.worldDiv.offsetLeft - this.worldCanvas.offsetLeft;
    this.mouseY = ev.pageY - this.worldDiv.offsetTop  - this.worldCanvas.offsetTop;
};

EtherEra.JS.ZombieTownEscape.World.prototype.onWorldMouseDown = function(e) {
    this.isMouseDown = true;
    return false;
};

EtherEra.JS.ZombieTownEscape.World.prototype.onWorldMouseUp = function(e) {
    this.isMouseDown = false;
    return false;
};

EtherEra.JS.ZombieTownEscape.World.prototype.start = function()
{
    var _this = this;

    var worldMouseMoveCallback = function(e){ _this.onWorldMouseMove(e); };
    var worldMouseUpCallback = function(){ _this.onWorldMouseUp(); };
    var worldMouseDownCallback = function(){ _this.onWorldMouseDown(); };
    $("div#"+this.divID).mousedown(worldMouseDownCallback);
    $("div#"+this.divID).mouseup(worldMouseUpCallback);
    $("div#"+this.divID).mousemove(worldMouseMoveCallback);

    this.momentNum = 0;
    this.buildings.splice(0,this.buildings.length);
    this.addBuilding("Lab Building");
    this.addBuilding("Refuge"); this.addBuilding("Airport");
    for (var key in this.movers) this.movers[key].splice(0,this.movers[key].length);
    this.addMover("usr"); this.movers["usr"][0].setV(4.25);
    var i = 10;	while ( i-- ) this.addMover("zombie");
    var i = 10;	while ( i-- ) this.addMover("survivor");

    var callback = function(){ _this.run(); };
    window.clearInterval(this.runInvertval);
    this.runInvertval = window.setInterval(callback,33);
    var callbackOutput = function(){ _this.momentRun(); };
    window.clearInterval(this.momentInvertval);
    this.momentInvertval = window.setInterval(callbackOutput,3000);
};

EtherEra.JS.ZombieTownEscape.World.prototype.run = function() {
    this.worldContext.globalCompositeOperation = "source-over";
    this.worldContext.fillStyle = "rgba(8,8,12,0.65)";
    this.worldContext.fillRect( 0 , 0 , this.worldWidth , this.worldHeight );
    //this.worldContext.globalCompositeOperation = "lighter";

    var i = this.buildings.length;
    while ( i-- )  this.drawBuilding(this.buildings[i]);

    for (var key in this.movers)
    {
        var i = this.movers[key].length;
        while ( i-- ) //this.isAttacked(this.movers[key][i]);
        {
            var m = this.movers[key][i];
            if(0 > m.getLife())
            {
                this.delMover(key,i);
                continue;
            }

            if("usr" == key)
            {
                if(0 > m.getLife())
                {
                    this.gameOver();
                    return;
                }
                // usr control mover
                this.mouseVX = this.mouseX - m.getX();
                this.mouseVY = this.mouseY - m.getY();
                if ( Math.abs(Math.sqrt(Math.pow(this.mouseVX, 2) + Math.pow(this.mouseVY, 2))) < m.getV() )
                {
                    m.setTargetX(this.mouseX);
                    m.setTargetY(this.mouseY);
                }
                else
                    m.movePlan(Math.atan2(this.mouseVY, this.mouseVX));
            }
            else
            {
                // zombie mover
                m.movePlan();
            }
            this.moveFixed(m);
            this.drawMover(m);
        }
    }
};

EtherEra.JS.ZombieTownEscape.World.prototype.drawMover = function(m) {

    this.worldContext.save();
    this.worldContext.beginPath();
    this.worldContext.rect(m.getX()-m.getSC() *4 -1, m.getY()-m.getSC() *4 -1, m.getSC() *4 *2 +2, m.getSC() *4 *2 +2);
    this.worldContext.closePath();
    this.worldContext.clip();

    this.worldContext.fillStyle = m.getColor();
    this.worldContext.beginPath();
    this.worldContext.arc( m.getX() , m.getY() , m.getSC() , 0 , this.PI_2 , true );
    this.worldContext.closePath();
    this.worldContext.fill();

    this.worldContext.strokeStyle = m.getColor();
    this.worldContext.beginPath();
    this.worldContext.arc( m.getX() , m.getY() , m.getSC() *4 , 0 , this.PI_2 , true );
    this.worldContext.closePath();
    this.worldContext.stroke();

    //display image
    //context.drawImage(imgmain, 0, 0);
    //resize image
    this.worldContext.drawImage(EtherEra.JS.ZombieTownEscape.Static.moverImage[m.getPK()], m.getX()-m.getSC() *4, m.getY()-m.getSC() *4, m.getSC() *4 *2, m.getSC() *4 *2);
    //part of image
    //context.drawImage(imgmain, 0, 0, 107, 86, 0, 180, 107, 86);
    this.worldContext.restore();

};

EtherEra.JS.ZombieTownEscape.World.prototype.drawBuilding = function(b) {

    this.worldContext.save();
    this.worldContext.beginPath();
    this.worldContext.rect(b.getX() - b.getWidth()*0.2, b.getY() - b.getHeight()*0.2,
        b.getWidth() * 1.4, b.getHeight() * 1.6);
    this.worldContext.closePath();
    this.worldContext.clip();

    this.worldContext.lineWidth = 0.5;
    this.worldContext.font = "italic 200 18px/2 Unknown Font, sans-serif";
    var fontWidth = 50;

    this.worldContext.clearRect(b.getX() + b.getWidth()*0.2, b.getY() + b.getHeight()*0.2,
        b.getWidth() * 0.6, b.getHeight() * 0.6);
    this.worldContext.fillStyle = b.getColor();
    this.worldContext.fillRect(b.getX(), b.getY(), b.getWidth(), b.getHeight());

    this.worldContext.fillText(b.getType(), b.getX() + b.getWidth()/2 - fontWidth/2, 
        b.getY() + b.getHeight() * 1.3, fontWidth);

    this.worldContext.strokeStyle = b.getColor();
    this.worldContext.strokeRect(b.getX() - b.getWidth()*0.1, b.getY() - b.getHeight()*0.1,
        b.getWidth() * 1.2, b.getHeight() * 1.2);
    this.worldContext.strokeText(b.getType(), b.getX() + b.getWidth() /2 - fontWidth/2, 
        b.getY() + b.getHeight() * 1.325, fontWidth);
    this.worldContext.restore();
};

EtherEra.JS.ZombieTownEscape.World.prototype.momentRun = function() {
    for (var key in this.movers)
    {
        $.each(this.movers[key], function(index, m) {
            m.setLife(m.getLife() - 1); 
        });
    };
    this.traceRandom();
    this.momentNum++;
};

EtherEra.JS.ZombieTownEscape.World.prototype.traceRandom = function() {
    var i = Math.floor(Math.random() * this.tracers.length);
    this.trace(this.tracers[i]);
};

EtherEra.JS.ZombieTownEscape.World.prototype.trace = function( str ){
    $("div#"+this.divOutputID).html(str);
}

EtherEra.JS.ZombieTownEscape.World.prototype.tracerLoad = function() {
    this.tracers.push("欢迎试玩《EE：僵尸镇逃亡》");
    this.tracers.push("紫色圆圈代表僵尸的啦~，蓝色圆圈代表玩家~");
    this.tracers.push("蓝色圆圈会跟着鼠标移动，游戏目的是躲避紫色圆圈~");
    this.tracers.push("纪元3015年，以太大爆炸后，高辐射使得这个镇上越来越多的人被感染成僵尸~");
    this.tracers.push("游戏作者：NeonLB(LiB)，EMail:neonlight@live.cn~");
    this.tracers.push("有一大波人僵尸正在向你靠近~");
    this.tracers.push("我是一颗菠萝，萝萝萝萝萝萝~");
};

EtherEra.JS.ZombieTownEscape.World.prototype.moveFixed = function(m) {
    var _this = this;
    var m     = arguments[0]?arguments[0]:this.movers["usr"][0];

    var mUsr  = this.movers["usr"][0];
    var vX = mUsr.getX() - m.getX();
    var vY = mUsr.getY() - m.getY();
    if(m != mUsr && Math.sqrt(Math.pow(vX,2) + Math.pow(vY,2)) < m.getSC() * 16)
    {
        if ( Math.abs(Math.sqrt(Math.pow(vX, 2) + Math.pow(vY, 2))) < m.getV() )
        {
            m.setTargetX(mUsr.getX());
            m.setTargetY(mUsr.getY());
        }
        else
            m.movePlan(Math.atan2(vY, vX));
    }

    for (var key in this.movers)
    {
        $.each(this.movers[key], function(index, element) {
            if("zombie" == element.getPK())
            {
                if(Math.sqrt(Math.pow(m.getX()-element.getX(),2) + 
                    Math.pow(m.getY()-element.getY(),2)) < element.getSC() * 4)
                if("survivor" == m.getPK())
                {
                    m.setPK("zombie");
                    _this.movers["zombie"].push(m);
                    _this.delMoverObj("survivor", m);
                    _this.trace("小心！！有一个幸存者变感染！");
                }
                else if("usr" == m.getPK() && 3 < _this.momentNum)
                {
                    _this.gameOver();
                    return false;
                }
            }

            if(m != element && Math.sqrt(Math.pow(m.getTargetX()-element.getTargetX(),2)
              + Math.pow(m.getTargetY()-element.getTargetY(),2)) < element.getSC() * 2)
                m.move(false);
        });
    }

    if(m.getTargetX() == m.getX() && m.getTargetY() == m.getY())
        return;
    if ( m.getTargetX() > this.worldWidth - m.getSC() || m.getTargetX() < 0 + m.getSC() ||
            m.getTargetY() > this.worldHeight - m.getSC() ||  m.getTargetY() < 0 + m.getSC())
        m.move(false);
    else
        m.move(true);
};

EtherEra.JS.ZombieTownEscape.World.prototype.gameOver = function() {
    //alert("你被僵尸啃死了。。。本次存活时间：" + this.momentNum);
    this.trace("你被僵尸啃死了。。。本次存活时间：" + this.momentNum);
    this.start();
};

EtherEra.JS.ZombieTownEscape.Mover = function(x, y, v, angle, sc, life, pk) {
    //var _color = "rgb(" + Math.floor( Math.random()*255 ) + "," + Math.floor( Math.random()*255 ) + "," + Math.floor( Math.random()*255 ) + ")";
    var _x     = arguments[0]?arguments[0]:200;
    var _y     = arguments[1]?arguments[1]:200;
    var _targetX = _x;
    var _targetY = _y;
    var _v     = arguments[2]?arguments[2]:1;
    var _angle = arguments[3]?arguments[3]:Math.random() * 360;
    var _sc    = arguments[4]?arguments[4]:4;
    var _life  = arguments[5]?arguments[5]:100; 
    var _pk    = arguments[6]?arguments[6]:"zombie"; //survivor
    var _color = EtherEra.JS.ZombieTownEscape.Static.moverColor[_pk];

    this.setX = function(value){
        _x = value;
    };
    this.getX = function(){
        return _x;
    };
    this.setY = function(value){
        _y = value;
    };
    this.getY = function(){
        return _y;
    };
    this.setTargetX = function(value){
        _targetX = value;
    };
    this.getTargetX = function(){
        return _targetX;
    };
    this.setTargetY = function(value){
        _targetY = value;
    };
    this.getTargetY = function(){
        return _targetY;
    };

    this.setV = function(value){
        _v = value;
    };
    this.getV = function(){
        return _v;
    };
    this.setDirection = function(value){
        _angle = value;
    };
    this.getDirection = function(){
        return _angle;
    };

    this.setSC = function(value){
        _sc = value;
    };
    this.getSC = function(){
        return _sc;
    };
    this.setLife = function(value){
        _life = value;
    };
    this.getLife = function(){
        return _life;
    };

    this.setPK = function(value){
        _pk    = value;
        _color = EtherEra.JS.ZombieTownEscape.Static.moverColor[_pk];
    };
    this.getPK = function(){
        return _pk;
    };
    this.setColor = function(value){
        _color = value;
    };
    this.getColor = function(){
        return _color;
    };
};

EtherEra.JS.ZombieTownEscape.Mover.prototype.movePlan = function(angle) {
    this.setDirection(arguments[0] ? arguments[0]%Math.PI : 
        Math.random()< 0.95 ? this.getDirection() : 
        (Math.random() * 2*Math.PI - Math.PI));
    var vX = Math.cos(this.getDirection()) * this.getV();
    var vY = Math.sin(this.getDirection()) * this.getV();
    this.setTargetX(this.getTargetX() + vX);
    this.setTargetY(this.getTargetY() + vY);
};

EtherEra.JS.ZombieTownEscape.Mover.prototype.move = function(isMove) {
    isMove = arguments[0] ? arguments[0] : false;
    if(isMove)
    {
        this.setX(this.getTargetX());
        this.setY(this.getTargetY());
    }
    else
    {
        this.setTargetX(this.getX());
        this.setTargetY(this.getY());
    }
};

EtherEra.JS.ZombieTownEscape.Building = function(x, y, w, h, life, type) {
    var _x      = arguments[0]?arguments[0]:200;
    var _y      = arguments[1]?arguments[1]:200;
    var _width  = arguments[2]?arguments[2]:100; 
    var _height = arguments[3]?arguments[3]:100; 
    var _life   = arguments[4]?arguments[4]:100; 
    var _type   = arguments[5]?arguments[5]:"Lab Building";
    var _color = EtherEra.JS.ZombieTownEscape.Static.buildingColor[_type];

    this.setX = function(value){
        _x = value;
    };
    this.getX = function(){
        return _x;
    };
    this.setY = function(value){
        _y = value;
    };
    this.getY = function(){
        return _y;
    };
    this.setWidth = function(value){
        _width = value;
    };
    this.getWidth = function(){
        return _width;
    };
    this.setHeight = function(value){
        _height = value;
    };
    this.getHeight = function(){
        return _height;
    };

    this.setLife = function(value){
        _life = value;
    };
    this.getLife = function(){
        return _life;
    };
    this.setType = function(value){
        _type    = value;
        _color = EtherEra.JS.Static.moverColor[_pk];
    };
    this.getType = function(){
        return _type;
    };
    this.setColor = function(value){
        _color = value;
    };
    this.getColor = function(){
        return _color;
    };
};

EtherEra.JS.ZombieTownEscape.Static = {
    moverColor : {
        "zombie" : "#C71585",
        "survivor" : "#FFD700",
        "usr" : "#191970"
    },

    buildingColor : {
        "Lab Building" : "#C71585",
        "Refuge" : "#FFD700",
        "Airport" : "#191970"
    },

    moverImage : new Array(),

    imageSource : {
        "usr":"images/ZombieTownEscape/usr.png",
        "survivor":"images/ZombieTownEscape/survivor.png",
        "zombie":"images/ZombieTownEscape/zombie.png"
    },

    imgLoader : function() {
        var images = this.moverImage;
        var sources = this.imageSource;
        var loadedImages = 0;
        var numImages = 0;
        for(var src in sources) {
            numImages++;
        }
        for(var src in sources) {
            images[src] = new Image();
            images[src].onload = function() {
                if(++loadedImages >= numImages) {
                    ; //something can be here
                }
            }
            images[src].src = sources[src];
        }
    }
}

//EtherEra.JS.Static = function(){
//var t2 = 2;
//function f1(){};
//function f2(){};
//var re = {
//    a1: xxx,
//    a2: xxx,
//    fn1:function(){},
//    fn2:function(){}
//}
//return  re;
//}()
