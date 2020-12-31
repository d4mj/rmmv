//作者:第四梦境
Scene_Boot.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Scene_Map);
    } else {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_CANVAS);
        Window_TitleCommand.initCommandPosition();
    } 
    this.updateDocumentTitle();
};

function Scene_CANVAS() {
    this.initialize.apply(this, arguments);
}

Scene_CANVAS.prototype = Object.create(Scene_Base.prototype);

Scene_CANVAS.prototype.constructor = Scene_CANVAS;

Scene_CANVAS.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_CANVAS.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
	this._OBBEidtWindow = new Window_CANVAS(0, 0, SceneManager._screenWidth, SceneManager._screenHeight);
    this.addChild(this._OBBEidtWindow);
	this._OBBEidtWindow.opacity = 0;
	
};

Scene_CANVAS.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
};

Scene_CANVAS.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
};



function Window_CANVAS() {
    this.initialize.apply(this, arguments);
	this.initMembers();
}

Window_CANVAS.prototype = Object.create(Window_Base.prototype);
Window_CANVAS.prototype.constructor = Window_CANVAS;

Window_CANVAS.prototype.initMembers = function() {
	this.ctx = this.contents.canvas.getContext('2d');
	//0:黑、1:红、2:绿、3:蓝、4:黄、5:紫、6:白
	this.color = [[10,20,30],[250,0,0],[0,250,0],[0,0,250],[250,200,0],[250,0,250],[250,250,250]];
	
	//是否按下、按下类型、附带信息
	this.csdx = {"isp":false,"lx":"","fdxx":[]};
	//是否有魔方面正在旋转
	this.isrf = false;
	//剩余需要旋转的角度
	this.hxxzd = 0;
	//魔方面旋转轴
	this.mxzz = [0,0,0];
	//需要旋转的魔方面
	this.mfms = [];
	//魔方面旋转方向
	this.mfxf = 0;
	
	this.initMCcolor();
	this.createAMCubes(408,312,480,32);
};

Window_CANVAS.prototype.standardPadding = function() {
    return 0;
};

//设置魔方六个面的颜色
Window_CANVAS.prototype.initMCcolor = function() {
	this.MCcolors = [
	[
	[[1,0,0,4,2,0],[1,0,0,0,2,0],[1,6,0,0,2,0]],
	[[1,0,0,4,0,0],[1,0,0,0,0,0],[1,6,0,0,0,0]],
	[[1,0,0,4,0,3],[1,0,0,0,0,3],[1,6,0,0,0,3]]
	],
	[
	[[0,0,0,4,2,0],[0,0,0,0,2,0],[0,6,0,0,2,0]],
	[[0,0,0,4,0,0],[0,0,0,0,0,0],[0,6,0,0,0,0]],
	[[0,0,0,4,0,3],[0,0,0,0,0,3],[0,6,0,0,0,3]]
	],
	[
	[[0,0,5,4,2,0],[0,0,5,0,2,0],[0,6,5,0,2,0]],
	[[0,0,5,4,0,0],[0,0,5,0,0,0],[0,6,5,0,0,0]],
	[[0,0,5,4,0,3],[0,0,5,0,0,3],[0,6,5,0,0,3]]
	]
	];
};

Window_CANVAS.prototype.update = function() {
	Window_Base.prototype.update.call(this);
	this.contents.clear();
	//this.htsdcs();
	this.drawAllMC();
};

//
Window_CANVAS.prototype.htsdcs = function() {
	//this.tz = this.tz || 480 || 312; //this.tz += 1;
	this.p1 = this.p1 || [408-100,312-100,480];
	this.p2 = this.p2 || [408-100,312+100,480];
	this.p3 = this.p3 || [408+100,312+100,480];
	
	var p1 = this.p1,p2 = this.p2,p3 = this.p3;
	this.p1 = Poi.rVec(0.01,[408,312,480],[0,0,1],p1);
	this.p2 = Poi.rVec(0.01,[408,312,480],[0,0,1],p2);
	this.p3 = Poi.rVec(0.01,[408,312,480],[0,0,1],p3);
	var tp = [Poi.getPjet(816,624,312,this.p1),Poi.getPjet(816,624,312,this.p2),Poi.getPjet(816,624,312,this.p3)];
	Bitmap.drawPolygon(this.ctx,[tp[0],tp[1],tp[2]]);
	
}

