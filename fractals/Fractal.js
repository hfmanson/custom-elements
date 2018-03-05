"use strict";

var gwgraphic =  function () {
    var ctx
        , cx
        , cy
        , sx
        , sy
        , width
        , height
        , imageDataObject
        , bgColors
        , fgColors
        , parseCss = /#([0-9A-Za-z]{2})([0-9A-Za-z]{2})([0-9A-Za-z]{2})/
        , createImageData = function ()
        {
            // Not all browsers implement createImageData. On such browsers we obtain the
            // ImageData object using the getImageData method. The worst-case scenario is
            // to create an object *similar* to the ImageData object and hope for the best
            // luck.
            var i;
            if (ctx.createImageData) {
                imageDataObject = ctx.createImageData(width, height);
            } else if (ctx.getImageData) {
                imageDataObject = ctx.getImageData(0, 0, width, height);
            } else {
                imageDataObject = {'width' : width, 'height' : height, 'data' : new Array(width * height * 4)};
            }
            for (i = 0; i < imageDataObject.data.length; i += 4)
            {
                imageDataObject.data[i] = bgColors.r;     // R
                imageDataObject.data[i + 1] = bgColors.g; // G
                imageDataObject.data[i + 2] = bgColors.b; // B
                imageDataObject.data[i + 3] = 255;
            }
        }
        , getColors = function (csscolor) {
            var colors = parseCss.exec(csscolor);
            return { r: parseInt(colors[1], 16), g: parseInt(colors[2], 16), b: parseInt(colors[3], 16) };
        }
        , that = {
            fgColor: function (fgcolor) {
                if (fgcolor) {
                    ctx.strokeStyle = fgcolor;
                    fgColors = getColors(ctx.strokeStyle);
                }
            },
            window: function (canvas, bgcolor, fgcolor, dim) {
                width = canvas.width;
                height = canvas.height;
                ctx = canvas.getContext("2d");
                ctx.fillStyle = bgcolor;
                bgColors = getColors(ctx.fillStyle);
                ctx.fillRect(0, 0, width, height);
                ctx.translate(0.5, 0.5);
                that.fgColor(fgcolor);
                createImageData(ctx, width, height);
                sx = width / (dim.rx - dim.lx);
                cx = -dim.lx * sx;
                sy = height / (dim.ty - dim.by);
                cy = -dim.by * sy;
            },
            beginPath: function () {
                ctx.beginPath();
            },
            stroke: function () {
                ctx.stroke();
            },
            move: function (x, y) {
                var dx, dy;

                dx = (cx + sx * x);
                dy = (cy + sy * y);
                ctx.moveTo(dx, dy);
            },
            draw: function (x, y) {
                var dx, dy;

                dx = (cx + sx * x);
                dy = (cy + sy * y);
                ctx.lineTo(dx, dy);
            },
            pset: function(x, y) {
                x = (cx + sx * x) | 0;
                y = (cy + sy * y) | 0;
                if (x >= 0 && x < width && y >= 0 && y < height)
                {
                        var i = 4 * (width * y + x);
                        imageDataObject.data[i] = fgColors.r;     // R
                        imageDataObject.data[i + 1] = fgColors.g; // G
                        imageDataObject.data[i + 2] = fgColors.b; // B
                }
            },
            render: function()
            {
                ctx.putImageData(imageDataObject, 0, 0);
            }
        }
        ;
    return that;
};
var kronkel = function() {
    var that = gwgraphic()
        , f = function (n, m, x1, y1, x2, y2) {
            var nx1, ny1, nx2, ny2, i;

            if (n > 0)
            {
                nx1 = x1;
                ny1 = y1;
                for (i = 0; i < m.length; i++)
                {
                    nx2 = (x2 - x1) * m[i].x - (y2 - y1) * m[i].y + x1;
                    ny2 = (y2 - y1) * m[i].x + (x2 - x1) * m[i].y + y1;
                    f(n - 1, m, nx1, ny1, nx2, ny2);
                    nx1 = nx2;
                    ny1 = ny2;
                }
            } else
            {
                that.draw(x2, y2);
            }
        }
        ;

    that.show = function (canvas, bgcolor, fgcolor, dim, n, m, b) {
        var i;

        that.window(canvas, bgcolor, fgcolor, dim);
        that.beginPath();
        //ctx.moveTo(b[0].x, b[0].y);
        for (i = 1; i < b.length; i++) {
            f(n, m, b[i - 1].x, b[i - 1].y, b[i].x, b[i].y);
        }
        that.stroke();
    };
    return that;
};

