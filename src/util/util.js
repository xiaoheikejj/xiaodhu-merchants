export let date = {
    _date_cur_date: new Date(),
    _date_reg_all: /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9]):(0?[0-9]|[1-5][0-9])$/,
    _date_reg_year_month: /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])$/,
    _date_reg_year_month_date: /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1])$/,
    _date_reg_year_month_date_hour: /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3])$/,
    _date_reg_year_month_date_hour_minute: /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9])$/,
    _date_reg_time: /^(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9]):(0?[0-9]|[1-5][0-9])$/,

    /***
     * @param {Object|Number|String} date
     * @param {Object} format
     */
    getdate: function (date, format) {
        var now = this.tojsdate(date),
            year = now.getFullYear(),
            month = (now.getMonth() + 1),
            day = now.getDate(),
            hour = now.getHours(),
            minute = now.getMinutes(),
            second = now.getSeconds(),
            result,
            fill = function (val) {
                return (val < 10 ? "0" : "") + val;
            };
        month = fill(month);
        day = fill(day);
        hour = fill(hour);
        minute = fill(minute);
        second = fill(second);

        switch (format) {
            case "YY-MM":
                result = year + "-" + month;
                break;
            case "MM-DD":
                result = month + "-" + day;
                break;
            case "YY-MM-DD":
                result = year + "-" + month + "-" + day;
                break;
            case "YY-MM-DD HH:MM:SS":
                result = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
                break;
            case "YY-MM-DD HH:MM":
                result = year + "-" + month + "-" + day + " " + hour + ":" + minute;
                break;
            case "YY/MM/DD HH:MM":
                result = year + "/" + month + "/" + day + " " + hour + ":" + minute;
                break;
            case "HH:MM":
                result = hour + ":" + minute;
                break;
            case "HH:MM:SS":
                result = hour + ":" + minute + ":" + second;
                break;
            default:
                result = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
        }
        return result;
    },
    // 以后所有的时间都从这块来, 这块的时间将会配合时间矫正来处理.
    getcurdate: function () {
        return new Date(this._date_cur_date);
    },
    // 转化成为js 的时间
    tojsdate: function (date) {
        if (!this.is_date(date)) {
            return this.getcurdate();
        }
        if (typeof date === "string") {
            if (/^\d{11,}$/.test(date)) {
                return new Date(+date);
            }
            date = date.replace(/-/g, "/");
            if (this._date_reg_year_month.test(date)) {
                date += "/01";
            }
        }
        return new Date(date);
    },
    /**
     *
     *  Number y、mo、d、h、m、s 分别表示年/月/日/小时/分/秒.  如果没带后缀, 则默认为天.
     *  @param {Object|Number|String} oldDate
     *  @param {String|Number} changeDate
     */
    getdiffdate: function (oldDate, changeDate, format) {
        var curDate = this.tojsdate(oldDate);
        if (/^(-?\d+)y$/.test(changeDate)) {
            curDate.setFullYear(curDate.getFullYear() + (+RegExp.$1));
        } else if (/^(-?\d+)mo$/.test(changeDate) && RegExp.$1 !== 0) {
            // 缓存当前的天
            let _cacheDay = curDate.getDate();

            // 重置到月初. 如果当前的 getDate() 大于目标月的最大日期就悲剧了
            curDate.setDate(1);

            // 设置月份
            curDate.setMonth(curDate.getMonth() + (+RegExp.$1));
            curDate.setDate(_cacheDay);

            if (curDate.getDate() !== _cacheDay) {
                // 上个月的最后一天
                curDate.setDate(0);
            }
        } else if (/^(-?\d+)d$/.test(changeDate)) {
            curDate.setDate(curDate.getDate() + (+RegExp.$1));
        } else if (/^(-?\d+)h$/.test(changeDate)) {
            curDate.setHours(curDate.getHours() + (+RegExp.$1));
        } else if (/^(-?\d+)m$/.test(changeDate)) {
            curDate.setMinutes(curDate.getMinutes() + (+RegExp.$1));
        } else if (/^(-?\d+)s$/.test(changeDate)) {
            curDate.setSeconds(curDate.getSeconds() + (+RegExp.$1));
        }
        return this.getdate(curDate, format);
    },
    calculate: function (date, offset, format = "YY-MM-DD") {
        let timestamp = new Date(date);
        let calculateDate = timestamp.setDate(timestamp.getDate() + offset);
        return this.getdate(calculateDate, format);
    },
    format_date: function (date) {
        if (!date || !this.is_date(date)) {
            return false;
        }
        var reg = this._date_reg_time;
        if (reg.test(date)) {
            return date.replace(/-/g, "/");
        } else {
            return this.getdate(date);
        }
    },
    is_date: function (date) {
        if (!date || date === null) {
            return false;
        }
        var newdate;
        if (typeof date === "string") {
            if (/^\d{11,}$/.test(date)) {
                newdate = new Date(+date);
                return newdate !== "Invalid Date";
            }
            return this._date_reg_all.test(date) ||
                this._date_reg_year_month.test(date) ||
                this._date_reg_year_month_date.test(date) ||
                this._date_reg_year_month_date_hour.test(date) ||
                this._date_reg_year_month_date_hour_minute.test(date);
        }
        newdate = new Date(date);
        return newdate !== "Invalid Date";
    }
};