//绘制所有魔方立方体
Window_CANVAS.prototype.drawAllMC = function() {
	
	//旋转魔方测试
	/*for (var i = 0; i < 27; i++) {
		var cc = this.MCubes[i].cube;
		for (var j = 0; j < 8; j++) {
			this.MCubes[i].cube.vartex[j] = Poi.rVec(0.01,[408,312,480],[1,1,1],this.MCubes[i].cube.vartex[j]);
		}
	}*/
	this.updateRotate();
	
	
	this.updateInput();
	
	
	
	//按照面的前后顺序渲染所有面
	var acf = this.getAllCRFaPX();
	for (var i = 0; i < acf.length; i++) {
		Bitmap.drawPolygon(this.ctx,[
			Poi.getPjet(816,624,312,acf[i][2].vartex[acf[i][0][0]]),
			Poi.getPjet(816,624,312,acf[i][2].vartex[acf[i][0][1]]),
			Poi.getPjet(816,624,312,acf[i][2].vartex[acf[i][0][3]]),
			Poi.getPjet(816,624,312,acf[i][2].vartex[acf[i][0][2]])],
			'rgb('+
			this.color[acf[i][2].color[acf[i][1]]][0]+','+
			this.color[acf[i][2].color[acf[i][1]]][1]+','+
			this.color[acf[i][2].color[acf[i][1]]][2]+')'
			);
	}
}

//更新旋转
Window_CANVAS.prototype.updateRotate = function() {
	if (this.isrf) {
		for (var i = 0; i < this.mfms.length; i++) {
			var cc = this.mfms[i];
			for (var j = 0; j < 8; j++) {
				cc.vartex[j] = Poi.rVec(Math.PI / 32 * this.mfxf,this.MCXYZ,this.mxzz,cc.vartex[j]);
		    }
	    }
		this.hxxzd--;
		if (this.hxxzd <= 0) {
			this.mfDDFW();
			this.isrf = false;
			this.hxxzd = 0;
			this.mxzz = [0,0,0];
			this.mfms = [];
			this.mfxf = 0;
		}
	}
}

