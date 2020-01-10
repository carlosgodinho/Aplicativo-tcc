
export class MetodosHelper {

    public static formataData(dt: any) {
        var date = null;
        if (dt === undefined) {
            return '\'\'';
        }
        if (dt instanceof Date) {
            date = dt
        } else {
            date = new Date(dt);
        }
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        var hh = date.getHours();
        var mm = date.getMinutes();
        var ss = date.getSeconds();
        return (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y
            + ' ' + (hh <= 9 ? '0' + hh : hh) + ':' + (mm <= 9 ? '0' + mm : mm) + ':' + (ss <= 9 ? '0' + ss : ss);
    }

}