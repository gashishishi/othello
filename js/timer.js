jQuery(function(){
    function timerLoop(maxCount, i) {
        if (i <= maxCount && $('#timer').hasClass('timerActive')) {
            timer();
            setTimeout(() => {timerLoop(maxCount, ++i)}, 1000);
        }
    }

    function timer(){
        let timeStr = $('#timer').text().trim();
        if(timeStr != '##:##:##'){
            let time = timeStr.split(':')

            let second = parseInt(time[2], 10);
            let minute = parseInt(time[1], 10);
            let hour = parseInt(time[0], 10);
            second += 1;
            if(60 <= second){
                second = 0;
                minute += 1;
            }
            if(60 <= minute){
                minute = 0;
                hour += 1;
            }

            if(100 <= hour){
                $('#timer').text('##:##:##');
            } else {
                second = (second < 10) ? '0' + second : second;
                minute = (minute < 10) ? '0' + minute : minute;
                hour = (hour < 10) ? '0' + hour : hour;
                $('#timer').text([hour, minute, second].join(':'));
            }
        }
        
    }

    $('#first-second').click(function(){
        console.log('timerstart');
        $('#timer').addClass('timerActive');
        // 100時間までは繰り返す
        setTimeout(() => {timerLoop(360000,1)}, 1000);
    });
});