//魔方面抖动复位
Window_CANVAS.prototype.mfDDFW = function() {
	for (var i = 0; i < this.mfms.length; i++) {
			var cc = this.mfms[i];
			//立方体到魔方中心向量
			var ccs = Vec3.Sub(this.mfms[i].getCenter(),this.MCXYZ);
			//求立方体边长
			var bl = Math.sqrt(Math.pow(cc.vartex[1][0]-cc.vartex[0][0],2)+Math.pow(cc.vartex[1][1]-cc.vartex[0][1],2)+Math.pow(cc.vartex[1][2]-cc.vartex[0][2],2));
			//求立方体到魔方中心距离
			//var ccd = Math.sqrt(Math.pow(ccs[0],2)+Math.pow(ccs[1],2)+Math.pow(ccs[2],2));
			
			var tyx = Vec3.Dot(this.mfzbz[0],ccs);
			var tyy = Vec3.Dot(this.mfzbz[1],ccs);
			var tyz = Vec3.Dot(this.mfzbz[2],ccs);
			
			var xf = tyx > bl / 2 ? 1 : tyx < -bl / 2 ? -1 : 0;
			var yf = tyy > bl / 2 ? 1 : tyy < -bl / 2 ? -1 : 0;
			var zf = tyz > bl / 2 ? 1 : tyz < -bl / 2 ? -1 : 0;
			
			//var rzxdf = Vec3.Normalize([xf,yf,zf]);
			
			//求立方体真正中心点xyz分向量
			var rtyx = [bl*xf*this.mfzbz[0][0],bl*xf*this.mfzbz[0][1],bl*xf*this.mfzbz[0][2]];
			var rtyy = [bl*yf*this.mfzbz[1][0],bl*yf*this.mfzbz[1][1],bl*yf*this.mfzbz[1][2]];
			var rtyz = [bl*zf*this.mfzbz[2][0],bl*zf*this.mfzbz[2][1],bl*zf*this.mfzbz[2][2]];
			
			//获取立方体真正中心点向量
			var rzxd = [rtyx[0]+rtyy[0]+rtyz[0],rtyx[1]+rtyy[1]+rtyz[1],rtyx[2]+rtyy[2]+rtyz[2]];
			
			//获取立方体中心点到真正中心点偏移
			var zxpyx = ccs[0] - rzxd[0];
			var zxpyy = ccs[1] - rzxd[1];
			var zxpyz = ccs[2] - rzxd[2]; 
			
			//if (Math.abs(zxpyx) < 0.02 && Math.abs(zxpyy) < 0.02 && Math.abs(zxpyz) < 0.02) return;
			
			for (var j = 0; j < 8; j++) {
				
				cc.vartex[j][0] -= zxpyx;
				cc.vartex[j][1] -= zxpyy;
				cc.vartex[j][2] -= zxpyz;
				
				//和上面步骤一样，求出立方体各顶点真正坐标
				var pcs = Vec3.Sub(cc.vartex[j],[rzxd[0]+this.MCXYZ[0],rzxd[1]+this.MCXYZ[1],rzxd[2]+this.MCXYZ[2]]);
				
				var ptyx = Vec3.Dot(this.mfzbz[0],pcs);
				var ptyy = Vec3.Dot(this.mfzbz[1],pcs);
				var ptyz = Vec3.Dot(this.mfzbz[2],pcs);
				
				var bll = bl / 2;
				var pxf = ptyx > bl / 4 ? 1 : ptyx < -bl / 4 ? -1 : 0;
				var pyf = ptyy > bl / 4 ? 1 : ptyy < -bl / 4 ? -1 : 0;
				var pzf = ptyz > bl / 4 ? 1 : ptyz < -bl / 4 ? -1 : 0;
				
				var prtyx = [bll*pxf*this.mfzbz[0][0],bll*pxf*this.mfzbz[0][1],bll*pxf*this.mfzbz[0][2]];
				var prtyy = [bll*pyf*this.mfzbz[1][0],bll*pyf*this.mfzbz[1][1],bll*pyf*this.mfzbz[1][2]];
				var prtyz = [bll*pzf*this.mfzbz[2][0],bll*pzf*this.mfzbz[2][1],bll*pzf*this.mfzbz[2][2]];
			
			    var przxd = [prtyx[0]+prtyy[0]+prtyz[0],prtyx[1]+prtyy[1]+prtyz[1],prtyx[2]+prtyy[2]+prtyz[2]];
				
				var pzxpyx = pcs[0] - przxd[0];
				var pzxpyy = pcs[1] - przxd[1];
				var pzxpyz = pcs[2] - przxd[2]; 
				
				cc.vartex[j][0] -= pzxpyx;
				cc.vartex[j][1] -= pzxpyy;
				cc.vartex[j][2] -= pzxpyz;
				
		    }
	    }
}

