/* plus */
function log(s) {
    console.log(s);
}
Array.prototype.remove = function (obj) {
    _do_objs_in_and_after(function (o, i) {
        if (o === obj) {
            objs.splice(i, 1);
            console.log("del:" + i);
            un_select();
            return "break";
        }
    }, function () {

    });
}
var z_index = 0;//叠放顺序

var objs = new Array();
var cp = "";//操作状态
//鼠标位置
var at_x = 0;
var at_y = 0;
var mouse_left_key = false;//默认鼠标左键没有点击
//已悬浮
var on_obj = null;
//已选择
var selected_obj = null;

//触点颜色
var selected_cp_point_color = {
    zs: "#ccc",
    zx: "#ccc",
    ys: "#ccc",
    yx: "#ccc"
};

function _do_objs_in_and_after(in_fn, after_fn) {
    //循环objs 中 执行 in_fn，循环objs完毕后 执行 after_fn


    for (i = 0; i < objs.length; i++) {
        var obj = objs[i];
        if (in_fn(obj, i) === "break") {
            break;
        }

    }
    after_fn(obj);
}
function _do_dao__objs_in_and_after(in_fn, after_fn) {
    //逆向 循环objs 中 执行 in_fn，循环objs完毕后 执行 after_fn


    for (i = objs.length - 1; i > -1; i--) {
        var obj = objs[i];
        if (in_fn(obj, i) === "break") {
            break;
        }

    }
    after_fn(obj);
}
//鼠标坐标
function _is_in(x, y, w, h) {
    if (at_x > x && at_x < x + w && at_y > y && at_y < y + h) {
        return true;
    }
}

function select_obj(obj) {
    _do_objs_in_and_after(function (o) {
        o.select = false;
    }, function () {
        obj.select = true;
        selected_obj = obj;
        cp = "move";

        //选中对象的属性
        document.getElementById("obj_text").setAttribute("class", "hide");
        //边框大小
        if (obj.type === "rect" || obj.type === "text") {
            document.getElementById("obj_border").value = obj.border;
            //边框颜色
            document.getElementById("obj_color_stroke").value = obj.color.stroke;
            //填充颜色
            document.getElementById("obj_color_fill").value = obj.color.fill;

            if (obj.type === "text") {
                document.getElementById("obj_text").value = obj.text;
                document.getElementById("obj_text").removeAttribute("class");
            }
        }


    });
}
function un_select() {

    _do_objs_in_and_after(function (o) {
        o.select = false;
    }, function () {
        selected_obj = null;
    });
}


function renderObj(obj) {
    //渲染 obj

    switch (obj.type) {
        case "rect":
            c.lineWidth = obj.border;
            c.strokeStyle = obj.color.stroke;
            c.fillStyle = obj.color.fill;
            //中心定位法

            c.beginPath();
            c.rect(obj.point.x, obj.point.y, obj.width, obj.height);
            if (obj.border > 0) {
                c.stroke();
            }
            c.fill();
            c.closePath();
            break;
        case "text":
            c.beginPath();
            c.lineWidth = obj.border;
            c.strokeStyle = obj.color.stroke;
            c.fillStyle = obj.color.fill;
            c.font = obj.height + "px Verdana";
            if (obj.border > 0) {
                c.strokeText(obj.text, obj.point.x, obj.point.y + obj.height * 1.05, obj.width);
            }
            c.fillText(obj.text, obj.point.x, obj.point.y + obj.height * 1.05, obj.width);
            c.closePath();
            break;
        case "icon":
            var img = new Image();
            if (obj.imgData != null) {
                c.drawImage(obj.imgData, obj.point.x, obj.point.y, obj.width, obj.height);
            } else {
                img.src = obj.imgSrc;
                img.onload = function () {
                    obj.imgData = img;
                    c.drawImage(img, obj.point.x, obj.point.y, obj.width, obj.height);
                }
            }

        default :

    }


    //悬浮状态
    if (obj.on) {
        c.lineWidth = 2;
        c.strokeStyle = "#f00";
        c.strokeRect(obj.point.x, obj.point.y, obj.width, obj.height);
        //c.strokeRect(obj.point.x-obj.border/2, obj.point.y-obj.border/2, obj.width+obj.border, obj.height+obj.border);

    }
    if (obj.select) {
        c.lineWidth = 2;
        c.strokeStyle = "#ccc";
        c.strokeRect(obj.point.x, obj.point.y, obj.width, obj.height);
        //c.strokeRect(obj.point.x-obj.border/2, obj.point.y-obj.border/2, obj.width+obj.border, obj.height+obj.border);
        //绘制触点

        //左上
        c.fillStyle = selected_cp_point_color.zs;
        c.fillRect(obj.point.x - 4, obj.point.y - 4, 8, 8);

        //左下
        c.fillStyle = selected_cp_point_color.zx;
        c.fillRect(obj.point.x - 4, obj.point.y + obj.height - 4, 8, 8);

        //右上
        c.fillStyle = selected_cp_point_color.ys;
        c.fillRect(obj.point.x + obj.width - 4, obj.point.y - 4, 8, 8);

        //右下
        c.fillStyle = selected_cp_point_color.yx;
        c.fillRect(obj.point.x + obj.width - 4, obj.point.y + obj.height - 4, 8, 8);
    }

}
function render() {
    //清除画板
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle=canvas.getAttribute("data-bgcolor");
    c.fillRect(0, 0, canvas.width, canvas.height);

    //循环 绘制所有元素

    _do_objs_in_and_after(function (obj) {
        renderObj(obj);
    }, function () {
        //循环渲染完毕
        switch (cp) {
            case "over":
                canvas.style.cursor = "pointer";
                break;
            case "move":
                canvas.style.cursor = "move";
                break;
            case "ys":
                canvas.style.cursor = "ne-resize";
                break;
            case "zs":
                canvas.style.cursor = "nw-resize";
                break;
            case "yx":
                canvas.style.cursor = "se-resize";
                break;
            case "zx":
                canvas.style.cursor = "sw-resize";
                break;
            default :
                canvas.style.cursor = "";
        }
    });
}


