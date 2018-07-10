import {moment} from "../lib/moment/moment.js"
export default {
    recent7Days() {
        var dateTo = moment().subtract(1,'d').format('YYYY-MM-DD');
        var dateFrom = moment().subtract(7,'d').format('YYYY-MM-DD');
        return [dateFrom,dateTo];
    },
    recent30Days() {
        var dateTo = moment().subtract(1,'d').format('YYYY-MM-DD');
        var dateFrom = moment().subtract(30,'d').format('YYYY-MM-DD');
        return [dateFrom,dateTo];
    },
    recent1Year() {
        var dateTo = moment().subtract(1,'d').format('YYYY-MM-DD');
        var dateFrom = moment().subtract(1,'y').format('YYYY-MM-DD');
        return [dateFrom,dateTo];
    }
 }
 