//更新输入
Window_CANVAS.prototype.updateInput = function() {
	//当左键按下
	if (TouchInput.isTriggered()) {
		if (this.isrf) return;
		this.csdx.isp = true;
		this.csdx.lx = "mm";
		this.csdx.fdxx = [TouchInput._x,TouchInput._y,312];
		var acf = this.getAllCRFaPX();
		for (var i = acf.length - 1; i >= 0; i--) {
			if (this.isPointInQua([
			Poi.getPjet(816,624,312,acf[i][2].vartex[acf[i][0][0]]),
			Poi.getPjet(816,624,312,acf[i][2].vartex[acf[i][0][1]]),
			Poi.getPjet(816,624,312,acf[i][2].vartex[acf[i][0][3]]),
			Poi.getPjet(816,624,312,acf[i][2].vartex[acf[i][0][2]])],
			[TouchInput._x,TouchInput._y,312])) {
				this.csdx.lx = "mf";
				this.csdx.fdxx = [
				[TouchInput._x,TouchInput._y,312],
				acf[i][2].vartex[acf[i][0][0]],
				acf[i][2].vartex[acf[i][0][1]],
				acf[i][2].vartex[acf[i][0][2]],
				acf[i][2].getCenter()
				];
				
				//测试立方体中心旋转
				/* var ac = acf[i][2].getCenter()
				for (var j = 0; j < 8; j++) {
					acf[i][2].vartex[j] = Poi.rVec(0.1,ac,[0,0,1],acf[i][2].vartex[j]);
		        }console.log(acf[i][2].getCenter()) */
			
				break;
			}
			
	    }
		//console.log(this.csdx.lx);
	}
	
	//当鼠标移动
	if (TouchInput.isMoved()) {
		if (this.csdx.isp && this.csdx.lx == "mm") {
			//获取垂直向量:x,y垂直向量-y,x
			var czxl = [-(TouchInput._y - this.csdx.fdxx[1]),(TouchInput._x - this.csdx.fdxx[0]),0];
			
			var l = -Math.sqrt(Math.pow(TouchInput._x - this.csdx.fdxx[0],2) + Math.pow(TouchInput._y - this.csdx.fdxx[1],2));
			for (var i = 0; i < 27; i++) {
				var cc = this.MCubes[i].cube;
				for (var j = 0; j < 8; j++) {
					this.MCubes[i].cube.vartex[j] = Poi.rVec(l / 157,this.MCXYZ,czxl,this.MCubes[i].cube.vartex[j]);
				}
			}
			this.mfzbz[0] =  Poi.rVec(l / 157,[0,0,0],czxl,this.mfzbz[0]);
			this.mfzbz[1] =  Poi.rVec(l / 157,[0,0,0],czxl,this.mfzbz[1]);
			this.mfzbz[2] =  Poi.rVec(l / 157,[0,0,0],czxl,this.mfzbz[2]);
			
			this.csdx.fdxx = [TouchInput._x,TouchInput._y,312];
		}
	}
			
	//当左键抬起
	if (TouchInput.isReleased()) {
		if (this.csdx.lx == "mf") {
			//鼠标向量
		    var sbxl = [TouchInput._x - this.csdx.fdxx[0][0],TouchInput._y - this.csdx.fdxx[0][1],0];
			if (Math.pow(sbxl[0],2) + Math.pow(sbxl[1],2) > 16) {
				var v1 = Vec3.Sub(Poi.getPjet(816,624,312,this.csdx.fdxx[2]),Poi.getPjet(816,624,312,this.csdx.fdxx[1]));
				var v2 = Vec3.Sub(Poi.getPjet(816,624,312,this.csdx.fdxx[3]),Poi.getPjet(816,624,312,this.csdx.fdxx[1]));
				//投影值小的为旋转轴
				if (Math.abs(Vec3.Dot(v1,sbxl)) > Math.abs(Vec3.Dot(v2,sbxl))) {
					this.mxzz = Vec3.Sub(this.csdx.fdxx[3],this.csdx.fdxx[1]);
				} else {
					this.mxzz = Vec3.Sub(this.csdx.fdxx[2],this.csdx.fdxx[1]);
				}
				//旋转轴向量规范化
				this.mxzz = Vec3.Normalize(this.mxzz);
				//求旋转轴的垂直向量，根据该垂直向量可以求出沿鼠标旋转方向
				var tyz = [-this.mxzz[1],this.mxzz[0],0];
				this.mfxf = Vec3.Dot(tyz,sbxl) > 0 ? 1 : -1;
				this.hxxzd = 16;
				this.isrf = true;
				this.mfms = [];
				//添加与所选立方体中心点到旋转轴距离相等的立方体
				console.log('yty:'+Vec3.Dot(this.csdx.fdxx[4],this.mxzz));
				
				var tmc = this.MCubes;
				
				//查找与所选立方体中心点到旋转轴距离最近的九个立方体
				for (var i = 27; i > 0; i--) {
					for (var j = 0; j < i - 1; j++) {
						var jf = Vec3.Dot(tmc[j].cube.getCenter(),this.mxzz);
						var j1f = Vec3.Dot(tmc[j+1].cube.getCenter(),this.mxzz);
						if (Math.abs(Vec3.Dot(this.csdx.fdxx[4],this.mxzz) - jf) > Math.abs(Vec3.Dot(this.csdx.fdxx[4],this.mxzz) - j1f)) {
							var tcj = tmc[j];
							tmc[j] = tmc[j+1];
							tmc[j+1] = tcj;
						}
					}
				}
				
				for (var i = 0; i < 9; i++) {
					this.mfms.push(tmc[i].cube);
			    } 
				
				/* for (var i = 0; i < 27; i++) {
					var cc = this.MCubes[i].cube.getCenter();
					console.log(i+':'+Vec3.Dot(cc,this.mxzz));
					if (Math.abs(Vec3.Dot(this.csdx.fdxx[4],this.mxzz) - Vec3.Dot(cc,this.mxzz)) < 4) {
						this.mfms.push(this.MCubes[i].cube);
					}
			    } */
			}
		}
		
		
		this.csdx.isp = false;
		this.csdx.lx = "";
		this.csdx.fdxx = [];
	}
};