function _cur() {
    //逆向循环
    _do_dao__objs_in_and_after(function (obj) {
        obj.on = false;
        //在区域内
        if (_is_in(obj.point.x, obj.point.y, obj.width, obj.height)) {
            cha_x = at_x - obj.point.x;
            cha_y = at_y - obj.point.y;


            if (obj === selected_obj) {
                if (selected_obj != null) {
                    cp = "move";
                }
            } else {
                obj.on = true;
                cp = "over";
                on_obj = obj;//悬浮的对象
            }

            return "break";
        } else {
            cp = "out";

            //如果有被选择的
            if (selected_obj) {
                //在4个触点内
                //左上
                selected_cp_point_color = {
                    zs: "#ccc",
                    zx: "#ccc",
                    ys: "#ccc",
                    yx: "#ccc"
                };

                if (_is_in(obj.point.x - 4, obj.point.y - 4, 8, 8)) {
                    console.log("左上");
                    cp = "zs";
                    selected_cp_point_color.zs = "#f00";
                    return "break";
                }
                //左下
                if (_is_in(obj.point.x - 4, obj.point.y + obj.height - 4, 8, 8)) {
                    console.log("左下");
                    cp = "zx";
                    selected_cp_point_color.zx = "#f00";
                    return "break";
                }
                //右上
                if (_is_in(obj.point.x + obj.width - 4, obj.point.y - 4, 8, 8)) {
                    console.log("右上");
                    cp = "ys";
                    selected_cp_point_color.ys = "#f00";
                    return "break";
                }
                //右下
                if (_is_in(obj.point.x + obj.width - 4, obj.point.y + obj.height - 4, 8, 8)) {
                    console.log("右下");
                    cp = "yx";
                    selected_cp_point_color.yx = "#f00";
                    return "break";
                }
            }
        }

    }, function () {
        //selected_obj=null;
        console.log(cp);
    });
}

