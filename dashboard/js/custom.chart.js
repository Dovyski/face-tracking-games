// From: http://stackoverflow.com/questions/25388901/chart-js-x-axis

Chart.CustomScale = Chart.Scale.extend({
    draw: function () {
        var helpers = Chart.helpers;
        var each = helpers.each;
        var aliasPixel = helpers.aliasPixel;
        var toRadians = helpers.radians;
        var ctx = this.ctx,
            yLabelGap = (this.endPoint - this.startPoint) / this.steps,
            xStart = Math.round(this.xScalePaddingLeft);
        if (this.display) {
            ctx.fillStyle = this.textColor;
            ctx.font = this.font;
            each(this.yLabels, function (labelString, index) {
                var yLabelCenter = this.endPoint - (yLabelGap * index),
                    linePositionY = Math.round(yLabelCenter);

                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                if (this.showLabels) {
                    ctx.fillText(labelString, xStart - 10, yLabelCenter);
                }
                ctx.beginPath();
                if (index > 0) {
                    // This is a grid line in the centre, so drop that
                    ctx.lineWidth = this.gridLineWidth;
                    ctx.strokeStyle = this.gridLineColor;
                } else {
                    // This is the first line on the scale
                    ctx.lineWidth = this.lineWidth;
                    ctx.strokeStyle = this.lineColor;
                }

                linePositionY += helpers.aliasPixel(ctx.lineWidth);

                ctx.moveTo(xStart, linePositionY);
                ctx.lineTo(this.width, linePositionY);
                ctx.stroke();
                ctx.closePath();

                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.lineColor;
                ctx.beginPath();
                ctx.moveTo(xStart - 5, linePositionY);
                ctx.lineTo(xStart, linePositionY);
                ctx.stroke();
                ctx.closePath();

            }, this);

            each(this.xLabels, function (label, index) {
                //======================================================
                //apply the filter to the index if it is a function
                //======================================================
                if (typeof this.labelsFilter === "function" && this.labelsFilter(index)) {
                    return;
                }
                var xPos = this.calculateX(index) + aliasPixel(this.lineWidth),
                    // Check to see if line/bar here and decide where to place the line
                    linePos = this.calculateX(index - (this.offsetGridLines ? 0.5 : 0)) + aliasPixel(this.lineWidth),
                    isRotated = (this.xLabelRotation > 0);

                ctx.beginPath();

                if (index > 0) {
                    // This is a grid line in the centre, so drop that
                    ctx.lineWidth = this.gridLineWidth;
                    ctx.strokeStyle = this.gridLineColor;
                } else {
                    // This is the first line on the scale
                    ctx.lineWidth = this.lineWidth;
                    ctx.strokeStyle = this.lineColor;
                }
                ctx.moveTo(linePos, this.endPoint);
                ctx.lineTo(linePos, this.startPoint - 3);
                ctx.stroke();
                ctx.closePath();


                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.lineColor;


                // Small lines at the bottom of the base grid line
                ctx.beginPath();
                ctx.moveTo(linePos, this.endPoint);
                ctx.lineTo(linePos, this.endPoint + 5);
                ctx.stroke();
                ctx.closePath();

                ctx.save();
                ctx.translate(xPos, (isRotated) ? this.endPoint + 12 : this.endPoint + 8);
                ctx.rotate(toRadians(this.xLabelRotation) * -1);

                ctx.textAlign = (isRotated) ? "right" : "center";
                ctx.textBaseline = (isRotated) ? "middle" : "top";
                ctx.fillText(label, 0, 0);
                ctx.restore();

            }, this);

        }
    }
});

Chart.types.Line.extend({
    name: "LineAlt",
    initialize: function (data) {
        //======================================================
        //ensure the new option is part of the options
        //======================================================
        this.options.labelsFilter = data.labelsFilter || null;
        Chart.types.Line.prototype.initialize.apply(this, arguments);


    },
    buildScale: function (labels) {
        var helpers = Chart.helpers;
        var self = this;

        var dataTotal = function () {
            var values = [];
            self.eachPoints(function (point) {
                values.push(point.value);
            });

            return values;
        };
        var scaleOptions = {
            templateString: this.options.scaleLabel,
            height: this.chart.height,
            width: this.chart.width,
            ctx: this.chart.ctx,
            textColor: this.options.scaleFontColor,
            fontSize: this.options.scaleFontSize,
            //======================================================
            //pass this new options to the scale object
            //======================================================
            labelsFilter: this.options.labelsFilter,
            fontStyle: this.options.scaleFontStyle,
            fontFamily: this.options.scaleFontFamily,
            valuesCount: labels.length,
            beginAtZero: this.options.scaleBeginAtZero,
            integersOnly: this.options.scaleIntegersOnly,
            calculateYRange: function (currentHeight) {
                var updatedRanges = helpers.calculateScaleRange(
                dataTotal(),
                currentHeight,
                this.fontSize,
                this.beginAtZero,
                this.integersOnly);
                helpers.extend(this, updatedRanges);
            },
            xLabels: labels,
            font: helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
            lineWidth: this.options.scaleLineWidth,
            lineColor: this.options.scaleLineColor,
            gridLineWidth: (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
            gridLineColor: (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
            padding: (this.options.showScale) ? 0 : this.options.pointDotRadius + this.options.pointDotStrokeWidth,
            showLabels: this.options.scaleShowLabels,
            display: this.options.showScale
        };

        if (this.options.scaleOverride) {
            helpers.extend(scaleOptions, {
                calculateYRange: helpers.noop,
                steps: this.options.scaleSteps,
                stepValue: this.options.scaleStepWidth,
                min: this.options.scaleStartValue,
                max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
            });
        }

        //======================================================
        //Use the new Custom Scal that will make use of a labelsFilter function
        //======================================================
        this.scale = new Chart.CustomScale(scaleOptions);
    }
});