//获取所有可以渲染的面并排序
Window_CANVAS.prototype.getAllCRFaPX = function() {
	var crfs = [];
	for (var i = 0; i < 27; i++) {
		//获取一个立方体所有可渲染的面
		var tcrfs = this.MCubes[i].cube.getCanRenderFace();
		for (var j = 0; j < tcrfs.length; j++) {
			crfs.push(tcrfs[j]);
		}
	}
	
	//冒泡排序算法
	for (var i = crfs.length; i > 0; i--) {
		for (j = 0; j < i - 1; j++) {
			var jf = [
			(crfs[j][2].vartex[crfs[j][0][0]][0]+crfs[j][2].vartex[crfs[j][0][3]][0])/2,
			(crfs[j][2].vartex[crfs[j][0][0]][1]+crfs[j][2].vartex[crfs[j][0][3]][1])/2,
			(crfs[j][2].vartex[crfs[j][0][0]][2]+crfs[j][2].vartex[crfs[j][0][3]][2])/2];
			
			var j1f = [
			(crfs[j + 1][2].vartex[crfs[j + 1][0][0]][0]+crfs[j + 1][2].vartex[crfs[j + 1][0][3]][0])/2,
			(crfs[j + 1][2].vartex[crfs[j + 1][0][0]][1]+crfs[j + 1][2].vartex[crfs[j + 1][0][3]][1])/2,
			(crfs[j + 1][2].vartex[crfs[j + 1][0][0]][2]+crfs[j + 1][2].vartex[crfs[j + 1][0][3]][2])/2];
			
			if (jf[2] < j1f[2]) {
				var tcj = crfs[j];
				crfs[j] = crfs[j+1];
				crfs[j+1] = tcj;
			}
		}
	}
	
	return crfs;
}

//创建所有魔方立方体
Window_CANVAS.prototype.createAMCubes = function(x,y,z,r) {
	this.MCubes = [];
	this.MCXYZ = [x,y,z];
	//建立魔方坐标轴
	this.mfzbz = [[1,0,0],[0,1,0],[0,0,1]];
	
	var zi = [-1,0,1];
	var yj = [-1,0,1];
	var xk = [-1,0,1];
	
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			for (var k = 0; k < 3; k++) {
				this.MCubes.push(new MCube(x + 2 * r * xk[k],y + 2 * r * yj[j],z + 2 * r * zi[i],r,[i,j,k],this.MCcolors[i][j][k]));
			}
		}
	}
}