function begin(width, height) {
    canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    c = canvas.getContext('2d');

    canvas.onmousedown = function () {
        mouse_left_key = true;
    }
    canvas.onmouseup = function () {
        mouse_left_key = false;
    }
    canvas.onmousemove = function () {

        at_x = event.clientX;
        at_y = event.clientY;

        at_x -= (window.innerWidth - canvas.width) / 2;


        if (mouse_left_key) {
            //console.log("tuozhuai...")
            //如果移动的时候，还按着左键。就是拖动
            if (selected_obj != null) {
                //原始的上下左右（当前）
                var zuobian = selected_obj.point.x;
                var youbian = selected_obj.point.x + selected_obj.width;
                var shangbian = selected_obj.point.y;
                var xiabian = selected_obj.point.y + selected_obj.height;

                //如果有已经选择的对象，就拖动对象。
                if (cp === "move") {

                    selected_obj.point.x = at_x - cha_x;
                    selected_obj.point.y = at_y - cha_y;
                }

                if (cp === "zs") {
                    //拖拽左上角
                    selected_obj.point.x = at_x;
                    selected_obj.point.y = at_y;
                    selected_obj.width = youbian - selected_obj.point.x;
                    selected_obj.height = xiabian - at_y;


                }

                if (cp === "zx") {
                    //拖拽左下角
                    console.log("拖拽 左下角...")
                    selected_obj.point.x = at_x;
                    selected_obj.width = youbian - selected_obj.point.x;
                    selected_obj.height = at_y - selected_obj.point.y;
                }
                if (cp === "yx") {
                    //拖拽右下角
                    console.log("拖拽 右下角...")
                    selected_obj.width = at_x - selected_obj.point.x;
                    selected_obj.height = at_y - selected_obj.point.y;
                }
                if (cp === "ys") {
                    //拖拽右上角

                    console.log("拖拽 右上角...")
                    selected_obj.width = at_x - selected_obj.point.x;

                    selected_obj.point.y = at_y;
                    selected_obj.height = xiabian - at_y;

                }
            }
        } else {
            //没有拖拽
            _cur();
        }
    }


    canvas.onclick = function () {
        if (cp === "over") {
            select_obj(on_obj);
        }
        if (cp === "out") {
            un_select();
        }
    }


    window.onkeydown = function () {
        console.log(event.keyCode);
        switch (event.keyCode) {
            case 8:
                if (selected_obj) {
                    objs.remove(selected_obj);
                }
                break;
            default :

        }
    }
    //bind attr
    //边框大小

    document.getElementById("obj_border").addEventListener("change", function () {
        if (selected_obj) {
            selected_obj.border = parseInt(this.value);
        }
    });
    //文本内容
    document.getElementById("obj_text").addEventListener("change", function () {
        if (selected_obj) {
            selected_obj.text = this.value;
        }
    });
    //边框颜色
    document.getElementById("obj_color_stroke").addEventListener("change", function () {
        if (selected_obj) {
            selected_obj.color.stroke = this.value;
        }
    });
    //填充颜色
    document.getElementById("obj_color_fill").addEventListener("change", function () {
        if (selected_obj) {
            selected_obj.color.fill = this.value;
        }
    });
    //bind tools
    document.getElementById("make_a_rect").addEventListener("click", function () {
        z_index += 1;
        var obj_random = {
            on: false,//悬浮状态
            select: false,//被选中状态
            type: "rect",
            point: {x: 0, y: 0},
            width: 50,
            height: 50,
            border: 20,
            color: {fill: "#f00000", stroke: "#000000"},
            text: "text",
            name: "",
            zindex: z_index
        }
        objs.push(obj_random);
        select_obj(obj_random);
    });
    document.getElementById("make_a_text").addEventListener("click", function () {
        z_index += 1;
        var obj_random = {
            on: false,//悬浮状态
            select: false,//被选中状态
            type: "text",
            point: {x: 0, y: 0},
            width: 50,
            height: 50,
            border: 5,
            color: {fill: "#f00000", stroke: "#000000"},
            text: "text",
            name: "",
            zindex: z_index
        }
        objs.push(obj_random);
        select_obj(obj_random);
    });

    var elements = document.getElementsByClassName("element");
    for (i = 0; i < elements.length; i++) {
        var ele = elements[i];
        ele.addEventListener("click", function () {
            z_index += 1;
            var obj_random = {
                on: false,//悬浮状态
                select: false,//被选中状态
                type: "icon",
                imgSrc: "icons/" + this.getAttribute("data-type") + "/" + this.getAttribute("data-src") + ".png",
                imgData: null,
                point: {x: 0, y: 0},
                width: parseInt(this.getAttribute("data-w")),
                height: parseInt(this.getAttribute("data-h")),
                border: 0,
                color: {fill: "#f00000", stroke: "#000000"},
                text: "",
                name: "",
                zindex: z_index
            }
            objs.push(obj_random);
            select_obj(obj_random);
        });
    }

    document.getElementById("toimg").addEventListener("click", function () {
        var img = canvas.toDataURL();
        window.open(img);
    });
    document.getElementById("canvas_bgcolor").addEventListener("change", function () {
        canvas.setAttribute("data-bgcolor",this.value);
    });
    document.getElementById("uploadimg").addEventListener("change", function () {
        var img = new Image();
        var files = event.target.files || event.dataTransfer.files;
        var file = files[0];
        console.log(file);
        if (file) {
            var reader = new FileReader();
            reader.onload = function () {

                img.src = this.result;
                img.onload = function () {
                    var obj_random = {
                        on: false,//悬浮状态
                        select: false,//被选中状态
                        type: "icon",
                        //imgSrc:this.result,
                        imgData: img,
                        point: {x: 0, y: 0},
                        width: img.width,
                        height: img.height,
                        border: 0,
                        color: {fill: "#f00000", stroke: "#000000"},
                        text: "",
                        name: "",
                        zindex: z_index
                    }
                    objs.push(obj_random);
                }
            }
            reader.readAsDataURL(file);
        }
    });
    document.getElementById("canvas").setAttribute("class", "canvas");
    document.getElementById("pan").setAttribute("class", "pan");
    document.getElementById("begin").setAttribute("class", "begin hide");
    setInterval(function () {
        render();
    }, 100);
}

window.onload = function () {
    document.getElementById("begin_800_600").addEventListener("click", function () {
        begin(800, 600);
    });
    document.getElementById("begin_1000_1000").addEventListener("click", function () {
        begin(1000, 1000);
    });
    document.getElementById("begin_500_500").addEventListener("click", function () {
        begin(500, 500);
    });
    document.getElementById("btn_diy").addEventListener("click", function () {
        document.getElementById("begin_1000_1000").setAttribute("class", "hide");
        document.getElementById("begin_800_600").setAttribute("class", "hide");
        document.getElementById("begin_500_500").setAttribute("class", "hide");
        document.getElementById("btn_diy").setAttribute("class", "hide");
        document.getElementById("diy").setAttribute("class", "diy");
    });
    document.getElementById("begin_diy").addEventListener("click", function () {
        var w = document.getElementById("begin_diy_width").value;
        var h = document.getElementById("begin_diy_height").value;
        begin(w, h);
    });
}