var mira = function () {
    var that = gwgraphic()
        , f = function (i, x, y, a, b) {
            var c = 2.0 - 2.0 * a;
            var w = a * x + c * x * x / (1 + x * x);
            while (i-- !== 0)
            {
                that.pset(x, y);
                var z = x;
                x = b * y + w;
                w = a * x + c * x * x / (1 + x * x);
                y = w - z;
            }
        }
        ;
    that.show = function (canvas, bgcolor, fgcolor, dim, i, x, y, a, b) {
        that.window(canvas, bgcolor, fgcolor, dim);
        f(i, x, y, a, b);
        that.render();
    };
    return that;
};

var henon = function () {
    var that = gwgraphic()
	, f = function(n) {
            var a, b, x, y, z, i, x1, y1;

            a = 0.24;
            b = Math.sqrt(1.0 - a * a);
            for (x1 = 0.0; x1 < 1.0; x1 += 0.15)
            {
                for (y1 = 0.0; y1 < 1.0; y1 += 0.15)
                {
                    i = n;
                    x = x1;
                    y = y1;
                    while (i-- !== 0 && Math.abs(x) + Math.abs(y) <= 10.0)
                    {
                        that.pset(x, y);
                        z = x;
                        x = x * a - (y - x * x) * b;
                        y = z * b + (y - z * z) * a;
                    }
                }
            }
        }
        ;
    that.show = function (canvas, bgcolor, fgcolor, dim, n) {
        that.window(canvas, bgcolor, fgcolor, dim);
        f(n);
        that.render();
    };
    return that;
};

var stof = function () {
    var that = gwgraphic();
    that.show = function (canvas, bgcolor, fgcolor, dim, n, a, b, c, d) {
        var f = function (n, x, y) {
            that.pset(x, y);
            if (n > 0)
            {
                f(n - 1, a * x - b * y, b * x + a * y);
                f(n - 1, c * x - d * y + 1.0 - c, d * x + c * y - d);
            }
        }
        ;

        that.window(canvas, bgcolor, fgcolor, dim);
        f(n, a, b);
        that.render();
    };
    return that;
};

var spiro = function (canvas, bgcolor, fgcolor, dim) {
    var that = gwgraphic()
        , gcd = function (a, b) {
            var temp;
            if (a < 0) { a = -a; }
            if (b < 0) { b = -b; }
            if (b > a) { temp = a; a = b; b = temp; }
            while (true) {
                a %= b;
                if (a === 0) { return b; };
                b %= a;
                if (b === 0) { return a; };
            };
            return b;
        }
        , AA = 6.47059E-2
        , BB = 0.31
        , stap = 2.0 * Math.PI / 100.0
        ;
    that.window(canvas, bgcolor, fgcolor, dim);
    that.show = function (ring, wiel, kleur, gat, startpos) {
        var rr = ring === 96 ? 3.05 : 3.3
            , factor = 2.0 * Math.PI / ring
            , cs = Math.cos(factor * startpos)
            , sn = Math.sin(factor * startpos)
            , ggdringwiel = gcd(ring, wiel)
            , wr = wiel / ring
            , a = 1.0 - wr
            , b = wr - (AA * (gat - 1.0) + BB) / rr
            , tmax = wiel / ggdringwiel * Math.PI * 2.0 + stap
            , t
            , x
            , y
            , plot_x
            , plot_y
            ;
        that.fgColor(kleur);
        that.beginPath();
        for (t = 0.0; t < tmax; t += stap) {
            x = a * Math.cos(t) + b * Math.cos(t - t / wr);
            y = a * Math.sin(t) + b * Math.sin(t - t / wr);
            plot_x = cs * x + sn * y;
            plot_y = -sn * x + cs * y;
            if (t === 0.0) {
                that.move(plot_x, plot_y);
            } else {
                that.draw(plot_x, plot_y);
            }
        }
        that.stroke();
    };
    return that;
};

addEventListener("load", function () {
    document.body.style.zoom = "1";
});