//判断点在四边形内
Window_CANVAS.prototype.isPointInQua = function(q,p) {
	//声明方向、边向量、点向量
	var f; var bv,pv;
	
	bv = Vec3.Sub(q[1],q[0]);pv = Vec3.Sub(p,q[0]);
	f = v2Cross(bv,pv);//console.log(f);
	if (f <= 0) return false;
	
	bv = Vec3.Sub(q[2],q[1]);pv = Vec3.Sub(p,q[1]);
	f = v2Cross(bv,pv);//console.log(f);
	if (f <= 0) return false;
	
	bv = Vec3.Sub(q[3],q[2]);pv = Vec3.Sub(p,q[2]);
	f = v2Cross(bv,pv);//console.log(f);
	if (f <= 0) return false;
	
	bv = Vec3.Sub(q[0],q[3]);pv = Vec3.Sub(p,q[3]);
	f = v2Cross(bv,pv);//console.log(f);
	if (f <= 0) return false;
	
	return true;
}

//魔方立方体
function MCube(x,y,z,r,i,color) {
	this.index = [i[0],i[1],i[2]];
	this.cube = new Cube(x,y,z,r,color);
}

//绘制多边形
Bitmap.drawPolygon = function(ctx,bs,fc) {
	ctx.beginPath();
	ctx.strokeStyle = 'rgb(0,0,0)';
	ctx.moveTo(bs[0][0] || 0,bs[0][1] || 0);
	for (var i = 1; i < bs.length; i++) {
		ctx.lineTo(bs[i][0],bs[i][1]);
	}
	ctx.lineTo(bs[0][0],bs[0][1]);
	ctx.fillStyle = fc || 'rgba(250,250,0,1)';
	ctx.closePath();
	ctx.fill();
	ctx.stroke(); 
}

//3维向量
function Vec3(){
	
}

//3维向量叉乘  
Vec3.Cross = function(v1,v2) {
	return [v1[1] * v2[2] - v1[2]*v2[1],v1[2] * v2[0] - v1[0]*v2[2],v1[0] * v2[1] - v1[1]*v2[0]];
};

//2维向量叉积
v2Cross = function(v1,v2) {
	return v1[0]*v2[1] - v1[1]*v2[0];
};

//3维向量点乘
Vec3.Dot = function(v1,v2) {
	return v1[0] * v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
};

//3维向量规范化
Vec3.Normalize = function(v) {
	var len = Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2) + Math.pow(v[2],2));
	return len > 0.000001 ? [v[0] / len, v[1] / len, v[2] / len] : [0, 0, 0];
};

//3维向量相减
Vec3.Sub = function(v1,v2) {
	return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
};

//3维向量相加
Vec3.Add = function(v1,v2) {
	return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
};

function Poi() {
	
}

//获取点在屏幕上的投影：长、宽、屏幕距摄像机距离、点坐标
Poi.getPjet = function(h, w, n, p) {
	var tp = [0,0,n];
	var bh = h / 2; var bw = w / 2;
	
	//摄像机位置
	var sx = (h - 1) / 2; var sy = (w - 1) / 2; 
	
	//长近比、宽近比
	var hnb = bh / n; var wnb = bw / n;
	
	//点所在矩形长宽
	//var ph = (n + p[2]) * hnb; var pw = (n + p[2]) * wnb;
	
	//点所在矩形长宽与屏幕长宽比
	//var phhb = ph / h; var pwwb = pw / w;
	
	//点所在矩形与屏幕比
	var zpb = n / (n + p[2]);
	
	//计算点在屏幕的xy坐标
	tp[0] = (p[0] - sx) * zpb + sx; tp[1] = (p[1] - sy) * zpb + sy;
	return tp;
}

