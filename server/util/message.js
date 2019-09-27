var moment= require('moment');
var genaratemsg=(from, text)=>{
    return{
        from,
        text,
        createAt: moment().valueOf()
    };
};

var genaratelocationmsg=(from, latitude, longitude)=>{
    return{
        from,
        url:`https://www.google.com/maps?q=${latitude}, ${longitude}`,
        createAt:moment().valueOf()
    };
};
module.exports={genaratemsg,genaratelocationmsg};