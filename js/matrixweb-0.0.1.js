/*!
 * Matrix Game Web JavaScript Library v0.0.1
 * http://neonlb.github.com/
 *
 * Copyright 2012, neonlb (LiB)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://neonlb.github.com/license
 *
 * Date: Thu Feb 16 21:11:03 2012 -0500
 */
$(document).ready(function(){
  var gSize = 64;
  var mCanvas = new MatrixCanvas("mCanvas",11,16,gSize);
  mCanvas.drawGrids();
  
  loadData(mCanvas)

  //return setInterval(mCanvas.addLogoLink("magicbox.jpg", 1, 1, 2, 2),100);
  $("table#boxtable").hide();
}); 

function MatrixCanvas(mID, mRows,mCols,gSize) {
  this.rows = mRows;
  this.cols = mCols;
  this.size = gSize;
  this.mWidth = mCols*gSize;
  this.mHeight = mRows*gSize;
  this.drivers = new Array();
  this.divID = mID+"DIV";
  $("<div>").attr("id",this.divID).attr("width",this.mWidth).attr("height",this.mHeight).width(this.mWidth).height(this.mHeight).css("border","1px solid #000").css("margin","20px auto auto auto").css("display","block").css("position","relative").html("").appendTo(document.body);
  $("<canvas>").attr("id",mID).attr("width",this.mWidth).attr("height",this.mHeight).width(this.mWidth).height(this.mHeight).css("border","0px solid #000").css("margin","auto auto auto auto").css("display","block").html("Your browser does not support the canvas element.").appendTo($("div#"+this.divID));
  //this.mCanvas = document.getElementById(mID);
  this.mCanvas = $("canvas#"+mID)[0];
  this.mContext= this.mCanvas.getContext("2d");
};

MatrixCanvas.prototype.drawGrids = function() {
  this.mContext.fillStyle = "#98bf21";
  this.mContext.lineWidth = 0.5;
  this.mContext.strokeStyle = "#98bf21";
  for(var i=0; i<this.rows; i++)
  {
	  for(var j=0; j<this.cols; j++)
	  {
		  this.mContext.fillStyle = this.getRandomColor();
		  this.mContext.fillRect(this.size*j,this.size*i,this.size,this.size);
		  this.mContext.strokeRect(this.size*j,this.size*i,this.size,this.size);
	  }
  }
};

MatrixCanvas.prototype.getRandomColor = function() {
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

MatrixCanvas.prototype.addLogoLink = function(id, img, sx, sy, sw, sh, url) {
    //var img_elem=new Image();
	//img_elem.src=img;
	//img_elem.onload = this.loadImage(img_elem, sx * this.size, sy * this.size, sw * this.size, sh * this.size);
	//$("img").load(this.loadImage(img_elem, sx, sy, sw, sh));
	var jobjDiv = $("div#"+this.divID);
	$("<a>").attr("id",id).attr("href",url).attr("target","_blank")
			.html("").appendTo(jobjDiv);
	$("<img>").attr("src", img).attr("alt", id)
			  .attr("width",sw * this.size).attr("height",sh * this.size)
			  .width(sw * this.size).height(sh * this.size)
			  .css("position","absolute").css("left", sx * this.size)
			  .css("top",sy * this.size).css("border", "1px black solid").html("iamge....")
			  //.css("top",jobjDiv.position().top + sy * this.size).html("iamge....")
			  .appendTo($("a#"+id));
};
MatrixCanvas.prototype.loadImage = function(img, sx, sy, sw, sh) {
	this.mContext.drawImage(img, sx, sy, sw, sh);
alert(img.src);
};


function loadData(canvas) {
var size = 64;
var logoLinks = [
{ "id":"title1" , "img":"images/title1.jpg" , "x":64*0/size , "y":64*0/size , "width":64*6/size , "height":64*4/size , "url":"#"  },
{ "id":"title2" , "img":"images/title2.jpg" , "x":64*6/size , "y":64*0/size , "width":64*6/size , "height":64*4/size , "url":"#"  },
{ "id":"title3" , "img":"images/title3.jpg" , "x":64*12/size , "y":64*0/size , "width":64*4/size , "height":64*4/size , "url":"#"  },
{ "id":"github_neonlb" , "img":"images/github_neonlb.jpg" , "x":64*1/size , "y":64*5/size , "width":64*2/size , "height":64*2/size , "url":"https://github.com/lbneon"  },
{ "id":"csdn_blog" , "img":"images/csdn_blog.jpg" , "x":64*1/size , "y":64*7/size , "width":64*2/size , "height":64*1/size , "url":"http://blog.csdn.net/neonlight"  },
{ "id":"cnblogs_blog" , "img":"images/cnblogs_blog.jpg" , "x":64*1/size , "y":64*8/size , "width":64*2/size , "height":64*1/size , "url":"http://www.cnblogs.com/neonlight/"  },
{ "id":"sina_blog" , "img":"images/sina_blog.jpg" , "x":64*1/size , "y":64*9/size , "width":64*2/size , "height":64*1/size , "url":"http://blog.sina.com.cn/neonlb"  },
{ "id":"github_d3l" , "img":"images/github_d3l.jpg" , "x":64*3/size , "y":64*5/size , "width":64*2/size , "height":64*1/size , "url":"https://github.com/lbneon/D3L/wiki"  },
{ "id":"eess" , "img":"images/eess_logo.jpg" , "x":64*3/size , "y":64*6/size , "width":64*2/size , "height":64*2/size , "url":"http://lbneon.github.com/EE_SnakeStrategy"  },
{ "id":"xiaobai" , "img":"images/xiaobai.jpg" , "x":64*12/size , "y":64*5/size , "width":64*2/size , "height":64*2/size , "url":"#"  },
{ "id":"magicbox" , "img":"images/magicbox.jpg" , "x":64*13/size , "y":64*9/size , "width":64*1/size , "height":64*1/size , "url":"magicbox.html"  }
];

$.each(logoLinks, function(index, link) {
	 canvas.addLogoLink(link.id, link.img, link.x, link.y, link.width, link.height, link.url);
});
};