//点绕向量旋转:旋转角度、向量的起始点、向量方向、被旋转点坐标
Poi.rVec = function(r,m,v,p) {
	//向量规范化
	v = Vec3.Normalize(v);
	
	var c = Math.cos(r); var s = Math.sin(r);
	
	//计算偏移
	p[0] = p[0] - m[0];p[1] = p[1] - m[1];p[2] = p[2] - m[2];
	
	//获取点旋转后坐标
	var nx = (v[0]*v[0]*(1-c)+c)*p[0] + (v[0]*v[1]*(1-c)-v[2]*s)*p[1] + (v[0]*v[2]*(1-c)+v[1]*s)*p[2];
	var ny = (v[0]*v[1]*(1-c)+v[2]*s)*p[0] + (v[1]*v[1]*(1-c)+c)*p[1] + (v[1]*v[2]*(1-c)-v[0]*s)*p[2];
	var nz = (v[0]*v[2]*(1-c)-v[1]*s)*p[0] + (v[1]*v[2]*(1-c)+v[0]*s)*p[1] + (v[2]*v[2]*(1-c)+c)*p[2];
	
	nx = nx + m[0]; ny = ny + m[1]; nz = nz + m[2];
	
	return [nx,ny,nz];
}

//立方体
function Cube(x,y,z,r,color) {
	
	//坐标轴向量
	//this.AVEC = [[1,0,0],[0,1,0],[0,0,1]];
	
	//设置立方体的八个顶点
	this.vartex = [[x - r,y - r,z - r],[x + r,y - r,z - r],[x - r,y + r,z - r],[x + r,y + r,z - r],
	               [x - r,y - r,z + r],[x + r,y - r,z + r],[x - r,y + r,z + r],[x + r,y + r,z + r]];
	
    //设置立方体的六个面	
	this.surface = [[0,1,2,3],[1,5,3,7],[5,4,7,6],[4,0,6,2],[0,4,1,5],[2,3,6,7]];
				   
    this.color = color || [1,2,3,4,5,6];
}

//获取立方体的中心点
Cube.prototype.getCenter = function() {
	var x = 0, y = 0, z = 0;
	for (var i = 0; i < 8; i++) {
		x += this.vartex[i][0];
		y += this.vartex[i][1];
		z += this.vartex[i][2];
	}
	//return [x / 8, y / 8, z / 8];
	return [(this.vartex[0][0]+this.vartex[7][0])/2,(this.vartex[0][1]+this.vartex[7][1])/2,(this.vartex[0][2]+this.vartex[7][2])/2];
}

//获取立方体某一面的中心点
Cube.prototype.getFCenter = function(i) {
	var fi = this.surface[i];
	return [(this.vartex[fi[0]][0]+this.vartex[fi[3]][0])/2,(this.vartex[fi[0]][1]+this.vartex[fi[3]][1])/2,(this.vartex[fi[0]][2]+this.vartex[fi[3]][2])/2];
}

//获取立方体可渲染面
Cube.prototype.getCanRenderFace = function() {
	//找到距离屏幕最远的点,面上存在一个距离屏幕最远点的面无需渲染
	var maxz = Math.max(this.vartex[0][2],this.vartex[1][2],this.vartex[2][2],this.vartex[3][2],
	                    this.vartex[4][2],this.vartex[5][2],this.vartex[6][2],this.vartex[7][2]);
						
	var crf = [];
	for (var i = 0; i < 6; i++) {
		if (this.vartex[this.surface[i][0]][2] == maxz ||
		    this.vartex[this.surface[i][1]][2] == maxz ||
		    this.vartex[this.surface[i][2]][2] == maxz ||
		    this.vartex[this.surface[i][3]][2] == maxz ) {
			
		} else {
			crf.push([this.surface[i],i,this]);
		}
	}
	
	return crf;
}

//alert((new Cube(0,0,0,4)).getFCenter(0));

